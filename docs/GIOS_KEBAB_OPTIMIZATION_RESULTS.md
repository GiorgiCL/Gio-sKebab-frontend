# Gio's Kebab performance optimization — measured results

Completed 20 October 2026. **Final verdict: CONDITIONAL PASS.** The implemented frontend is substantially faster and more stable, preserves the tested application behavior, and passes the build, lint and automated accessibility checks. Mobile LCP remains above the requested 2.5-second objective, two mobile medians are 89 rather than 90+, and the isolated RU blocking-time spike remains a recorded variability limit. This is not an unconditional production launch certification.

## 1. Executive summary

The healthy current LT mobile baseline improved from **66 to 89 Performance**, **5.118 to 3.480 s LCP** (32.0% lower), **0.212 to 0.006 CLS** (97.0% lower), and **2.712 to 1.955 s FCP**. The original audit's separate LT baseline was 65 / 5.113 s / 0.230 / 2.709 s; it is not substituted for the newly measured starting point.

Final mobile medians are LT 89, EN 90, RU 89 and KA 90. Restaurant desktop medians are 99–100. Every restaurant Lighthouse Accessibility, Best Practices and SEO category in the final matrix is 100. Studio remains intentionally noindex (SEO 69), with its tested imagery and layout preserved exactly.

Actual audited LT mobile JavaScript transfer fell 24.1%; image transfer fell 73.5%. No new runtime dependencies, commits, pushes, deployments, database provisioning, backend changes or restaurant-data writes occurred.

## 2. Safety, environment and comparability

Frontend: development, initial HEAD 330f6043e21d7ae654ba569087853065a77ca1f3. Backend: development, initial HEAD bcab789a6c6278cd60985293929c745b67b9d310. Both application working trees were initially clean; the only pre-existing untracked frontend file on resumption was this session's earlier prerequisite-blocker report. The full original audit and repository instructions were read. Current Studio interactions and its PUSH-navigation scroll-to-top fix were retained; no Studio source file changed.

The previous prerequisite failure was resolved by the operator starting the existing backend. All six required public endpoints returned healthy JSON 200 **through http://127.0.0.1:4187**, including restaurant, opening-status, opening-hours, menu, lunch-menu and promotions. Menu data remained 9 categories / 51 items; lunch 7 days / 2 items. The initial service investigation and the later healthy checks are preserved separately. No credentials were invented or exposed.

Production builds used npm run build (TypeScript + Vite 8.3.1), served by npm run preview -- --host 127.0.0.1 --port 4187 --strictPort. Lighthouse 13.5.0, Chrome 155.0.8059.80, Node v25.2.1, installed Playwright Core 1.64.1 and axe-core 4.14.0 match the original toolchain. Mobile: 390×844, DPR 1.75, simulated default mobile throttling (150 ms RTT, 1,638.4 Kbps throughput, CPU 4×). Desktop: 1440×1000, DPR 1, 40 ms RTT, 10,240 Kbps, CPU 1×. Each Lighthouse navigation launched fresh Chrome, with storage reset. No other audit browser, build, lint or functional suite ran during the final measurements.

The original October audit ran shortly after midnight; current measurements ran during daytime opening hours. Dynamic opening text can therefore differ. No claim is made that live clock-dependent responses are byte-identical. A new 30-run current baseline controls for the subsequent Studio changes and current environment. Original translated homepages had one sample each; current baseline and final homepages have three per language/device. Legal final checks are single observations per route/device, not three-run estimates. All values are local simulated lab results, not field p75 LCP/CLS/INP.

Recorded navigation-start timestamps (UTC): current baseline 2026-10-20T09:09:23.108Z through 2026-10-20T09:13:13.735Z; final homepage/Studio matrix 2026-10-20T09:46:23.563Z through 2026-10-20T09:50:07.655Z; final legal matrix 2026-10-20T09:50:19.612Z through 2026-10-20T09:52:05.297Z. Diagnostic repeats are timestamped separately in their raw reports.

## 3. Implemented changes and verified causes

1. Accessible names now contain visible LT/EN/RU/KA codes and mobile Menu/Close labels. Language links use their visible code plus language name. Existing locale paths, query/hash preservation, details behavior, Escape, focus return and mobile aria-expanded/aria-controls remain.
2. Closing logo artwork moved into the existing main landmark at the same visual position. No extra ARIA region was introduced.
3. Responsive loading rows reserve the profile description, translated delivery helper, provider controls and opening-status line. Paragraph line reservations follow locale and narrow-width wrapping; loaded content uses natural height. Empty/error states remove placeholders, long owner text remains visible, and no permanent fixed hero height was introduced.
4. A hero-only local Times New Roman/Liberation Serif fallback is size-adjusted to 72%, based on measured title width (Instrument Serif 282.624 px versus Times New Roman 393.781 px at 64 px). The loaded font, body fonts and Studio typography are unchanged. In delay probes, LT hero height changed from about 453→670 px before the fix, versus 669.563→669.594 px afterward. Late profile shift diagnostics fell from 0.104 to about 0.006; late-font diagnostics from 0.040 to about 0.003. These observer diagnostics are distinct from Lighthouse medians.
5. Original hero/cutout masters remain unchanged. Reviewed WebP derivatives provide hero 640/800/960/1280 widths and menu 400/640 widths, with truthful width descriptors and responsive sizes accounting for the hero's cover crop. Intrinsic master dimensions are corrected to 1672×941 and 980×735. Object-fit, object-position, masks and rotation are retained. Existing FFmpeg/libwebp produced Lanczos derivatives (quality 82 hero, 86 menu); no image service or runtime dependency was added.
6. Static locale homepage entry documents expose responsive high-priority image preload discovery in HTML. Both /lt and /lt/ forms are supported, likewise EN/RU/KA, without redirecting preview navigation. The shared SPA shell for Studio, legal and owner routes contains no restaurant image preload. Critical font hints are limited to observed hero faces for each locale; there is no blanket/global preload. The root / client redirect still uses the shared shell, so its initial discovery differs from a direct locale visit.
7. One lazy owner-module boundary excludes CMS screens, owner translations and owner CSS from public navigation. Session/remember-me/CSRF implementations and API contracts were not edited. Loading and module-failure recovery are accessible. No manual vendor splitting was added.
8. Legal documents and their CSS now load with legal routes; shared footer labels/business identity moved to a small shared module. Legal text content was preserved.
9. The menu illustration's existing stable box loads its decorative image within 200 px of viewport visibility, instead of relying on the browser's much wider native lazy-load proximity. Scrolling loads the same artwork before it is needed; actual visibility behavior was tested. This avoids the initial 93 KB mobile menu-image request in the recorded LT load.
10. Responsive restaurant logo derivatives and a small matching favicon preserve the original master/social metadata. Header and closing-logo geometry is unchanged. Manual computed-color inspection found the existing orange focus outline at 2.17:1 on cream; light restaurant/legal areas now use the existing ember color, measuring 4.96–5.36:1. Dark-area focus remains orange at about 7.09:1.

The original hypotheses are now separated from evidence: profile arrival and font wrapping both cause movement, rather than a font-only problem; responsive images demonstrably reduce transferred bytes; eager owner/legal imports demonstrably add public payload; parser discovery was false and is now true. Existing intrinsic image-attribute errors were corrected, but were not established as the primary CLS cause. Low median TBT did not justify handler rewrites or removal of coverage-only CSS.

## 4. Files modified

- index.html; vite.config.ts; build/restaurantHtml.ts.
- src/app/router.tsx; PublicLocaleLayout.tsx; new OwnerRouteError.tsx.
- src/features/admin/routeModules.ts (new export boundary; no auth/API/editor implementation changes).
- src/features/public/PublicHome.tsx; PublicNavigation.tsx; public.css; components/MenuSection.tsx; LegalPages.tsx; legalText.ts.
- New public helpers: brandImage.ts; heroImage.ts; heroImageSizes.ts; legalNavigation.ts.
- New brand assets: gios-kebab-logo-128.webp, -256.webp, -512.webp.
- New restaurant assets: hero-grill-640.webp, -800.webp, -960.webp, -1280.webp; kebab-cutout-400.webp, -640.webp.
- This results document. Local audit harnesses/reports are under ../../.verification/gios-optimization-2026-10-20/, outside both application repositories.

## 5. Lighthouse category comparison

Category order is Performance / Accessibility / Best Practices / SEO. Original P is from the prior October audit (LT and Studio three runs; other home languages one). Current and final columns below use three samples per row.

