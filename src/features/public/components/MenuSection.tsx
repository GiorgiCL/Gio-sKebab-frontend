import { useState } from 'react'
import type { PublicLocale } from '../../../lib/i18n/locales'
import { formatPrice } from '../format'
import { publicText } from '../text'
import type { MenuCategory, MenuItem, PublicMenu } from '../types'
import type { Resource } from '../usePublicResource'

export function MenuSection({ locale, resource }: { locale: PublicLocale; resource: Resource<PublicMenu> }) {
  const t = publicText[locale]
  const categories = resource.kind === 'success' ? resource.data.categories : []
  const featured = categories.flatMap(category => category.items.map(item => ({ item, category: category.name }))).filter(({ item }) => item.featured)
  const spotlight = featured.find(({ item }) => item.available) ?? featured[0]
  return <section className="menu-section" id="menu" aria-labelledby="menu-title" tabIndex={-1}><div className="layout-wrap">
    <div className="section-heading menu-heading"><p className="eyebrow section-index"><span className="index-line" /> {t.menuIndex}</p>
      <div><h2 id="menu-title">{t.menuTitle}<br /><em>{t.menuAccent}</em></h2><p>{t.menuIntro}</p></div></div>
    {resource.kind === 'loading' && <div className="menu-loading" role="status" aria-live="polite"><p>{t.menuLoading}</p><div className="skeleton-line" /><div className="skeleton-line short" /><div className="skeleton-line" /></div>}
    {resource.kind === 'error' && <div className="content-message"><h3>{t.menuErrorTitle}</h3><p>{t.menuError}</p><button type="button" className="inline-action" onClick={resource.retry}>{t.reloadMenu} <span aria-hidden="true">↗</span></button></div>}
    {resource.kind === 'success' && categories.length === 0 && <div className="content-message"><h3>{t.menuEmptyTitle}</h3><p>{t.menuEmpty}</p></div>}
    {resource.kind === 'success' && categories.length > 0 && <>
      {spotlight && <FeaturedSpotlight key={`${spotlight.item.id}-${spotlight.item.imageUrl}-${locale}`} locale={locale} item={spotlight.item} category={spotlight.category} />}
      {categories.length > 1 && <nav className="category-nav" aria-label={t.menuCategories}><span>{t.jumpTo}</span>{categories.map(category => <a key={category.id} href={`#menu-category-${category.id}`}>{category.name}</a>)}</nav>}
      <div className="menu-categories">{categories.map(category => <Category key={category.id} locale={locale} category={category} />)}</div>
    </>}
  </div></section>
}

function FeaturedSpotlight({ locale, item, category }: { locale: PublicLocale; item: MenuItem; category: string }) {
  const t = publicText[locale]
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(item.imageUrl) && !imageFailed
  return <article className="featured-spotlight" aria-label={`${t.featuredItem}: ${item.name}`}>
    <div className={`featured-media${showImage ? ' has-photo' : ''}`}>
      {showImage ? <img src={item.imageUrl!} alt={item.name} loading="lazy" decoding="async" width="960" height="720" onError={() => setImageFailed(true)} /> :
        <div className="featured-art" aria-hidden="true"><span className="featured-art-top">{t.fallbackTop}</span><span className="featured-art-slash" /><span className="featured-art-bottom">{t.fallbackBottom}</span></div>}
    </div><div className="featured-copy"><p className="eyebrow">{t.selectedFrom} / {category}</p><h3>{item.name}</h3>{item.description && <p className="featured-description">{item.description}</p>}
      <div className="featured-detail"><span>{formatPrice(item.priceEur, locale)}</span>{!item.available && <strong className="sold-out">{t.soldOutToday}</strong>}</div>
    </div></article>
}

function Category({ locale, category }: { locale: PublicLocale; category: MenuCategory }) {
  const t = publicText[locale]
  return <section className="menu-category" id={`menu-category-${category.id}`} aria-labelledby={`category-title-${category.id}`}>
    <div className="category-intro"><h3 id={`category-title-${category.id}`}>{category.name}</h3><p>{String(category.items.length).padStart(2, '0')} {category.items.length === 1 ? t.item : t.items}</p></div>
    <div className="category-items">{category.items.map(item => <MenuRow key={`${item.id}-${item.imageUrl}-${locale}`} locale={locale} item={item} />)}</div>
  </section>
}

function MenuRow({ locale, item }: { locale: PublicLocale; item: MenuItem }) {
  const t = publicText[locale]
  const [imageFailed, setImageFailed] = useState(false)
  return <article className={`menu-row${item.available ? '' : ' is-sold-out'}`}>
    {item.imageUrl && !imageFailed && <img className="menu-row-image" src={item.imageUrl} alt={item.name} loading="lazy" decoding="async" width="88" height="88" onError={() => setImageFailed(true)} />}
    {item.imageUrl && imageFailed && <span className="menu-row-image menu-row-image-fallback" aria-hidden="true" />}
    <div className="menu-row-info"><div className="menu-row-title-line"><h4>{item.name}</h4>{item.featured && <span className="menu-tag">{t.featured}</span>}{!item.available && <span className="sold-out">{t.soldOut}</span>}</div>{item.description && <p>{item.description}</p>}</div>
    <span className="menu-row-price">{formatPrice(item.priceEur, locale)}</span>
  </article>
}
