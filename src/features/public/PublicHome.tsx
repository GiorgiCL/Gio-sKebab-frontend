import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useOutletContext } from 'react-router'
import logoUrl from '../../assets/brand/gios-kebab-logo.jpg'
// Illustrative development asset; owner photography can replace this import later.
import heroGrillUrl from '../../assets/restaurant/demo/hero-grill.webp'
import { localeNames, publicLocales, type PublicLocale } from '../../lib/i18n/locales'
import { MenuSection } from './components/MenuSection'
import { PromotionsSection } from './components/PromotionsSection'
import { VisitSection } from './components/VisitSection'
import { DeliveryServiceIcon, InstagramIcon } from './components/ServiceIcons'
import { deliveryLinks, openingStatusText } from './format'
import { publicText } from './text'
import type { OpeningHours, OpeningStatus, PublicMenu, PublicPromotions, Restaurant } from './types'
import type { Resource } from './usePublicResource'
import { usePublicResource } from './usePublicResource'
import './public.css'

export function PublicHome() {
  const locale = useOutletContext<PublicLocale>()
  const location = useLocation()
  const t = publicText[locale]
  const restaurant = usePublicResource<Restaurant>(`/api/public/restaurant?lang=${locale}`)
  const openingStatus = usePublicResource<OpeningStatus>('/api/public/opening-status', 60_000)
  const openingHours = usePublicResource<OpeningHours>('/api/public/opening-hours')
  const menu = usePublicResource<PublicMenu>(`/api/public/menu?lang=${locale}`)
  const promotions = usePublicResource<PublicPromotions>(`/api/public/promotions?lang=${locale}`)
  const profile = restaurant.kind === 'success' ? restaurant.data : undefined
  const orderLinks = deliveryLinks(profile)

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = profile ? `${profile.displayName} | ${t.metaTitle}` : t.metaFallbackTitle
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (description) description.content = profile?.description?.trim().slice(0, 160) || t.metaFallbackDescription
  }, [locale, profile, t])

  useEffect(() => {
    if (location.hash !== '#menu') return
    const frame = requestAnimationFrame(() => {
      const menu = document.getElementById('menu')
      menu?.scrollIntoView({ behavior: 'instant', block: 'start' })
      menu?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [location.hash, locale])

  return <div className="public-site" id="top" lang={locale} translate="no">
    <a className="skip-link" href="#main">{t.skip}</a>
    <SiteHeader locale={locale} orderLinks={orderLinks} />
    <main id="main">
      <Hero locale={locale} displayName={profile?.displayName} openingStatus={openingStatus} />
      <MenuSection locale={locale} resource={menu} />
      <PromotionsSection locale={locale} resource={promotions} />
      <VisitSection locale={locale} restaurant={restaurant} openingHours={openingHours} openingStatus={openingStatus} />
    </main>
    <SiteFooter locale={locale} restaurant={profile} />
  </div>
}

function LanguageSelector({ locale, onSelect }: { locale: PublicLocale; onSelect: () => void }) {
  const location = useLocation()
  const rest = location.pathname.slice(`/${locale}`.length)
  return <nav className="public-languages" aria-label={publicText[locale].language}>
    {publicLocales.map(code => <Link key={code} to={`/${code}${rest}${location.search}${location.hash}`}
      lang={code} hrefLang={code} aria-label={localeNames[code]} aria-current={locale === code ? 'page' : undefined}
      className={locale === code ? 'active' : ''} onClick={onSelect}>{code.toUpperCase()}</Link>)}
  </nav>
}

function SiteHeader({ locale, orderLinks }: { locale: PublicLocale; orderLinks: ReturnType<typeof deliveryLinks> }) {
  const t = publicText[locale]
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); toggleRef.current?.focus() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])
  const closeMenu = () => setMenuOpen(false)
  const navigateTo = (target: string) => {
    closeMenu()
    requestAnimationFrame(() => document.getElementById(target)?.focus({ preventScroll: true }))
  }
  return <header className={`site-header${menuOpen ? ' is-open' : ''}`}>
    <div className="site-header-inner layout-wrap">
      <a className="brand-link" href="#top" aria-label={t.backTopLabel} onClick={closeMenu}><img src={logoUrl} width="1024" height="1024" alt={t.logoAlt} /></a>
      <div className="public-header-right">
        <nav className="desktop-nav" aria-label={t.primaryNav}>
          <a href="#menu">{t.menu}</a><a href="#visit">{t.visit}</a>
          {orderLinks.length > 0 && <HeaderDelivery locale={locale} links={orderLinks} />}
        </nav>
        {orderLinks.length > 0 && <div className="mobile-header-order"><HeaderDelivery locale={locale} links={orderLinks} compact onOpen={closeMenu} /></div>}
        <LanguageSelector locale={locale} onSelect={closeMenu} />
        <button className="menu-toggle" type="button" ref={toggleRef} aria-label={menuOpen ? t.closeMenu : t.openMenu}
          aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(open => !open)}>
          <span className="menu-toggle-label">{menuOpen ? t.close : t.menu}</span>
          <span className={`menu-toggle-lines${menuOpen ? ' is-open' : ''}`} aria-hidden="true"><i /><i /></span>
        </button>
      </div>
    </div>
    <nav id="mobile-navigation" className={`mobile-nav${menuOpen ? ' is-open' : ''}`} aria-label={t.mobileNav} inert={!menuOpen}>
      <a href="#menu" onClick={() => navigateTo('menu')}>{t.menu} <b aria-hidden="true">↗</b></a>
      <a href="#visit" onClick={() => navigateTo('visit')}>{t.visit} <b aria-hidden="true">↗</b></a>
      {orderLinks.length > 0 && <div className="mobile-delivery" role="group" aria-label={t.orderDelivery}>
        <span className="mobile-delivery-label">{t.orderDelivery}</span>
        <div className="mobile-delivery-links">{orderLinks.map(link => <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
          <DeliveryServiceIcon service={link.label} /> {link.label} <b aria-hidden="true">↗</b><span className="sr-only"> ({t.newTab})</span></a>)}</div>
      </div>}
    </nav>
  </header>
}