| Route / device | Original audit P | Current baseline P: runs; median (range) | Final P: runs; median (range) | Final A / BP / SEO |
| --- | --- | --- | --- | --- |
| /lt mobile | 65 | 66 / 67 / 65; **66** (65–67) | 89 / 89 / 89; **89** (89–89) | 100 / 100 / 100 |
| /lt desktop | 98 | 98 / 98 / 98; **98** (98–98) | 100 / 100 / 100; **100** (100–100) | 100 / 100 / 100 |
| /en mobile | 69 | 68 / 75 / 69; **69** (68–75) | 90 / 90 / 90; **90** (90–90) | 100 / 100 / 100 |
| /en desktop | 99 | 99 / 98 / 98; **98** (98–99) | 100 / 100 / 100; **100** (100–100) | 100 / 100 / 100 |
| /ru mobile | 74 | 74 / 74 / 74; **74** (74–74) | 89 / 89 / 83; **89** (83–89) | 100 / 100 / 100 |
| /ru desktop | 98 | 99 / 99 / 99; **99** (99–99) | 100 / 100 / 100; **100** (100–100) | 100 / 100 / 100 |
| /ka mobile | 72 | 72 / 73 / 72; **72** (72–73) | 90 / 90 / 90; **90** (90–90) | 100 / 100 / 100 |
| /ka desktop | 98 | 98 / 98 / 98; **98** (98–98) | 99 / 99 / 99; **99** (99–99) | 100 / 100 / 100 |
| /studio mobile | 88 | 86 / 88 / 88; **88** (86–88) | 91 / 90 / 90; **90** (90–91) | 100 / 100 / 69 |
| /studio desktop | 100 | 100 / 100 / 100; **100** (100–100) | 100 / 100 / 100; **100** (100–100) | 100 / 100 / 69 |

## 6. Core metrics before/after

These compare the **current pre-change three-run baseline** with the final three-run medians. Seconds are shown to three decimals, CLS is unitless, TBT is milliseconds. Per-run values appear in the appendix; rounding can make small nonzero ranges look equal.

| Route / device | FCP before → after (s) | LCP before → after (s); final range | CLS before → after; final range | TBT before → after (ms) | Speed Index before → after (s) |
| --- | --- | --- | --- | --- | --- |
| /lt mobile | 2.712 → 1.955 | 5.118 → 3.480; 3.477–3.481 | 0.212 → 0.006; 0.006–0.006 | 7 → 8 | 2.712 → 1.955 |
| /lt desktop | 0.569 → 0.448 | 1.033 → 0.765; 0.746–0.765 | 0.052 → 0.004; 0.004–0.004 | 0 → 0 | 0.569 → 0.448 |
| /en mobile | 2.406 → 2.106 | 4.884 → 3.403; 3.403–3.404 | 0.217 → 0.004; 0.004–0.004 | 31 → 15 | 2.406 → 2.106 |
| /en desktop | 0.528 → 0.446 | 1.009 → 0.767; 0.765–0.806 | 0.051 → 0.003; 0.003–0.003 | 0 → 0 | 0.559 → 0.446 |
| /ru mobile | 2.406 → 2.257 | 4.883 → 3.405; 3.404–3.409 | 0.140 → 0.008; 0.008–0.008 | 29 → 23 | 2.406 → 2.257 |
| /ru desktop | 0.526 → 0.446 | 0.989 → 0.747; 0.745–0.786 | 0.051 → 0.005; 0.005–0.006 | 0 → 0 | 0.526 → 0.446 |
| /ka mobile | 2.557 → 2.106 | 5.037 → 3.403; 3.403–3.410 | 0.148 → 0.005; 0.005–0.005 | 8 → 9 | 2.557 → 2.106 |
| /ka desktop | 0.486 → 0.445 | 0.949 → 0.765; 0.764–0.765 | 0.054 → 0.053; 0.053–0.056 | 0 → 0 | 0.486 → 0.445 |
| /studio mobile | 2.030 → 2.030 | 3.606 → 3.382; 3.382–3.382 | 0.003 → 0.003; 0.003–0.003 | 0 → 0 | 2.030 → 2.030 |
| /studio desktop | 0.465 → 0.426 | 0.746 → 0.707; 0.706–0.707 | 0.004 → 0.004; 0.004–0.004 | 0 → 0 | 0.465 → 0.426 |

## 7. Incremental attribution

Each controlled stage below has three LT mobile measurements and separate raw reports. Stability alone fixed most CLS without solving LCP. Font hints reduced FCP; they did not establish achievement of the 2.5 s LCP target. An interrupted admin-split pilot overlapped the tail of lint; its one sample is preserved in admin-split/ and excluded. admin-split-controlled/ is the valid replacement, not a selected best sample.

| Build / LT mobile, 3 runs each | Performance median | FCP s | LCP s | CLS | JS transfer bytes | Image transfer bytes |
| --- | --- | --- | --- | --- | --- | --- |
| Current baseline | 66 | 2.712 | 5.118 | 0.212 | 160502 | 488752 |
| stability | 76 | 2.710 | 5.268 | 0.011 | 160639 | 488752 |
| images | 81 | 2.708 | 4.362 | 0.028 | 160954 | 241814 |
| admin-split-controlled | 82 | 2.557 | 4.210 | 0.011 | 137693 | 241814 |
| early-image | 83 | 2.560 | 4.068 | 0.011 | 137693 | 241814 |
| legal-split | 84 | 2.558 | 3.912 | 0.011 | 121446 | 241814 |
| deferred-art | 86 | 2.559 | 3.688 | 0.009 | 121546 | 148564 |
| branding | 87 | 2.559 | 3.487 | 0.011 | 121691 | 129661 |
| title-font | 87 | 2.408 | 3.554 | 0.009 | 121691 | 129661 |
| hero-fonts | 89 | 1.956 | 3.481 | 0.006 | 121691 | 129661 |
| Final | 89 | 1.955 | 3.480 | 0.006 | 121790 | 129661 |

## 8. Actual transfers and image selection

| LT mobile navigation | Before bytes (KiB) | After bytes (KiB) | Reduction |
| --- | --- | --- | --- |
| JavaScript | 160502 (156.7) | 121790 (118.9) | 24.1% |
| Images | 488752 (477.3) | 129661 (126.6) | 73.5% |
| Fonts | 111524 (108.9) | 111524 (108.9) | 0.0% |
| Stylesheets | 20296 (19.8) | 13603 (13.3) | 33.0% |
| Total audited transfer | 796982 (778.3) | 392840 (383.6) | 50.7% |

These are sums of Lighthouse network-request transferSize by resource type, including response overhead, rather than raw source sizes or opportunity estimates. Total audited image bytes can include later screenshots/lazy requests; they do not mean every below-fold image is needed for the first viewport. A full-page cold audit is not a complete later browsing-session budget.

The original 243,472-byte hero master is preserved. The mobile DPR 1.75 hero selected the **800×450 derivative, 81,534-byte body**, versus the original 243,472-byte body (about 66.5% smaller). Header logo 128×128 is 4,642 bytes; 256 and 512 variants are 12,050 and 27,342 bytes. Menu variants are 41,838 and 92,982 bytes. Initial mobile hero selection, actual currentSrc, source dimensions, timing and transfer are saved in final/resources/summary.json. Fifteen width/DPR combinations (320/390/768/1100/1440 × 1/1.75/2.5) selected exactly one hero resource each; high-DPR desktop can reach the unchanged 1672-pixel master limit, not an upscaled replacement.

Source/master SHA-256 checks are retained in image-derivatives.json; the original files were not recompressed. UI screenshot review preserves composition and crop; reduced file bytes are not represented as pixel-identical photography. Public initial JavaScript has two automatically generated chunks; network tests confirm no owner or legal-document chunk on the homepage. Admin-only CSS is 37.22 KB raw / about 7.56 KB gzip in its lazy boundary; shared CSS is approximately 58.20 KB raw / 13.3 KB gzip. No CSS was deleted on initial-state coverage alone.

## 9. Accessibility and functional verification

