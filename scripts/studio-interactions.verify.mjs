import assert from 'node:assert/strict'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
const { chromium } = await import('playwright').catch(() => import('../../.verification/frontend-tools/node_modules/playwright/index.mjs'))
const baseline = process.argv.includes('--baseline')
const origin = process.env.STUDIO_TEST_ORIGIN || 'http://127.0.0.1:4187'
const output = new URL('../../.verification/studio-interactions/' + (baseline ? 'before/' : 'after/'), import.meta.url)
await mkdir(output, { recursive: true })
const path = name => fileURLToPath(new URL(name, output))
const browser = await chromium.launch({ executablePath: process.env.STUDIO_CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const checks = [], errors = [], audits = [], resources = []
const pass = name => { checks.push(name); console.log('PASS', name) }
const context = await browser.newContext()
const page = await context.newPage()
page.on('pageerror', error => errors.push(error.message))
page.on('request', request => resources.push(request.url()))
async function axe(name) {
  await page.addScriptTag({ path: fileURLToPath(new URL('../../.verification/frontend-tools/node_modules/axe-core/axe.min.js', import.meta.url)) })
  const result = await page.evaluate(() => window.axe.run(document.querySelector('.im-studio'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] } }))
  await writeFile(path('axe-' + name + '.json'), JSON.stringify(result, null, 2))
  assert.deepEqual(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [])
  audits.push({ name, violations: 0, incomplete: result.incomplete.map(v => v.id) })
}
const tab = name => page.getByRole('tab', { name: new RegExp(name) })
try {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 })
    await page.goto(origin + '/studio')
    await page.evaluate(() => document.fonts.ready)
    await page.locator('.im-official-art img').evaluate(img => img.decode())
    await page.waitForTimeout(1600)
    await page.locator('.im-hero').screenshot({ path: path('hero-' + width + '.png') })
    for (const [name, id] of [['Business websites', 'website'], ['Custom web applications', 'application'], ['Backend systems', 'systems']]) {
      await tab(name).click()
      const panel = page.locator('.im-expertise-panel:visible')
      await panel.scrollIntoViewIfNeeded()
      await page.waitForTimeout(600)
      await panel.screenshot({ path: path(id + '-' + width + '.png') })
      await axe(id + '-' + width)
    }
  }
  pass('Desktop and mobile screenshots; six service-state accessibility audits')
  if (!baseline) {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await tab('Business websites').click()
    const desktop = await page.locator('.im-website-preview').boundingBox()
    await page.getByRole('button', { name: 'Mobile', exact: true }).click()
    await page.waitForTimeout(120)
    const intermediate = await page.locator('.im-website-preview').boundingBox()
    assert.ok(intermediate.width < desktop.width && intermediate.width > 210, 'Preview width should interpolate')
    await page.waitForTimeout(600)
    assert.ok((await page.locator('.im-website-preview').boundingBox()).width < desktop.width - 40)
    assert.equal(await page.getByRole('button', { name: 'Mobile', exact: true }).getAttribute('aria-pressed'), 'true')
    await page.locator('.im-study-website').screenshot({ path: path('website-mobile-form.png') })
    await page.getByRole('button', { name: 'Desktop', exact: true }).click()
    await page.waitForTimeout(700)
    assert.ok(Math.abs((await page.locator('.im-website-preview').boundingBox()).width - desktop.width) < 1)
    pass('Responsive preview changes layout and restores its original width')
    await tab('Custom web applications').click()
    const taskHeight = (await page.locator('.im-app-tasks').boundingBox()).height
    for (const [filter, titles] of [['Design', ['Homepage direction']], ['Engineering', ['Enquiry flow', 'Data import']], ['All', ['Homepage direction', 'Enquiry flow', 'Data import']]]) {
      await page.getByRole('button', { name: filter, exact: true }).click()
      await page.waitForTimeout(350)
      assert.deepEqual(await page.locator('.im-app-tasks strong').allTextContents(), titles)
      assert.equal((await page.locator('.im-app-tasks').boundingBox()).height, taskHeight)
      assert.match(await page.locator('.im-study-application [role=status]').innerText(), new RegExp('^' + titles.length + ' '))
      assert.equal(await page.getByRole('button', { name: filter, exact: true }).getAttribute('aria-pressed'), 'true')
    }
    await page.getByRole('button', { name: 'Design', exact: true }).focus()
    await page.keyboard.press('Enter')
    assert.equal(await page.locator('.im-app-tasks strong').count(), 1)
    pass('All filters produce exact task sets, count feedback and keyboard activation')
    await tab('Backend systems').click()
    for (const [name, text] of [['Backend API', 'validates'], ['Your tools', 'business tool'], ['Website', 'visitor sends']]) {
      await page.getByRole('button', { name, exact: true }).click()
      assert.match(await page.locator('.im-system-description').textContent(), new RegExp(text))
    }
    for (const stage of [1, 2, 0]) {
      await page.locator('.im-system-trace').click()
      assert.equal(await page.locator('.im-system-map button[aria-pressed=true]').getAttribute('data-stage'), String(stage))
      await page.waitForTimeout(700)
    }
    await page.locator('.im-system-trace').focus()
    await page.keyboard.press('Enter')
    assert.equal(await page.getByRole('button', { name: 'Backend API', exact: true }).getAttribute('aria-pressed'), 'true')
    await page.locator('.im-study-systems').screenshot({ path: path('systems-trace.png') })
    pass('Selectable nodes and deliberate enquiry trace advance in architecture order')
    await tab('Business websites').focus()
    await page.keyboard.press('ArrowDown')
    assert.equal(await tab('Custom web applications').getAttribute('aria-selected'), 'true')
    await page.keyboard.press('End')
    assert.equal(await tab('Backend systems').getAttribute('aria-selected'), 'true')
    await page.keyboard.press('Home')
    assert.equal(await tab('Business websites').getAttribute('aria-selected'), 'true')
    pass('Service tabs retain arrow, Home and End navigation')
    for (const width of [320, 360, 390, 768, 1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 })
      for (const name of ['Business websites', 'Custom web applications', 'Backend systems']) {
        await tab(name).click()
        await page.waitForTimeout(150)
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Overflow: ' + width + ' ' + name)
        assert.deepEqual(await page.locator('.im-study').evaluate(root => [...root.querySelectorAll('button,strong,.im-system-description')].filter(e => e.getClientRects().length && e.scrollWidth > e.clientWidth + 2).map(e => e.textContent)), [], 'Clipped study content: ' + width)
      }
    }
    pass('Eight viewport widths and all three demos have no horizontal overflow or clipped controls')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.locator('.im-system-trace').click()
    assert.equal(await page.locator('.im-system-map').evaluate(e => e.getAnimations({ subtree: true }).length), 0)
    await tab('Custom web applications').click()
    await page.getByRole('button', { name: 'Design', exact: true }).click()
    assert.equal(await page.locator('.im-app-tasks').evaluate(e => e.getAnimations({ subtree: true }).length), 0)
    await axe('reduced-motion')
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.getByRole('button', { name: 'Reduce motion', exact: true }).click()
    await tab('Business websites').click()
    await page.getByRole('button', { name: 'Mobile', exact: true }).click()
    assert.equal(await page.locator('.im-study').evaluate(e => e.getAnimations({ subtree: true }).length), 0)
    pass('OS reduced motion and existing page motion toggle disable demo animation')
    const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
    const mobile = await touch.newPage()
    await mobile.goto(origin + '/studio')
    await mobile.getByRole('tab', { name: /Backend systems/ }).tap()
    await mobile.locator('.im-system-trace').tap()
    assert.equal(await mobile.getByRole('button', { name: 'Backend API', exact: true }).getAttribute('aria-pressed'), 'true')
    await touch.close()
    pass('Touch can activate service and trace controls')
    assert.equal(resources.some(url => /living-emblem|three.module|emblem-geometry|\/api\//.test(url)), false)
    assert.equal(resources.some(url => new URL(url).origin !== origin), false)
    pass('No 3D runtime, backend requests or external runtime services')
    for (const width of [1440, 390]) {
      const before = await readFile(new URL('../../.verification/studio-interactions/before/hero-' + width + '.png', import.meta.url)).catch(error => { if (error.code === 'ENOENT') return null; throw error })
      if (before) assert.ok(before.equals(await readFile(path('hero-' + width + '.png'))), 'Hero visual changed at ' + width)
    }
    pass('Desktop and mobile hero screenshots remain byte-identical to the approved baseline')
  }
  const logo = await readFile(new URL('../public/studio/brand-logo.webp', import.meta.url))
  const { createHash } = await import('node:crypto')
  assert.equal(createHash('sha256').update(logo).digest('hex'), '2a5a59b107a40d5a545c8b2552194db154bb6c69c449d96e6a15474d4ce650a3', 'Approved logo bytes changed')
  const summary = { origin, browser: await browser.version(), checks, audits, errors, logoSha256: createHash('sha256').update(logo).digest('hex') }
  assert.deepEqual(errors, [])
  await writeFile(path('results.json'), JSON.stringify(summary, null, 2))
} finally { await browser.close() }
