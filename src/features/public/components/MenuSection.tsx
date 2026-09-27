import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
// Illustrative development asset, separate from owner-managed menu item images.
import menuImageUrl from '../../../assets/restaurant/demo/kebab-cutout.webp'
import type { PublicLocale } from '../../../lib/i18n/locales'
import { formatPrice } from '../format'
import { publicText } from '../text'
import type { MenuCategory, MenuItem, PublicMenu } from '../types'
import type { Resource } from '../usePublicResource'
import { ProductDialog } from './ProductDialog'

export function MenuSection({ locale, resource }: { locale: PublicLocale; resource: Resource<PublicMenu> }) {
  const t = publicText[locale]
  const categories = resource.kind === 'success' ? resource.data.categories : []
  const categoryIds = categories.map(category => category.id).join(',')
  const [activeId, setActiveId] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selectedTrigger = useRef<HTMLButtonElement | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const selectedCategory = categories.find(category => category.items.some(item => item.id === selectedId))
  const selectedItem = selectedCategory?.items.find(item => item.id === selectedId)

  useEffect(() => {
    if (!categoryIds) return
    const ids = categoryIds.split(',').map(Number)
    let frame = 0
    const update = () => {
      frame = 0
      const threshold = window.innerWidth <= 900 ? 150 : 112
      let current = ids[0]
      for (const id of ids) {
        const section = document.getElementById(`menu-category-${id}`)
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
  }, [categoryIds])

  useEffect(() => {
    if (!categoryIds || !location.hash.startsWith('#menu-category-')) return
    const target = document.getElementById(location.hash.slice(1))
    if (!target) return
    const frame = requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant', block: 'start' }))
    return () => cancelAnimationFrame(frame)
  }, [categoryIds, location.hash, locale])

  useEffect(() => {
    const nav = navRef.current
    const link = nav?.querySelector<HTMLAnchorElement>(`[data-category-id="${activeId}"]`)
    if (!nav || !link || window.innerWidth > 900) return
    nav.scrollTo({ left: link.offsetLeft - nav.clientWidth / 2 + link.clientWidth / 2, behavior: 'auto' })
  }, [activeId])

  const jumpTo = (event: MouseEvent<HTMLAnchorElement>, id: number) => {
    event.preventDefault()
    navigate({ hash: `#menu-category-${id}` }, { preventScrollReset: true })
    const target = document.getElementById(`menu-category-${id}`)
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
      {resource.kind === 'success' && categories.length > 0 && <div className="menu-browser">
        <nav className="category-nav" aria-label={t.menuCategories} ref={navRef}>
          <span className="category-nav-label">{t.menuCategories}</span>
          {categories.map(category => <a key={category.id} data-category-id={category.id} href={`#menu-category-${category.id}`}
            aria-current={activeId === category.id ? 'location' : undefined} className={activeId === category.id ? 'active' : ''}
            onClick={event => jumpTo(event, category.id)}>{category.name}</a>)}
        </nav>
        <div className="menu-categories">{categories.map(category => <Category key={category.id} locale={locale} category={category}
          onSelect={(itemId, trigger) => { selectedTrigger.current = trigger; setSelectedId(itemId) }} />)}</div>
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
  const [imageFailed, setImageFailed] = useState(false)
  return <article className={`menu-row${item.available ? '' : ' is-sold-out'}`}>
    <button type="button" className="menu-row-trigger" data-menu-item-id={item.id} onClick={event => onSelect(item.id, event.currentTarget)}>
      {item.imageUrl && !imageFailed && <img className="menu-row-image" src={item.imageUrl} alt="" loading="lazy" decoding="async" width="64" height="64" onError={() => setImageFailed(true)} />}
      <span className="menu-row-info"><span className="menu-row-title-line"><span className="sr-only">{t.viewDetails}: </span><span className="menu-row-name">{item.name}</span>{item.featured && <span className="menu-tag">{t.featured}</span>}{!item.available && <span className="sold-out">{t.soldOut}</span>}</span>{item.description && <span className="menu-row-description">{item.description}</span>}</span>
      <span className="menu-row-price">{formatPrice(item.priceEur, locale)}</span><span className="menu-row-arrow" aria-hidden="true">↗</span>
    </button>
  </article>
}