- 26 full route/device browser + axe scans: all four homepages, eight translated legal routes, Studio, mobile and desktop; zero reported violations and zero unexpected console/network/runtime errors in those public scans.
- 24 additional settled-state mobile axe scans across four languages: closed controls, open language list, open mobile navigation, product dialog, privacy and business pages; zero violations. Escape, focus restoration and menu state assertions pass. The initial expanded-menu scan ran during the 200 ms fade and reported transient blended contrast; its raw result is retained, and the corrected harness waits for computed opacity 1.
- 17/17 main interaction checks pass: skip link, category hash/focus, product focus containment/return, lunch keyboard/day navigation and product dialog, translated API/content, preserved legal path/query/hash switching, safe external delivery links, direct anchors, owner gate, Studio tabs/copy/deferred film/seek, responsive overflow and reduced motion.
- 6/6 supplemental checks pass, including API outage/retry recovery, legal fallback, keyboard categories, static route/content types, unknown-page noindex and film seeking.
- 176/176 edge cases pass: 160 locale×width×state samples plus 16 independent response/font delays. Widths 320, 390, 768, 1100 and 1440; empty/long/missing profiles; no/one/two providers; empty lunch; blocked fonts; and profile/status/lunch/font arrival orders. No description clipping, page overflow or JavaScript exception was reproduced. Delay observer CLS was approximately 0.002–0.012 across languages; these are not simulated Lighthouse results. Arbitrary owner text still determines natural geometry; no zero-CLS guarantee is made for every unbounded text or delayed failure response.
- 5/5 targeted missing-image, price/allergen/dialog-focus and profile/menu/lunch retry checks pass using browser interception only. Price expectations use the browser's Intl implementation: the first Node-Intl expectation disagreed with Chrome's Georgian formatting and was corrected in the test harness, without changing application formatting.
- Cold/warm navigations, hero DPR selection, deferred-art visibility and route resource isolation pass. Direct Studio and legal visits request no hero/cutout/owner chunk. No provider order was placed and no message was sent; clipboard copying was local testing only.

Manual solid-color evidence is in final/manual-contrast.json: hero CTA text 6.53:1, menu text 14.91:1, legal text 15.12:1, and corrected light-area focus at least 4.95:1. These are computed sRGB pairs from actual styles, not a complete pixel/gradient audit. axe still marks incomplete contrast checks for clipping/overlap/gradients (including many offscreen menu nodes), the bitmap Wolt visible-name check, and a generic labelled order container. Incomplete is not reported as either a violation or a pass. Full NVDA/VoiceOver, physical-device, zoom and all image-background focus cases remain unverified; no blanket WCAG-conformance claim is made.

## 10. Owner/admin confidence and limitations

7/7 owner checks pass. All seven real unauthenticated deep links resolve to the login gate/noindex, with GET-only requests. Browser-only fixtures exercise remember-me login, CSRF acquisition/header renewal, profile edit/save with translation payloads, six authenticated screen refreshes, 403 plus expired-session redirect, re-login/logout, and owner-chunk failure recovery. Every mocked owner request was intercepted before the real backend. Actual editor/auth/security implementations were not modified.

No authenticated login, data save, delete or upload was performed against the existing restaurant backend. Mock checks validate frontend integration and routing; they do not prove BCrypt/session/cookie enforcement, real CSRF rejection, account permissions, upload storage or an actual database transaction. A permitted isolated environment/data set is still required for full authenticated end-to-end mutation testing. Production session lifetime and remember-me expiry were not time-travel tested against the live service.

## 11. Studio preservation

No Studio source file changed. The approved logo hash remains **2a5a59b107a40d5a545c8b2552194db154bb6c69c449d96e6a15474d4ce650a3**. Current pre-change versus final viewport and cropped-logo screenshots at 390 and 1440 px are byte-identical under OS reduced motion; hashes are saved in studio-comparison.json. The existing dedicated interaction verifier also passes 10 check groups and 7 axe states, including website width interpolation, exact application filter results/counts, systems-node selection and trace order/reset, keyboard/touch, eight responsive widths, both reduced-motion controls and no external/backend/3D runtime requests. Its original approved hero comparison passes too.

Footer-to-Studio PUSH navigation still starts at y=0; Studio forward restoration remains y=1200, with existing anchor back/forward positions unchanged. Restaurant native back restoration has an inherited clamp while asynchronous content rebuilds: desktop 2606→2363 is unchanged; mobile departure 2727 restores 2406 rather than the earlier 2207 (321 px versus 520 px error). This is improved accuracy, not exact departure restoration. The initial strict old-pixel assertion is retained; the final regression checks require the error not to worsen while keeping Studio/anchor positions exact. No code was changed to force historical clamping coordinates.

## 12. Variability and remaining measured problems

The retained RU final runs are 89 / 89 / **83**. TBT was 23 / 17 / **291 ms**, while LCP stayed 3.404–3.409 s, CLS 0.008 and network bytes identical. Audit attribution shows main-bundle script evaluation rising to about 472 ms versus 181–183 ms; parse/compile remained about 1 ms. The precise source-level cause of that single evaluation spike is not established. Separate cold diagnostic repetitions, with saved Chrome traces, were **90 P / 29 ms TBT; 89 P / 42 ms TBT; 89 P / 13 ms TBT**. They are additional evidence, not replacements for the official three-run range. Do not label the spike a proven host issue or silently discard it.

Healthy mobile LCP is still around 3.4–3.5 s, above 2.5 s. The remaining path includes real SPA bootstrap/render work, required multilingual fonts and the retained detailed hero image. Mobile LT/RU median P is 89. More invasive rendering, translation-loading or font changes were not forced for marginal score gains; actual visible content, crops, typography and behavior take precedence. Georgian desktop CLS remains around 0.053 and still meets 0.1. There is no field INP/CrUX/RUM evidence; TBT is not INP.

## 13. Deployment checks still outstanding

No production infrastructure changed or deployment occurred. Verify that the production host serves generated locale homepage HTML entries for both clean/trailing-slash paths before its SPA fallback; otherwise only the early-discovery gain can be lost. Studio/legal/owner must keep the un-preloaded shared shell. Direct / still performs its existing client locale redirect and has no homepage preload in the shared shell. Verify real HTTPS compression, fingerprinted-asset immutable caching, HTML freshness, API/session no-store behavior, CSRF/cookie/security headers, canonical/social previews, true HTTP 404 responses, external delivery destinations and allowed same-origin API proxying. Vite's visible 404/noindex still returns HTTP 200 locally. Existing source/social metadata and masters remain available.

## 14. Evidence and reproduction

