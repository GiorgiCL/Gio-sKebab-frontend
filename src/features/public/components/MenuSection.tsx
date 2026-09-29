import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
// Illustrative development asset, separate from owner-managed menu item images.
import menuImageUrl from '../../../assets/restaurant/demo/kebab-cutout.webp'
import type { PublicLocale } from '../../../lib/i18n/locales'
import { capturePublicEvent } from '../../../lib/analytics'
import { formatPrice } from '../format'
import { publicText } from '../text'
import type { MenuCategory, MenuItem, PublicMenu } from '../types'
import type { Resource } from '../usePublicResource'
import { ProductDialog } from './ProductDialog'
import { MenuThumbnail } from './MenuThumbnail'
import { lunchText } from '../lunchText'

export function MenuSection({ locale, resource, showLunch }: { locale: PublicLocale; resource: Resource<PublicMenu>; showLunch: boolean }) {
  const t = publicText[locale]
  const categories = resource.kind === 'success' ? resource.data.categories : []
  const categoryIds = categories.map(category => category.id).join(',')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selectedTrigger = useRef<HTMLButtonElement | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const selectedCategory = categories.find(category => category.items.some(item => item.id === selectedId))
  const selectedItem = selectedCategory?.items.find(item => item.id === selectedId)

  useEffect(() => {
    if (!categoryIds && !showLunch) return
    const ids = [...(showLunch ? ['lunch'] : []), ...categoryIds.split(',').filter(Boolean).map(id => `menu-category-${id}`)]
    let frame = 0
    const update = () => {
      frame = 0
      const threshold = window.innerWidth <= 1100 ? 230 : 300
      let current = ids[0]
      for (const id of ids) {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top <= threshold) current = id
      }
      setActiveId(previous => previous === current ? previous : current)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [categoryIds, showLunch])

  useEffect(() => {
    if (!categoryIds || !location.hash.startsWith('#menu-category-')) return
    const target = document.getElementById(location.hash.slice(1))
    if (!target) return
    const frame = requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant', block: 'start' }))
    return () => cancelAnimationFrame(frame)
  }, [categoryIds, location.hash, locale])

  useEffect(() => {
    const nav = navRef.current
    const link = nav?.querySelector<HTMLAnchorElement>(`[data-section-id="${activeId}"]`)
    if (!nav || !link || window.innerWidth > 1100) return
    nav.scrollTo({ left: link.offsetLeft - nav.clientWidth / 2 + link.clientWidth / 2, behavior: 'auto' })
  }, [activeId])

  const jumpTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const category = categories.find(entry => id === `menu-category-${entry.id}`)
    if (category) capturePublicEvent('menu_category_selected', { category_id: category.id, category_name: category.name, locale })
    event.preventDefault()
    navigate({ hash: `#${id}` }, { preventScrollReset: true })
    const target = document.getElementById(id)
    target?.scrollIntoView({ behavior: 'instant', block: 'start' })
    target?.focus({ preventScroll: true })
    setActiveId(id)
  }

  return <section className="menu-section" id="menu" aria-labelledby="menu-title" tabIndex={-1}>
    <div className="layout-wrap">
      <div className="menu-lead"><div className="menu-lead-copy">
        <h2 id="menu-title">{t.menuTitle}</h2>{categories.length > 0 && <p className="menu-lead-count">{categories.length} {t.menuCategories}</p>}</div>
        <div className="menu-lead-image" aria-hidden="true"><img src={menuImageUrl} alt="" width="980" height="694" loading="lazy" decoding="async" /></div>
      </div>
      {resource.kind === 'loading' && <div className="menu-loading" role="status" aria-live="polite"><p>{t.menuLoading}</p><div className="skeleton-line" /><div className="skeleton-line short" /><div className="skeleton-line" /></div>}
      {resource.kind === 'error' && <div className="content-message"><h3>{t.menuErrorTitle}</h3><p>{t.menuError}</p><button type="button" className="inline-action" onClick={resource.retry}>{t.reloadMenu} <span aria-hidden="true">↗</span></button></div>}
      {resource.kind === 'success' && categories.length === 0 && <div className="content-message"><h3>{t.menuEmptyTitle}</h3><p>{t.menuEmpty}</p></div>}
      {resource.kind === 'success' && (categories.length > 0 || showLunch) && <div className="menu-browser">
        <nav className="category-nav" aria-label={t.menuCategories} ref={navRef}>
          <span className="category-nav-label">{t.menuCategories}</span>
          {showLunch && <a data-section-id="lunch" href="#lunch" aria-current={activeId === 'lunch' ? 'location' : undefined}
            className={activeId === 'lunch' ? 'active' : ''} onClick={event => jumpTo(event, 'lunch')}>{lunchText[locale].title}</a>}
          {categories.map(category => { const id = `menu-category-${category.id}`; return <a key={category.id} data-section-id={id} href={`#${id}`}
            aria-current={activeId === id ? 'location' : undefined} className={activeId === id ? 'active' : ''}
            onClick={event => jumpTo(event, id)}>{category.name}</a> })}
        </nav>
        <div className="menu-categories">{categories.map(category => <Category key={category.id} locale={locale} category={category}
          onSelect={(itemId, trigger) => {
            const item = category.items.find(entry => entry.id === itemId)
            if (item) capturePublicEvent('product_opened', { product_id: item.id, product_name: item.name, category_id: category.id, category_key: `menu:${category.id}`, category_name: category.name, source: 'menu', locale })
            selectedTrigger.current = trigger; setSelectedId(itemId)
          }} />)}</div>
      </div>}
    </div>
    {selectedId !== null && <ProductDialog locale={locale} itemId={selectedId} item={selectedItem} categoryName={selectedCategory?.name}
      loading={resource.kind === 'loading'} returnFocus={selectedTrigger} onClose={() => setSelectedId(null)} />}
  </section>
}

function Category({ locale, category, onSelect }: { locale: PublicLocale; category: MenuCategory; onSelect: (itemId: number, trigger: HTMLButtonElement) => void }) {
  const t = publicText[locale]
  return <section className="menu-category" id={`menu-category-${category.id}`} aria-labelledby={`category-title-${category.id}`} tabIndex={-1}>
    <div className="category-intro"><div><h3 id={`category-title-${category.id}`}>{category.name}</h3></div>
      <p>{category.items.length} {category.items.length === 1 ? t.item : t.items}</p></div>
    <div className="category-items">{category.items.map(item => <MenuRow key={item.id} locale={locale} item={item} onSelect={onSelect} />)}</div>
  </section>
}

function MenuRow({ locale, item, onSelect }: { locale: PublicLocale; item: MenuItem; onSelect: (itemId: number, trigger: HTMLButtonElement) => void }) {
  const t = publicText[locale]
  return <article className={`menu-row${item.available ? '' : ' is-sold-out'}`}>
    <button type="button" className="menu-row-trigger" data-menu-item-id={item.id} onClick={event => onSelect(item.id, event.currentTarget)}>
      <span className="menu-row-info"><span className="menu-row-title-line"><span className="sr-only">{t.viewDetails}: </span><span className="menu-row-name">{item.name}</span>{item.featured && <span className="menu-tag">{t.featured}</span>}{!item.available && <span className="sold-out">{t.soldOut}</span>}</span>{item.description && <span className="menu-row-description">{item.description}</span>}<span className="menu-row-price">{formatPrice(item.priceEur, locale)}</span></span>
      <MenuThumbnail itemId={item.id} imageUrl={item.imageUrl} />
    </button>
  </article>
}
