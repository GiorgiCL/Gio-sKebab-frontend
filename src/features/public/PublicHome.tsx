import { useEffect, useRef, useState } from 'react'
import logoUrl from '../../assets/brand/gios-kebab-logo.jpg'
import { MenuSection } from './components/MenuSection'
import { PromotionsSection } from './components/PromotionsSection'
import { VisitSection } from './components/VisitSection'
import { deliveryLinks, openingStatusText } from './format'
import type { Resource } from './usePublicResource'
import { usePublicResource } from './usePublicResource'
import type { OpeningHours, OpeningStatus, PublicMenu, PublicPromotions, Restaurant } from './types'
import './public.css'

export function PublicHome() {
  const restaurant = usePublicResource<Restaurant>('/api/public/restaurant')
  const openingStatus = usePublicResource<OpeningStatus>('/api/public/opening-status', 60_000)
  const openingHours = usePublicResource<OpeningHours>('/api/public/opening-hours')
  const menu = usePublicResource<PublicMenu>('/api/public/menu')
  const promotions = usePublicResource<PublicPromotions>('/api/public/promotions')
  const profile = restaurant.kind === 'success' ? restaurant.data : undefined
  const hasDelivery = deliveryLinks(profile).length > 0

  useEffect(() => {
    document.title = profile ? `${profile.displayName} | Menu & Opening Hours` : "Gio's Kebab | From the grill"
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (description) {
      description.content = profile?.description?.trim().slice(0, 160) ||
        "Gio's Kebab. Explore the menu, opening hours, and ways to visit or order."
    }
  }, [profile])

  return (
    <div className="public-site" id="top">
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader hasDelivery={hasDelivery} />
      <main id="main">
        <Hero hasDelivery={hasDelivery} openingStatus={openingStatus} openingHours={openingHours} />
        <MenuSection resource={menu} />
        <PromotionsSection resource={promotions} />
        <VisitSection restaurant={restaurant} openingHours={openingHours} />
      </main>
      <SiteFooter restaurant={profile} />
    </div>
  )
}

function SiteHeader({ hasDelivery }: { hasDelivery: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 28)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)
  const navigateTo = (target: string) => {
    closeMenu()
    requestAnimationFrame(() => document.getElementById(target)?.focus({ preventScroll: true }))
  }

  return (
    <header className={`site-header${scrolled || menuOpen ? ' is-solid' : ''}`}>
      <div className="site-header-inner layout-wrap">
        <a className="brand-link" href="#top" aria-label="Gio's Kebab, back to top" onClick={closeMenu}>
          <img src={logoUrl} width="1024" height="1024" alt="Gio's Kebab logo" />
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#menu">Menu</a>
          <a href="#visit">Visit</a>
          {hasDelivery && <a className="nav-order" href="#order">Order delivery <span aria-hidden="true">↗</span></a>}
        </nav>
        <button
          className="menu-toggle"
          type="button"
          ref={toggleRef}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="menu-toggle-label">{menuOpen ? 'Close' : 'Menu'}</span>
          <span className={`menu-toggle-lines${menuOpen ? ' is-open' : ''}`} aria-hidden="true"><i /><i /></span>
        </button>
      </div>
      <nav id="mobile-navigation" className={`mobile-nav${menuOpen ? ' is-open' : ''}`} aria-label="Mobile navigation" inert={!menuOpen}>
        <a href="#menu" onClick={() => navigateTo('menu')}><span>01</span> Menu <b aria-hidden="true">↗</b></a>
        <a href="#visit" onClick={() => navigateTo('visit')}><span>02</span> Visit <b aria-hidden="true">↗</b></a>
        {hasDelivery && <a href="#order" onClick={() => navigateTo('order')}><span>03</span> Order delivery <b aria-hidden="true">↗</b></a>}
      </nav>
    </header>
  )
}

function Hero({ hasDelivery, openingStatus, openingHours }: {
  hasDelivery: boolean
  openingStatus: Resource<OpeningStatus>
  openingHours: Resource<OpeningHours>
}) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-inner layout-wrap">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span className="eyebrow-mark" /> Gio's Kebab / from the grill</p>
          <h1 id="hero-title">The good<br />kind of<br /><em>heat.</em></h1>
          <p className="hero-subtitle">Good food. Good company. A little fire in the middle of it all.</p>
          <div className="hero-actions">
            <a className="button button-light" href="#menu">Explore the menu <span aria-hidden="true">↗</span></a>
            {hasDelivery && <a className="text-link" href="#order">Order delivery <span aria-hidden="true">↗</span></a>}
          </div>
        </div>
        <div className="hero-media" aria-hidden="true">
          <div className="hero-media-frame">
            <img src={logoUrl} width="1024" height="1024" alt="" fetchPriority="high" />
          </div>
        </div>
        <div className="hero-foot">
          <div className="hero-opening" role="status" aria-live="polite">
            <span className={`status-dot${openingStatus.kind === 'success' && openingStatus.data.openNow ? ' is-open' : ''}`} aria-hidden="true" />
            {openingStatus.kind === 'loading' && <span>Checking today's hours</span>}
            {openingStatus.kind === 'success' && <span>{openingStatusText(openingStatus.data, openingHours.kind === 'success' ? openingHours.data : undefined)}{openingStatus.data.source === 'SPECIAL' ? ' · special schedule today' : ''}</span>}
            {openingStatus.kind === 'error' && <span>Today's hours unavailable <button type="button" onClick={openingStatus.retry}>Retry</button></span>}
          </div>
          <a className="hero-scroll" href="#menu">Scroll to explore <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>
  )
}

function SiteFooter({ restaurant }: { restaurant: Restaurant | undefined }) {
  return (
    <footer className="site-footer">
      <div className="layout-wrap footer-top">
        <p className="footer-brand">See you soon<span className="footer-period">.</span></p>
        <a href="#top">Back to top <span aria-hidden="true">↑</span></a>
      </div>
      <div className="layout-wrap footer-bottom">
        <span>© {new Date().getFullYear()} Gio's Kebab</span>
        <span>Good food. No fuss.</span>
        <div className="footer-socials">
          {restaurant?.instagramUrl && <a href={restaurant.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram <span className="sr-only">(opens in a new tab)</span></a>}
          {restaurant?.facebookUrl && <a href={restaurant.facebookUrl} target="_blank" rel="noopener noreferrer">Facebook <span className="sr-only">(opens in a new tab)</span></a>}
        </div>
      </div>
    </footer>
  )
}