Original evidence is untouched at backend/target/quality-audit-2026-10-20/. All new evidence is at **.verification/gios-optimization-2026-10-20/**: baseline/, each measured stage/, final/lighthouse/, final-legal/lighthouse/, ru-diagnostic/lighthouse/, final/browser/, final/edges/, final/resources/, final/geometry/, final/owner/, final/studio-interactions/, final/flow-extras/, final-build.log, final-lint.log, environment and comparison JSON. Raw reports include every run, full settings, fetch time, category audits, warnings and environment benchmark. Preserve these local evidence folders before cleaning workspaces; they are not frontend runtime dependencies or guaranteed artifacts of a fresh clone.

The current campaign contains 106 completed controlled Lighthouse samples, plus one explicitly excluded interrupted admin pilot. Independent functional browser suites may run together, but Lighthouse runs were sequential and isolated from those suites. The original 42-run audit remains a separate campaign.

From the workspace root, with the existing local tool installation and healthy backend:

    cd frontend
    npm run build
    npm run lint
    npm run preview -- --host 127.0.0.1 --port 4187 --strictPort

In a separate PowerShell process at the workspace root, use a **new PHASE output name** to avoid overwriting measurements:

    $env:PHASE='recheck'; $env:ROUTES='/lt,/en,/ru,/ka,/studio'
    $env:DEVICES='mobile,desktop'; $env:RUNS='3'
    node .verification/gios-optimization-2026-10-20/lighthouse.mjs

Run browser.mjs, accessibility.mjs, supplement.mjs, edge-cases.mjs, resources.mjs, owner.mjs, geometry.mjs, flow-extras.mjs, studio-scroll.mjs and studio-interactions.mjs separately from Lighthouse. PHASE relocates outputs for the first three and geometry; other retained harnesses intentionally use final/ and should be copied/retargeted before re-running. The copied Studio harness writes into this campaign instead of overwriting the prior interaction study. The Studio scroll harness also requires its retained history baseline. Existing test fixtures are clearly separated from healthy-backend performance measurements.

### Current pre-change per-run values

| Sample | P / A / BP / SEO | FCP s | LCP s | CLS | TBT ms | SI s | JS bytes | Image bytes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| lt-mobile-1 | 66 / 100 / 100 / 100 | 2.712 | 5.193 | 0.212 | 5 | 2.712 | 160502 | 488752 |
| lt-mobile-2 | 67 / 100 / 100 / 100 | 2.711 | 5.041 | 0.212 | 7 | 2.711 | 160502 | 488752 |
| lt-mobile-3 | 65 / 100 / 100 / 100 | 2.712 | 5.118 | 0.230 | 7 | 2.712 | 160502 | 488752 |
| lt-desktop-1 | 98 / 100 / 100 / 100 | 0.568 | 1.012 | 0.046 | 0 | 0.568 | 160502 | 488752 |
| lt-desktop-2 | 98 / 100 / 100 / 100 | 0.569 | 1.033 | 0.052 | 0 | 0.569 | 160502 | 488752 |
| lt-desktop-3 | 98 / 100 / 100 / 100 | 0.569 | 1.034 | 0.052 | 0 | 0.569 | 160502 | 488752 |
| en-mobile-1 | 68 / 100 / 100 / 100 | 2.406 | 4.884 | 0.217 | 31 | 2.406 | 160502 | 488752 |
| en-mobile-2 | 75 / 100 / 100 / 100 | 2.406 | 4.884 | 0.121 | 8 | 2.406 | 160502 | 488752 |
| en-mobile-3 | 69 / 100 / 100 / 100 | 2.407 | 4.810 | 0.217 | 33 | 2.407 | 160502 | 488752 |
| en-desktop-1 | 99 / 100 / 100 / 100 | 0.528 | 0.952 | 0.050 | 0 | 0.559 | 160502 | 488752 |
| en-desktop-2 | 98 / 100 / 100 / 100 | 0.527 | 1.030 | 0.051 | 0 | 0.527 | 160502 | 488752 |
| en-desktop-3 | 98 / 100 / 100 / 100 | 0.566 | 1.009 | 0.052 | 0 | 0.566 | 160502 | 488752 |
| ru-mobile-1 | 74 / 100 / 100 / 100 | 2.406 | 4.883 | 0.140 | 38 | 2.406 | 160502 | 488752 |
| ru-mobile-2 | 74 / 100 / 100 / 100 | 2.405 | 4.807 | 0.140 | 29 | 2.405 | 160502 | 488752 |
| ru-mobile-3 | 74 / 100 / 100 / 100 | 2.406 | 4.884 | 0.143 | 29 | 2.406 | 160502 | 488752 |
| ru-desktop-1 | 99 / 100 / 100 / 100 | 0.528 | 0.991 | 0.051 | 0 | 0.528 | 160502 | 488752 |
| ru-desktop-2 | 99 / 100 / 100 / 100 | 0.526 | 0.969 | 0.051 | 0 | 0.526 | 160502 | 488752 |
| ru-desktop-3 | 99 / 100 / 100 / 100 | 0.526 | 0.989 | 0.051 | 0 | 0.526 | 160502 | 488752 |
| ka-mobile-1 | 72 / 100 / 100 / 100 | 2.557 | 4.960 | 0.148 | 5 | 2.557 | 160502 | 488752 |
| ka-mobile-2 | 73 / 100 / 100 / 100 | 2.558 | 5.037 | 0.130 | 8 | 2.558 | 160502 | 488752 |
| ka-mobile-3 | 72 / 100 / 100 / 100 | 2.407 | 5.110 | 0.148 | 39 | 2.407 | 160502 | 488752 |
| ka-desktop-1 | 98 / 100 / 100 / 100 | 0.486 | 0.949 | 0.054 | 0 | 0.486 | 160502 | 488752 |
| ka-desktop-2 | 98 / 100 / 100 / 100 | 0.485 | 0.948 | 0.054 | 0 | 0.485 | 160502 | 488752 |
| ka-desktop-3 | 98 / 100 / 100 / 100 | 0.566 | 0.989 | 0.054 | 0 | 0.566 | 160502 | 488752 |
| studio-mobile-1 | 86 / 100 / 100 / 69 | 2.031 | 3.907 | 0.025 | 0 | 2.031 | 170086 | 163754 |
| studio-mobile-2 | 88 / 100 / 100 / 69 | 2.030 | 3.606 | 0.003 | 0 | 2.030 | 170086 | 163754 |
| studio-mobile-3 | 88 / 100 / 100 / 69 | 2.030 | 3.606 | 0.003 | 0 | 2.030 | 170086 | 163754 |
| studio-desktop-1 | 100 / 100 / 100 / 69 | 0.483 | 0.748 | 0.004 | 0 | 0.483 | 170086 | 169282 |
| studio-desktop-2 | 100 / 100 / 100 / 69 | 0.465 | 0.746 | 0.004 | 0 | 0.465 | 170086 | 169282 |
| studio-desktop-3 | 100 / 100 / 100 / 69 | 0.465 | 0.746 | 0.004 | 0 | 0.465 | 170086 | 169282 |

### Final homepage/Studio per-run values

| Sample | P / A / BP / SEO | FCP s | LCP s | CLS | TBT ms | SI s | JS bytes | Image bytes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| lt-mobile-1 | 89 / 100 / 100 / 100 | 1.956 | 3.477 | 0.006 | 8 | 1.956 | 121790 | 129661 |
| lt-mobile-2 | 89 / 100 / 100 / 100 | 1.955 | 3.481 | 0.006 | 5 | 1.955 | 121790 | 129661 |
| lt-mobile-3 | 89 / 100 / 100 / 100 | 1.955 | 3.480 | 0.006 | 20 | 1.955 | 121790 | 129661 |
| lt-desktop-1 | 100 / 100 / 100 / 100 | 0.449 | 0.746 | 0.004 | 0 | 0.454 | 121790 | 371761 |
| lt-desktop-2 | 100 / 100 / 100 / 100 | 0.448 | 0.765 | 0.004 | 0 | 0.448 | 121790 | 371761 |
| lt-desktop-3 | 100 / 100 / 100 / 100 | 0.448 | 0.765 | 0.004 | 0 | 0.448 | 121790 | 371761 |
| en-mobile-1 | 90 / 100 / 100 / 100 | 2.106 | 3.403 | 0.004 | 15 | 2.106 | 121790 | 129661 |
| en-mobile-2 | 90 / 100 / 100 / 100 | 2.106 | 3.403 | 0.004 | 18 | 2.106 | 121790 | 129661 |
| en-mobile-3 | 90 / 100 / 100 / 100 | 2.107 | 3.404 | 0.004 | 15 | 2.107 | 121790 | 129661 |
| en-desktop-1 | 100 / 100 / 100 / 100 | 0.446 | 0.806 | 0.003 | 0 | 0.446 | 121790 | 371761 |
| en-desktop-2 | 100 / 100 / 100 / 100 | 0.451 | 0.767 | 0.003 | 0 | 0.451 | 121790 | 371761 |
| en-desktop-3 | 100 / 100 / 100 / 100 | 0.445 | 0.765 | 0.003 | 0 | 0.445 | 121790 | 371761 |
| ru-mobile-1 | 89 / 100 / 100 / 100 | 2.257 | 3.404 | 0.008 | 23 | 2.257 | 121790 | 129661 |
| ru-mobile-2 | 89 / 100 / 100 / 100 | 2.259 | 3.409 | 0.008 | 17 | 2.259 | 121790 | 129661 |
| ru-mobile-3 | 83 / 100 / 100 / 100 | 2.257 | 3.405 | 0.008 | 291 | 2.257 | 121790 | 129661 |
| ru-desktop-1 | 100 / 100 / 100 / 100 | 0.447 | 0.747 | 0.005 | 0 | 0.447 | 121790 | 371761 |
| ru-desktop-2 | 100 / 100 / 100 / 100 | 0.446 | 0.786 | 0.005 | 0 | 0.446 | 121790 | 371761 |
| ru-desktop-3 | 100 / 100 / 100 / 100 | 0.445 | 0.745 | 0.006 | 0 | 0.445 | 121790 | 371761 |
| ka-mobile-1 | 90 / 100 / 100 / 100 | 2.106 | 3.403 | 0.005 | 9 | 2.106 | 121790 | 129661 |
| ka-mobile-2 | 90 / 100 / 100 / 100 | 2.107 | 3.410 | 0.005 | 7 | 2.107 | 121790 | 129661 |
| ka-mobile-3 | 90 / 100 / 100 / 100 | 2.106 | 3.403 | 0.005 | 9 | 2.106 | 121790 | 129661 |
| ka-desktop-1 | 99 / 100 / 100 / 100 | 0.444 | 0.764 | 0.053 | 0 | 0.444 | 121790 | 371761 |
| ka-desktop-2 | 99 / 100 / 100 / 100 | 0.445 | 0.765 | 0.056 | 0 | 0.445 | 121790 | 193513 |
| ka-desktop-3 | 99 / 100 / 100 / 100 | 0.445 | 0.765 | 0.053 | 0 | 0.445 | 121790 | 371761 |
| studio-mobile-1 | 91 / 100 / 100 / 69 | 1.730 | 3.382 | 0.003 | 0 | 1.730 | 131383 | 163754 |
| studio-mobile-2 | 90 / 100 / 100 / 69 | 2.030 | 3.382 | 0.003 | 0 | 2.030 | 131383 | 163754 |
| studio-mobile-3 | 90 / 100 / 100 / 69 | 2.030 | 3.382 | 0.003 | 0 | 2.030 | 131383 | 163754 |
| studio-desktop-1 | 100 / 100 / 100 / 69 | 0.426 | 0.707 | 0.004 | 0 | 0.426 | 131383 | 169282 |
| studio-desktop-2 | 100 / 100 / 100 / 69 | 0.426 | 0.707 | 0.004 | 0 | 0.426 | 131383 | 169282 |
| studio-desktop-3 | 100 / 100 / 100 / 69 | 0.425 | 0.706 | 0.004 | 0 | 0.425 | 131383 | 169282 |

### Final legal route observations (one/device)

| Route | Mobile P / A / BP / SEO | Desktop P / A / BP / SEO |
| --- | --- | --- |
| /lt/privacy | 92 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| /lt/legal | 93 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| /en/privacy | 95 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| /en/legal | 94 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| /ru/privacy | 94 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| /ru/legal | 94 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| /ka/privacy | 95 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| /ka/legal | 94 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |

### Additional RU diagnostic values (not substituted into final medians)

| Sample | P / A / BP / SEO | FCP s | LCP s | CLS | TBT ms | SI s | JS bytes | Image bytes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ru-mobile-1 | 90 / 100 / 100 / 100 | 2.256 | 3.332 | 0.008 | 29 | 2.256 | 121790 | 129661 |
| ru-mobile-2 | 89 / 100 / 100 / 100 | 2.258 | 3.410 | 0.008 | 42 | 2.258 | 121790 | 129661 |
| ru-mobile-3 | 89 / 100 / 100 / 100 | 2.256 | 3.407 | 0.008 | 13 | 2.256 | 121790 | 129661 |

**Verdict: CONDITIONAL PASS — strong measured improvement and tested regressions controlled; LCP target, isolated RU TBT variability, real authenticated mutations, full manual accessibility and deployed/field checks remain open.**


---

## Final LCP Closeout — October 20, 2026

### Decision and scope

**CONDITIONAL PASS. The investigation is complete; the mobile LCP target is not achieved.** The first optimization remains intact. Final cold mobile Performance medians are LT 89 / EN 90 / RU 89 / KA 90, with LCP approximately 3.40–3.49 s. No additional runtime change met the evidence threshold. Two bounded hypotheses were investigated: one code experiment was measured and reversed; one offline image-codec candidate was rejected before production integration. No third hypothesis was pursued. This is not a claim of full mobile performance completion or unconditional launch approval.

Both Git repositories were initially clean: frontend `aa123259824169bf4a2f18defeb3d053d412cd75`, backend `bcab789a6c6278cd60985293929c745b67b9d310`. Existing approved Studio and first-pass work are part of that frontend commit. All six public endpoints returned 200 JSON through `http://127.0.0.1:4187` before the baseline and final campaign. No API-fallback page was used for performance measurements. Previous evidence and the complete pre-closeout report are preserved. No commit, push, deployment, backend edit, dependency installation or real owner mutation occurred.

### Tools, conditions and comparability

Chrome DevTools MCP was not exposed by this Codex session, and no local MCP executable, LHCI or Browsertime installation was found. The referenced primary repositories were inspected: [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp), [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci), [Browsertime](https://github.com/sitespeedio/browsertime). Existing Lighthouse **13.5.0**, Chrome **155**, Playwright **1.64.1**, axe-core **4.14.0**, Chrome traces and CDP network/CPU emulation supplied equivalent local profiling. No browser credentials, local URLs or traces were uploaded to an analysis service. No CrUX request or MCP usage telemetry was enabled. Profiling tools stay outside the production bundle.

Production builds were served by the existing preview on 4187 with the real backend proxy on 8080. Mobile Lighthouse uses 390×844, DPR 1.75, the same Moto mobile UA, simulated RTT 150 ms / 1638.4 Kbps / CPU 4×; desktop uses 1440×1000, DPR 1, RTT 40 ms / 10240 Kbps / CPU 1×. Each run launches a fresh isolated browser. Builds, lint, browser tests and other Lighthouse batches were not overlapped. Five LT cold baseline runs, three experimental LT runs and **20 final mobile + six restaurant desktop + two Studio control runs** were retained, with no best-run substitutions. Other-language desktop and Studio results are single observations, not robust distributions. No production/physical-device p75 or INP is established.

Separate CDP diagnostics apply actual network latency 562.5 ms, download 1474.56 Kbps, upload 675 Kbps and CPU 4× to an isolated cold 390×844/DPR 1.75 context. They use the browser default UA rather than Lighthouse’s Moto UA and are diagnostic, not substituted into the simulated score table. There are three baseline, three experiment and three final traces per language (12 final). **Observed trace subparts and simulated headline LCP are different clocks/models: do not sum local unthrottled subparts and present them as a decomposition of simulated 3.4 s.** Lighthouse 13.5’s simulated breakdown does not supply an exact render-delay component; the real four-part breakdown below comes from measured Resource/Navigation/LCP entries.

A remote Cloudinary product-image request was already unfinished with zero transferred bytes in the saved first-pass Lighthouse reports. Actual browser diagnostics now expose `net::ERR_NETWORK_ACCESS_DENIED`; a local HEAD check also could not connect. It is not the local hero, and the public APIs remain healthy. This limits certification of externally hosted product imagery and some transfer totals; it does not establish a bad Cloudinary URL or justify transforming owner URLs. The first-pass zero-error summary must not be read as proof that every external image loaded.

### Exact LCP evidence and verified causes

The LCP element is `main#main > section.hero > div.hero-media > img` in **every restaurant baseline, experiment and final Lighthouse run**. The selected mobile resource is `/assets/hero-grill-800-C7sMSKfE.webp`, an actual 800×450 derivative, 81,534 encoded bytes (81,802 network bytes in Lighthouse; CDP transfer overhead differs). There is one hero request. It is parser-initiated from the locale HTML preload with High priority, matching responsive sizes/srcset, `fetchpriority=high`, eager loading and all three discovery checks true. Native naturalWidth is density-corrected and is not the encoded file width. No missing image-discovery defect remains.

Baseline LT actual-throttle measurements (milliseconds; rows sum to measured LCP):

| Run | TTFB | Resource load delay | Resource load duration | Element render delay | LCP | Hero mounted |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 3.9 | 612.3 | 2130.7 | 569.1 | 3316 | 2987.3 |
| 2 | 3.5 | 613.3 | 2133.5 | 621.7 | 3372 | 3022.0 |
| 3 | 3.7 | 613.6 | 2127.3 | 559.4 | 3304 | 2998.0 |

Navigation/Resource Timing reports a local-header TTFB of roughly 4 ms while CDP throttling delays HTML body completion/parser work until about 0.61 s. Consequently that emulated document-delivery delay appears within “resource load delay”; it is not 0.61 s of React work or backend latency. In baseline LT trace 1, image discovery is 616.2 ms, image end 2746.9 ms, main module end 2767 ms, module evaluation 2774.9–2857.3 ms, hero mount 2987.3 ms, style update 36.8 ms, initial Layout 227.3 ms, image decode about 5.6 ms, and the paint candidate about 3313.4 ms (PerformanceObserver rounds it to 3316 ms). Title font arrives at 1851 ms; DM Sans Latin 2164 ms and its LT subset 2522 ms. CSS is requested at 616 ms and finishes at 1657 ms, well before module evaluation. Further font completion around 3.8 s does not gate the image candidate.

This establishes shared-bandwidth/connection/slow-start costs and the existing client-rendered bootstrap as the main residual path: image transfer occupies about 2.13 s under the applied network profile, followed by about 0.57 s of render delay. Approximately 0.24 s of that delay precedes hero mount; about 0.33 s follows mount, dominated by style/layout rather than image decoding. The image is rendered while profile/opening/menu APIs are still in flight: it does **not** wait for restaurant data. There is no CSS animation or hidden-image gate on the hero. Holding other work fixed, deleting the entire measured render delay would still leave LT image arrival near 2.75 s; merely moving a preload a few parser milliseconds cannot close the approximately 0.98 s simulated target gap. This is a bounded observation, not proof that all future architectures must exceed 2.5 s.

Lighthouse’s own dependency simulation was recreated locally from baseline run 3: optimistic LCP 3340.696 ms, pessimistic 3640.696 ms, combined **3490.696 ms**, exactly matching that report. In those graphs image arrival is about 2858/3008 ms and main-JS completion 2858/3158 ms; both include font competition. The menu request ends at 3341/3641 ms and determines the graph endpoints, although the measured hero does not await that API. This is a model dependency, not evidence for adding a runtime API gate. Deferring the menu solely to remove it from that graph would be benchmark manipulation and was not attempted.

Raw references relative to this document: [baseline waterfall](../../.verification/gios-lcp-closeout-2026-10-20/baseline/waterfall.svg), [actual Chrome trace](../../.verification/gios-lcp-closeout-2026-10-20/baseline/cdp/lt-1.trace.json), [network priorities/initiators](../../.verification/gios-lcp-closeout-2026-10-20/baseline/cdp/lt-1.network.json), [viewport screenshot](../../.verification/gios-lcp-closeout-2026-10-20/baseline/cdp/lt-1.png), [simulated graph](../../.verification/gios-lcp-closeout-2026-10-20/baseline/lantern.json). Chrome trace files also contain screenshot events.

### Bounded experiment and stop decision

| Comparison | LT cold baseline (5) | Body-font preload priority low (3) |
| --- | --- | --- |
| Simulated P, median (range) | 89 (89–89) | 89 (89–89) |
| Simulated LCP s, median (range) | 3.484 (3.477–3.491) | 3.553 (3.483–3.556) |
| Simulated FCP s, median | 1.956 | 1.956 |
| CLS median | 0.006397 | 0.006397 |
| Applied-throttle LCP ms, median (3 each) | 3316 | 3336 |

**Hypothesis 1: body-font preloads compete unnecessarily with the hero and JS.** Only their preload fetchpriority was lowered; the title and image kept their priority. The measured transfer duration was unchanged and LCP did not improve. The experiment is rejected. Its exact two-line change in `build/restaurantHtml.ts` was reversed and Git confirms no remaining runtime diff. No first-pass font hints or other optimizations were removed.

**Hypothesis 2: a high-quality AVIF could materially reduce the selected 800 px hero.** The existing offline ffmpeg/libaom encoder produced a candidate from the preserved master at 800 px, Lanczos, still-picture=1, CRF 18, cpu-used=6, threads=1. Side-by-side visual review preserves the composition and detailed appearance. The file is **74,721 bytes versus 81,534 WebP**, saving only **6,813 bytes / 8.36%**. This candidate was rejected before production integration: the extra responsive-format/preload/fallback pipeline is disproportionate to this saving. No AVIF Lighthouse performance distribution or LCP gain is claimed. This is a qualification of this particular high-quality candidate, not a claim that all AVIF settings/other codecs are inferior. Candidate, comparison PNG and result.json are retained in `experiment-codec/`; no master or production asset changed.

Other trace-based checks did not justify code experiments: moving the existing preload ahead of same-document tags addresses only a few milliseconds; decoding is about 6 ms rather than the approximately 570 ms render gap; CSS arrives before JS can mount the hero (the Lighthouse render-blocking insight estimates LCP savings 0); changing title wrapping, font design, rendering architecture or offscreen containment carries appearance/geometry/history risk. No tested low-risk change closes this gap within the exact-design constraints. Two investigated hypotheses remain below the three-experiment cap. The complexity/marginal-gain stop rule is reached, rather than filling the quota with weak experiments.

### Original → first optimization → final

Original audit translated homepages had one run each; original LT had three. First-pass and closeout baselines are separate cohorts. Final mobile has five/lang. Small differences from first-pass medians are measurement variability/current-build differences, not a claimed new speedup.

| Language | Original mobile P | First-pass mobile P | Final P median (range) | First-pass LCP → final s | First-pass CLS → final |
| --- | --- | --- | --- | --- | --- |
| LT | 65 (3) | 89 (3) | 89 (89–89) (5) | 3.480 → 3.485 | 0.006397 → 0.006397 |
| EN | 69 (1) | 90 (3) | 90 (90–90) (5) | 3.403 → 3.401 | 0.004082 → 0.004082 |
| RU | 74 (1) | 89 (3) | 89 (89–90) (5) | 3.405 → 3.399 | 0.007824 → 0.007824 |
| KA | 72 (1) | 90 (3) | 90 (90–90) (5) | 3.403 → 3.406 | 0.004825 → 0.004695 |

LT’s original audit was 5.113 s LCP / 0.230 CLS; the independent healthy pre-first-pass baseline was 5.118 s / 0.212. The first-pass result was 3.480 s / 0.006397. The fresh pre-closeout LT baseline is 3.484 s / 0.006397. No comparison silently substitutes an older baseline.

Original audit → first optimization → final mobile metric medians (original LT n=3, original other languages n=1; first n=3 each; final n=5 each). Original metrics below are read directly from the preserved October audit JSON rather than inferred from rounded scores.

| Language | FCP s | LCP s | CLS | TBT ms | Speed Index s |
| --- | --- | --- | --- | --- | --- |
| LT | 2.709 → 1.955 → 1.956 | 5.113 → 3.480 → 3.485 | 0.229653 → 0.006397 → 0.006397 | 32.0 → 8.0 → 9.0 | 2.709 → 1.955 → 1.956 |
| EN | 2.405 → 2.106 → 2.105 | 4.808 → 3.403 → 3.401 | 0.217189 → 0.004082 → 0.004082 | 5.0 → 15.0 → 17.0 | 2.405 → 2.106 → 2.105 |
| RU | 2.407 → 2.257 → 2.255 | 4.810 → 3.405 → 3.399 | 0.139841 → 0.007824 → 0.007824 | 37.0 → 23.0 → 10.0 | 2.407 → 2.257 → 2.255 |
| KA | 2.556 → 2.106 → 2.106 | 5.034 → 3.403 → 3.406 | 0.148321 → 0.004825 → 0.004695 | 5.0 → 9.0 → 7.0 | 2.556 → 2.106 → 2.106 |
Final medians with min–max ranges (seconds except TBT ms and unitless CLS):

| Route/device | n | P | LCP | FCP | CLS | TBT ms | Speed Index |
| --- | --- | --- | --- | --- | --- | --- | --- |
| /lt mobile | 5 | 89 (89–89) | 3.485 (3.478–3.487) | 1.956 (1.956–1.958) | 0.006397 (0.006397–0.006397) | 9.0 (5.0–13.0) | 1.956 (1.956–1.958) |
| /en mobile | 5 | 90 (90–90) | 3.401 (3.399–3.401) | 2.105 (2.105–2.106) | 0.004082 (0.004082–0.004082) | 17.0 (13.0–21.0) | 2.105 (2.105–2.106) |
| /ru mobile | 5 | 89 (89–90) | 3.399 (3.331–3.404) | 2.255 (2.255–2.258) | 0.007824 (0.005943–0.007824) | 10.0 (6.0–26.0) | 2.255 (2.255–2.258) |
| /ka mobile | 5 | 90 (90–90) | 3.406 (3.403–3.407) | 2.106 (2.105–2.107) | 0.004695 (0.004695–0.004760) | 7.0 (6.0–11.0) | 2.106 (2.105–2.107) |
| /lt desktop | 3 | 100 (100–100) | 0.806 (0.746–0.806) | 0.449 (0.446–0.450) | 0.003824 (0.003431–0.003824) | 0.0 (0.0–0.0) | 0.449 (0.446–0.450) |
| /en desktop | 1 | 100 (100–100) | 0.785 (0.785–0.785) | 0.448 (0.448–0.448) | 0.003249 (0.003249–0.003249) | 0.0 (0.0–0.0) | 0.448 (0.448–0.448) |
| /ru desktop | 1 | 100 (100–100) | 0.745 (0.745–0.745) | 0.445 (0.445–0.445) | 0.005527 (0.005527–0.005527) | 0.0 (0.0–0.0) | 0.445 (0.445–0.445) |
| /ka desktop | 1 | 99 (99–99) | 0.784 (0.784–0.784) | 0.444 (0.444–0.444) | 0.053345 (0.053345–0.053345) | 0.0 (0.0–0.0) | 0.444 (0.444–0.444) |

All restaurant runs retain Accessibility / Best Practices / SEO **100 / 100 / 100**. Desktop EN/RU/KA ranges above contain one observation only. Studio control observations are mobile 90 / 100 / 100 / 69 and desktop 100 / 100 / 100 / 69; SEO 69 remains the intentional noindex.

Final transferred bytes, median (actual recorded network bytes, not Lighthouse opportunity estimates):

| Route/device | JS | Images | Fonts | CSS | Total |
| --- | --- | --- | --- | --- | --- |
| /lt mobile | 121793 | 129661 | 111524 | 13639 | 392880 |
| /en mobile | 121793 | 129661 | 111524 | 13639 | 392424 |
| /ru mobile | 121793 | 129661 | 92976 | 13639 | 375611 |
| /ka mobile | 121793 | 129661 | 109940 | 13639 | 394068 |
| /lt desktop | 121793 | 371761 | 111524 | 13639 | 634980 |
| /en desktop | 121793 | 371761 | 111524 | 13639 | 634524 |
| /ru desktop | 121793 | 371761 | 92976 | 13639 | 617711 |
| /ka desktop | 121793 | 371761 | 109940 | 13639 | 636168 |

LT mobile JS remains **24.1% below** the pre-first-pass 160,502 bytes; images remain **73.5% below** 488,752 bytes. Current JS is 121,793 versus first-pass 121,790; CSS 13,639 versus 13,603. Those few bytes were already present in the fresh pre-closeout build. No new savings or runtime regression is attributed to the rejected experiment. Actual network checks retain lazy owner/legal chunks and deferred decorative art; product-image failures contribute zero transferred image bytes in both comparison cohorts.

### Final observed four-part breakdowns

Actual applied-throttle browser diagnostics, three cold samples/language; every candidate is the same hero image. Each row reports medians with min–max in ms. Independently computed medians need not sum exactly. Raw per-run parts, mount events, resources, long tasks and errors are in `final/cdp/{locale}-{1,2,3}.json`, with matching trace/network/PNG files.

| Language | TTFB | Load delay | Load duration | Render delay | Actual LCP |
| --- | --- | --- | --- | --- | --- |
| LT | 3.8 (3.8–3.9) | 612.8 (605.0–624.7) | 2129.3 (2119.9–2145.4) | 550.1 (546.0–575.3) | 3308 (3304–3308) |
| EN | 3.5 (3.5–3.7) | 612.8 (611.1–613.9) | 2029.4 (2018.6–2035.8) | 526.3 (514.8–534.6) | 3172 (3148–3188) |
| RU | 3.7 (3.6–3.8) | 595.5 (591.7–627.7) | 1823.8 (1815.6–1848.9) | 568.0 (564.9–568.8) | 3012 (2988–3016) |
| KA | 3.9 (3.5–4.0) | 613.9 (609.2–620.2) | 1917.9 (1914.7–1919.1) | 523.1 (504.6–525.9) | 3060 (3032–3068) |

For reproducibility, all 26 restaurant Lighthouse final runs’ **observed, locally unthrottled** parts are also listed below. They are measured during Lighthouse’s gather, not simulated segments of the headline score. This prevents invented decompositions of the simulated metric.

| Sample | TTFB ms | Load delay ms | Load duration ms | Render delay ms |
| --- | --- | --- | --- | --- |
| en-mobile-1 | 4.123 | 39.771 | 8.359 | 174.192 |
| en-mobile-2 | 3.891 | 50.060 | 8.206 | 167.500 |
| en-mobile-3 | 4.100 | 53.780 | 7.609 | 170.808 |
| en-mobile-4 | 3.779 | 10.511 | 8.006 | 168.206 |
| en-mobile-5 | 4.612 | 23.840 | 8.033 | 169.101 |
| ka-mobile-1 | 4.182 | 63.942 | 7.811 | 176.663 |
| ka-mobile-2 | 4.170 | 35.371 | 8.774 | 177.393 |
| ka-mobile-3 | 5.358 | 52.043 | 8.125 | 182.405 |
| ka-mobile-4 | 3.551 | 53.513 | 9.018 | 174.934 |
| ka-mobile-5 | 4.140 | 43.805 | 8.338 | 171.931 |
| lt-mobile-1 | 3.979 | 8.505 | 9.571 | 162.004 |
| lt-mobile-2 | 3.776 | 9.160 | 8.872 | 176.504 |
| lt-mobile-3 | 3.945 | 18.943 | 8.664 | 182.399 |
| lt-mobile-4 | 4.049 | 49.826 | 8.317 | 176.701 |
| lt-mobile-5 | 4.591 | 8.678 | 10.766 | 163.484 |
| ru-mobile-1 | 4.118 | 39.238 | 7.725 | 184.229 |
| ru-mobile-2 | 4.143 | 33.842 | 7.072 | 182.726 |
| ru-mobile-3 | 4.589 | 37.081 | 7.627 | 187.456 |
| ru-mobile-4 | 4.059 | 10.245 | 7.583 | 178.133 |
| ru-mobile-5 | 4.292 | 20.052 | 8.537 | 178.294 |
| lt-desktop-1 | 3.974 | 40.723 | 9.870 | 200.760 |
| lt-desktop-2 | 3.921 | 5.395 | 14.053 | 163.197 |
| lt-desktop-3 | 4.180 | 32.950 | 10.224 | 168.645 |
| en-desktop-1 | 3.738 | 6.231 | 13.156 | 161.270 |
| ka-desktop-1 | 4.379 | 34.412 | 8.945 | 173.128 |
| ru-desktop-1 | 4.339 | 54.702 | 7.653 | 190.350 |

### Per-run final scores and metrics

| Sample | P / A / BP / SEO | FCP s | LCP s | CLS | TBT ms | SI s | JS bytes | Image bytes | Total bytes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| en-mobile-1 | 90 / 100 / 100 / 100 | 2.106 | 3.401 | 0.004082 | 16.0 | 2.106 | 121793 | 129661 | 392424 |
| en-mobile-2 | 90 / 100 / 100 / 100 | 2.105 | 3.401 | 0.004082 | 17.0 | 2.105 | 121793 | 129661 | 392424 |
| en-mobile-3 | 90 / 100 / 100 / 100 | 2.105 | 3.401 | 0.004082 | 18.0 | 2.105 | 121793 | 129661 | 392424 |
| en-mobile-4 | 90 / 100 / 100 / 100 | 2.105 | 3.401 | 0.004082 | 21.0 | 2.105 | 121793 | 129661 | 392417 |
| en-mobile-5 | 90 / 100 / 100 / 100 | 2.105 | 3.399 | 0.004082 | 13.0 | 2.105 | 121793 | 129661 | 392417 |
| ka-mobile-1 | 90 / 100 / 100 / 100 | 2.105 | 3.403 | 0.004760 | 6.0 | 2.105 | 121793 | 129661 | 394068 |
| ka-mobile-2 | 90 / 100 / 100 / 100 | 2.106 | 3.406 | 0.004760 | 6.0 | 2.106 | 121793 | 129661 | 394068 |
| ka-mobile-3 | 90 / 100 / 100 / 100 | 2.107 | 3.406 | 0.004695 | 7.0 | 2.107 | 121793 | 129661 | 394068 |
| ka-mobile-4 | 90 / 100 / 100 / 100 | 2.107 | 3.407 | 0.004695 | 11.0 | 2.107 | 121793 | 129661 | 394068 |
| ka-mobile-5 | 90 / 100 / 100 / 100 | 2.106 | 3.405 | 0.004695 | 10.0 | 2.106 | 121793 | 129661 | 394068 |
| lt-mobile-1 | 89 / 100 / 100 / 100 | 1.958 | 3.485 | 0.006397 | 5.0 | 1.958 | 121793 | 129661 | 392880 |
| lt-mobile-2 | 89 / 100 / 100 / 100 | 1.956 | 3.486 | 0.006397 | 9.0 | 1.956 | 121793 | 129661 | 392880 |
| lt-mobile-3 | 89 / 100 / 100 / 100 | 1.956 | 3.483 | 0.006397 | 11.0 | 1.956 | 121793 | 129661 | 392880 |
| lt-mobile-4 | 89 / 100 / 100 / 100 | 1.956 | 3.478 | 0.006397 | 7.0 | 1.956 | 121793 | 129661 | 392872 |
| lt-mobile-5 | 89 / 100 / 100 / 100 | 1.958 | 3.487 | 0.006397 | 13.0 | 1.958 | 121793 | 129661 | 392873 |
| ru-mobile-1 | 90 / 100 / 100 / 100 | 2.258 | 3.335 | 0.007824 | 10.0 | 2.258 | 121793 | 129661 | 375611 |
| ru-mobile-2 | 89 / 100 / 100 / 100 | 2.255 | 3.399 | 0.005943 | 6.0 | 2.255 | 121793 | 129661 | 375611 |
| ru-mobile-3 | 89 / 100 / 100 / 100 | 2.255 | 3.404 | 0.007824 | 18.0 | 2.255 | 121793 | 129661 | 375611 |
| ru-mobile-4 | 90 / 100 / 100 / 100 | 2.256 | 3.331 | 0.007824 | 26.0 | 2.256 | 121793 | 129661 | 375611 |
| ru-mobile-5 | 89 / 100 / 100 / 100 | 2.255 | 3.403 | 0.007824 | 9.0 | 2.255 | 121793 | 129661 | 375611 |
| lt-desktop-1 | 100 / 100 / 100 / 100 | 0.446 | 0.806 | 0.003824 | 0.0 | 0.446 | 121793 | 371761 | 634980 |
| lt-desktop-2 | 100 / 100 / 100 / 100 | 0.450 | 0.746 | 0.003824 | 0.0 | 0.450 | 121793 | 371761 | 634980 |
| lt-desktop-3 | 100 / 100 / 100 / 100 | 0.449 | 0.806 | 0.003431 | 0.0 | 0.449 | 121793 | 371761 | 634980 |
| en-desktop-1 | 100 / 100 / 100 / 100 | 0.448 | 0.785 | 0.003249 | 0.0 | 0.448 | 121793 | 371761 | 634524 |
| ka-desktop-1 | 99 / 100 / 100 / 100 | 0.444 | 0.784 | 0.053345 | 0.0 | 0.444 | 121793 | 371761 | 636168 |
| ru-desktop-1 | 100 / 100 / 100 / 100 | 0.445 | 0.745 | 0.005527 | 0.0 | 0.445 | 121793 | 371761 | 617711 |
| studio-desktop-1 | 100 / 100 / 100 / 69 | 0.425 | 0.706 | 0.003748 | 0.0 | 0.425 | 131386 | 169282 | 418011 |
| studio-mobile-1 | 90 / 100 / 100 / 69 | 2.030 | 3.380 | 0.002722 | 0.0 | 2.030 | 131386 | 163754 | 412483 |

### RU outlier, accessibility and functional results

The earlier RU 291 ms TBT sample is retained, with its main-bundle evaluation around 472 ms versus 181–183 ms in the other two original runs; parse/compile was about 1 ms. The old extra diagnostic trio was 29 / 42 / 13 ms. New final five-run RU TBT is **10 / 6 / 18 / 26 / 9 ms**, median 10 ms. No recurring equivalent spike appears in these five cold traces. Raw final traces and bootup/long-task attribution remain accessible. This supports “isolated, not reproduced,” not a proven host/scheduler diagnosis or a manufactured source-code fix.

The copied browser harness completed 26 route/device axe scans with **0 violations**, and 16/17 interaction assertions passed. The additional four-language closed/language-open/menu-open/dialog/privacy/legal matrix completed 24 scans with **0 violations**, including Escape and keyboard focus restoration. Current incomplete rules: `aria-prohibited-attr`, `color-contrast`, `label-content-name-mismatch`. Incomplete contrast over clipping, offscreen/overlapping content and gradients, bitmap Wolt name matching, and the previously identified generic labelled order container are not misreported as either verified violations or full passes. No verified safe in-scope accessibility defect remained to fix. Full screen-reader/device and all gradient pixel-contrast checks are still not tested.

The first copied interaction run retained one skip-link timeout: it pressed Tab without awaiting React’s skip-link control. The copied harness now awaits that control before starting the keyboard assertion; its separate settled interaction rerun passes **17/17**. An additional 4-language keyboard check verifies first-Tab skip access, Enter then Tab entering main, and language/menu Enter/Escape/focus restoration. The initial owner mock save test also checked a disabled button (true while saving) before its intercepted PUT had completed, producing 0 rather than 1 saves. Waiting for the explicit 200 PUT response resolves it; the final owner run passes 7/7. Original failure evidence is preserved in final/browser/summary.json, final-owner-initial.log and final-owner-initial.json. These are verification synchronization corrections, with no change to production focus, authentication, CSRF or save implementations.

Regression results: 176/176 responsive/data/font-delay edge cases; 5/5 missing-image/allergen/price/dialog-focus/retry checks; 6/6 supplemental checks; 7/7 owner frontend checks. Coverage includes the four languages, translated legal paths/query/hash preservation, categories/lunch, product dialogs and focus containment, delivery link structure, error/retry, 320/390/768/1100/1440 widths, long/empty/missing profile text, zero/one/two providers, empty lunch, late/failed APIs and fallback fonts. Resource selection/isolation and warm/cold checks passed. Build and lint passed; package.json has no npm test script. Existing verification harnesses were run rather than inventing an npm test result.

Browser route scans logged 0 Cloudinary failures and 0 other runtime/network/HTTP failures; details are retained in browser-failures.json. Intentional 401/403/503/chunk-abort fixture cases are recorded separately and do not represent a healthy-page regression. Lighthouse console-error audits are empty even where its remote image request remains unfinished; the actual browser failure is therefore reported explicitly. Missing-image handling was exercised, but successful external Cloudinary delivery is not certified.

### Studio and owner regression confidence

Studio’s dedicated verifier passes 10 groups and 7 axe states, with no runtime errors or unexpected external/backend/3D requests. Approved artwork SHA-256 remains `2a5a59b107a40d5a545c8b2552194db154bb6c69c449d96e6a15474d4ce650a3`. Mobile/desktop viewport and cropped-logo screenshots are byte-identical to the first-pass controls; full hashes are in studio-comparison.json. The dedicated approved hero screenshot comparison also passes. Current service demonstrations, tab/keyboard/touch behavior, eight responsive widths and OS/UI reduced motion are preserved. Footer-to-/studio fresh navigation remains y=0, Studio forward restoration y=1200 and Studio anchor history behavior unchanged. The documented native restaurant back-scroll clamp remains a limitation; it is not represented as exact restoration to departure coordinates. No Studio source file changed.

All seven real unauthenticated owner deep links remain gated and noindex, using GET-only checks. Browser-only fixtures validate lazy chunk loading/failure recovery, remember-me and fresh CSRF requests/headers, translation payload save integration, six screen reloads, 403/session-expiry redirect, re-login and logout. **Real authenticated saves, deletes, uploads, real remember-me/session expiration and database/security enforcement remain NOT TESTED.** No approved isolated authenticated backend fixtures were available, and no real restaurant records were written for testing. Mock passes are frontend integration evidence only.

### Files, evidence and final residual-risk verdict

The only retained tracked modification is this appended report, `frontend/docs/GIOS_KEBAB_OPTIMIZATION_RESULTS.md`. There are no retained application/build-source changes and no package/lockfile changes. The temporary `build/restaurantHtml.ts` experiment is rejected and byte content matches HEAD after reversal. New profiling/analysis scripts and copied verification harnesses live only under `.verification/gios-lcp-closeout-2026-10-20/`, outside the frontend and backend repositories.

Evidence index: `prerequisites.json`; `safety/` (starting commits, original report and notes); `baseline/lighthouse/` (5); `experiment-font-priority/lighthouse/` (3); `final/lighthouse/` (20); `final-desktop-lt/lighthouse/` (3); `final-desktop-other/lighthouse/` (3); `final-studio/lighthouse/` (2); baseline/experiment/final `cdp/`; `baseline/lantern.json`; `measurements.json` / `aggregate.json`; `final/*` regression output; `regression-exits.json`; `final-build.log` / `final-lint.log`. Each Lighthouse run has JSON, HTML, trace and DevTools log. [Local reproduction instructions](../../.verification/gios-lcp-closeout-2026-10-20/README.md) preserve exact flags and sequencing. Old evidence was not overwritten.

Deployment-specific checks remain separate: correct locale HTML selection before SPA fallback, real HTTPS/compression/cache/security/session/CSRF headers, true HTTP 404 status, external delivery destinations and successful Cloudinary image delivery. Direct `/` still uses the existing client locale redirect and shared shell without restaurant preload. No production host behavior, field Core Web Vitals or real-user INP has been measured.

**Final verdict: CONDITIONAL PASS.** The achieved CLS and payload improvements remain, desktop is strong, the tested frontend regressions are controlled, and the RU spike was not reproduced. Mobile LCP remains above 2.5 s in every final mobile run, and LT/RU medians remain 89. External imagery, authenticated backend saves, complete manual accessibility and deployed/field checks remain explicit limits.

**Is another FRONTEND performance optimization pass technically justified? No further general pass is justified within the present exact-design, existing-architecture boundaries.** Early image discovery already works; the priority experiment failed and the tested high-quality codec candidate saved only 6.8 KB. Remaining measured costs combine substantial critical transfers and client bootstrap/layout, while the simulated metric additionally includes pre-LCP API dependencies. The tested safe options do not close roughly 0.9–1.0 s. Larger rendering/payload changes or visual/asset trade-offs need a separately justified scope, with uncertain gains and higher regression exposure; this is not proof that 2.5 s is impossible with every future technique. This bounded closeout stops here. Reopen only for a new reproducible regression, production/field evidence identifying a specific avoidable bottleneck, or explicit authorization for a separately scoped architectural experiment.
