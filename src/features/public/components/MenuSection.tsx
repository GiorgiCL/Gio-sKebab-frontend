import { useState } from 'react'
import { formatPrice } from '../format'
import type { MenuCategory, MenuItem, PublicMenu } from '../types'
import type { Resource } from '../usePublicResource'

export function MenuSection({ resource }: { resource: Resource<PublicMenu> }) {
  const categories = resource.kind === 'success' ? resource.data.categories : []
  const featured = categories
    .flatMap((category) => category.items.map((item) => ({ item, category: category.name })))
    .filter(({ item }) => item.featured)
  const spotlight = featured.find(({ item }) => item.available) ?? featured[0]

  return (
    <section className="menu-section" id="menu" aria-labelledby="menu-title" tabIndex={-1}>
      <div className="layout-wrap">
        <div className="section-heading menu-heading">
          <p className="eyebrow section-index"><span className="index-line" /> 01 / The menu</p>
          <div>
            <h2 id="menu-title">The menu.<br /><em>All the good stuff.</em></h2>
            <p>A focused menu, straight from Gio's. Find your usual, or find something new.</p>
          </div>
        </div>

        {resource.kind === 'loading' && (
          <div className="menu-loading" role="status" aria-live="polite">
            <p>Setting the table…</p>
            <div className="skeleton-line" /><div className="skeleton-line short" /><div className="skeleton-line" />
          </div>
        )}
        {resource.kind === 'error' && (
          <div className="content-message">
            <h3>The menu is taking a moment.</h3>
            <p>We couldn't load it right now. Please try again.</p>
            <button type="button" className="inline-action" onClick={resource.retry}>Reload menu <span aria-hidden="true">↗</span></button>
          </div>
        )}
        {resource.kind === 'success' && categories.length === 0 && (
          <div className="content-message">
            <h3>Our menu is being updated.</h3>
            <p>Check back soon for the latest from the grill.</p>
          </div>
        )}
        {resource.kind === 'success' && categories.length > 0 && (
          <>
            {spotlight && <FeaturedSpotlight key={`${spotlight.item.id}-${spotlight.item.imageUrl}`} item={spotlight.item} category={spotlight.category} />}
            {categories.length > 1 && (
              <nav className="category-nav" aria-label="Menu categories">
                <span>Jump to</span>
                {categories.map((category) => <a key={category.id} href={`#menu-category-${category.id}`}>{category.name}</a>)}
              </nav>
            )}
            <div className="menu-categories">
              {categories.map((category) => <Category key={category.id} category={category} />)}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function FeaturedSpotlight({ item, category }: { item: MenuItem; category: string }) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(item.imageUrl) && !imageFailed

  return (
    <article className="featured-spotlight" aria-label={`Featured menu item: ${item.name}`}>
      <div className={`featured-media${showImage ? ' has-photo' : ''}`}>
        {showImage ? (
          <img src={item.imageUrl!} alt={item.name} loading="lazy" decoding="async" width="960" height="720" onError={() => setImageFailed(true)} />
        ) : (
          <div className="featured-art" aria-hidden="true">
            <span className="featured-art-top">Gio's / the menu</span>
            <span className="featured-art-slash" />
            <span className="featured-art-bottom">Good things take heat.</span>
          </div>
        )}
      </div>
      <div className="featured-copy">
        <p className="eyebrow">Selected from the menu / {category}</p>
        <h3>{item.name}</h3>
        <p className="featured-description">{item.description}</p>
        <div className="featured-detail">
          <span>{formatPrice(item.priceEur)}</span>
          {!item.available && <strong className="sold-out">Sold out today</strong>}
        </div>
      </div>
    </article>
  )
}

function Category({ category }: { category: MenuCategory }) {
  return (
    <section className="menu-category" id={`menu-category-${category.id}`} aria-labelledby={`category-title-${category.id}`}>
      <div className="category-intro">
        <h3 id={`category-title-${category.id}`}>{category.name}</h3>
        <p>{String(category.items.length).padStart(2, '0')} {category.items.length === 1 ? 'item' : 'items'}</p>
      </div>
      <div className="category-items">
        {category.items.map((item) => <MenuRow key={`${item.id}-${item.imageUrl}`} item={item} />)}
      </div>
    </section>
  )
}

function MenuRow({ item }: { item: MenuItem }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className={`menu-row${item.available ? '' : ' is-sold-out'}`}>
      {item.imageUrl && !imageFailed && (
        <img className="menu-row-image" src={item.imageUrl} alt={item.name} loading="lazy" decoding="async" width="88" height="88" onError={() => setImageFailed(true)} />
      )}
      {item.imageUrl && imageFailed && <span className="menu-row-image menu-row-image-fallback" aria-hidden="true" />}
      <div className="menu-row-info">
        <div className="menu-row-title-line">
          <h4>{item.name}</h4>
          {item.featured && <span className="menu-tag">Featured</span>}
          {!item.available && <span className="sold-out">Sold out</span>}
        </div>
        <p>{item.description}</p>
      </div>
      <span className="menu-row-price">{formatPrice(item.priceEur)}</span>
    </article>
  )
}