function HeaderDelivery({ locale, links, compact = false, onOpen }: { locale: PublicLocale; links: ReturnType<typeof deliveryLinks>; compact?: boolean; onOpen?: () => void }) {
  const t = publicText[locale]
  const detailsRef = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    if (detailsRef.current) detailsRef.current.open = false
  }, [locale])
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) detailsRef.current.open = false
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !detailsRef.current?.open) return
      detailsRef.current.open = false
      detailsRef.current.querySelector('summary')?.focus()
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])
  return <details ref={detailsRef} className={`nav-order${compact ? ' is-compact' : ''}`}><summary aria-label={compact ? t.orderDelivery : undefined} onClick={onOpen}>
    {compact && <DeliveryServiceIcon service="Delivery" />}<span className="nav-order-label">{t.orderDelivery}</span><span className="nav-order-chevron" aria-hidden="true">⌄</span></summary>
    <div className="nav-order-list" role="group" aria-label={t.chooseDeliveryService}>{links.map(link => <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer">
      <DeliveryServiceIcon service={link.label} /><span>{link.label}</span><span aria-hidden="true">↗</span><span className="sr-only"> ({t.newTab})</span></a>)}</div>
  </details>
}

function Hero({ locale, displayName, openingStatus }: {
  locale: PublicLocale; displayName?: string; openingStatus: Resource<OpeningStatus>
}) {
  const t = publicText[locale]
  const today = openingStatus.kind === 'success' ? openingStatus.data : undefined
  return <section className="hero" aria-labelledby="hero-title">
    <div className="hero-media" aria-hidden="true"><img src={heroGrillUrl} width="1680" height="938" alt="" fetchPriority="high" decoding="async" /></div>
    <div className="hero-inner layout-wrap"><div className="hero-copy">
      <h1 id="hero-title">{displayName ?? "Gio's Kebab"}</h1>
      <div className="hero-actions"><a className="button button-light" href="#menu">{t.exploreMenu} <span aria-hidden="true">↗</span></a></div>
      {today && <div className="hero-opening" role="status"><span className={`status-dot${today.openNow ? ' is-open' : ''}`} aria-hidden="true" />
        <span>{openingStatusText(today, locale)}{today.source === 'SPECIAL' ? ` · ${t.specialToday}` : ''}</span></div>}
    </div></div>
  </section>
}

function SiteFooter({ locale, restaurant }: { locale: PublicLocale; restaurant: Restaurant | undefined }) {
  const t = publicText[locale]
  return <footer className="site-footer"><div className="layout-wrap footer-top">
    <p className="footer-brand">Gio's Kebab<span className="footer-period">.</span></p>
    <a href="#top">{t.backTop} <span aria-hidden="true">↑</span></a>
  </div><div className="layout-wrap footer-bottom">
    <span>© {new Date().getFullYear()} Gio's Kebab</span>
    <div className="footer-socials">
      {restaurant?.instagramUrl && <a href={restaurant.instagramUrl} target="_blank" rel="noopener noreferrer"><InstagramIcon /> Instagram <span className="sr-only">({t.newTab})</span></a>}
      {restaurant?.facebookUrl && <a href={restaurant.facebookUrl} target="_blank" rel="noopener noreferrer">Facebook <span className="sr-only">({t.newTab})</span></a>}
    </div>
  </div></footer>
}
