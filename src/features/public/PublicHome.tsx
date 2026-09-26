import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useOutletContext } from 'react-router'
import logoUrl from '../../assets/brand/gios-kebab-logo.jpg'
import { localeNames, publicLocales, type PublicLocale } from '../../lib/i18n/locales'
import { MenuSection } from './components/MenuSection'
import { PromotionsSection } from './components/PromotionsSection'
import { VisitSection } from './components/VisitSection'
import { deliveryLinks, openingStatusText } from './format'
import { publicText } from './text'
import type { OpeningHours, OpeningStatus, PublicMenu, PublicPromotions, Restaurant } from './types'
import type { Resource } from './usePublicResource'
import { usePublicResource } from './usePublicResource'
import './public.css'

export function PublicHome() {
  const locale = useOutletContext<PublicLocale>()
  const t = publicText[locale]
  const restaurant = usePublicResource<Restaurant>(`/api/public/restaurant?lang=${locale}`)
  const openingStatus = usePublicResource<OpeningStatus>('/api/public/opening-status', 60_000)
  const openingHours = usePublicResource<OpeningHours>('/api/public/opening-hours')
  const menu = usePublicResource<PublicMenu>(`/api/public/menu?lang=${locale}`)
  const promotions = usePublicResource<PublicPromotions>(`/api/public/promotions?lang=${locale}`)
  const profile = restaurant.kind === 'success' ? restaurant.data : undefined
  const hasDelivery = deliveryLinks(profile).length > 0

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = profile ? `${profile.displayName} | ${t.metaTitle}` : t.metaFallbackTitle
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (description) description.content = profile?.description?.trim().slice(0, 160) || t.metaFallbackDescription
  }, [locale, profile, t])

  return <div className="public-site" id="top" lang={locale}>
    <a className="skip-link" href="#main">{t.skip}</a>
    <SiteHeader locale={locale} hasDelivery={hasDelivery} />
    <main id="main">
      <Hero locale={locale} hasDelivery={hasDelivery} openingStatus={openingStatus} openingHours={openingHours} />
      <MenuSection locale={locale} resource={menu} />
      <PromotionsSection locale={locale} resource={promotions} />
      <VisitSection locale={locale} restaurant={restaurant} openingHours={openingHours} />
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

function SiteHeader({ locale, hasDelivery }: { locale: PublicLocale; hasDelivery: boolean }) {
  const t = publicText[locale]
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
  return <header className={`site-header${scrolled || menuOpen ? ' is-solid' : ''}`}>
    <div className="site-header-inner layout-wrap">
      <a className="brand-link" href="#top" aria-label={t.backTopLabel} onClick={closeMenu}><img src={logoUrl} width="1024" height="1024" alt={t.logoAlt} /></a>
      <div className="public-header-right">
        <nav className="desktop-nav" aria-label={t.primaryNav}>
          <a href="#menu">{t.menu}</a><a href="#visit">{t.visit}</a>
          {hasDelivery && <a className="nav-order" href="#order">{t.orderDelivery} <span aria-hidden="true">↗</span></a>}
        </nav>
        <LanguageSelector locale={locale} onSelect={closeMenu} />
        <button className="menu-toggle" type="button" ref={toggleRef} aria-label={menuOpen ? t.closeMenu : t.openMenu}
          aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(open => !open)}>
          <span className="menu-toggle-label">{menuOpen ? t.close : t.menu}</span>
          <span className={`menu-toggle-lines${menuOpen ? ' is-open' : ''}`} aria-hidden="true"><i /><i /></span>
        </button>
      </div>
    </div>
    <nav id="mobile-navigation" className={`mobile-nav${menuOpen ? ' is-open' : ''}`} aria-label={t.mobileNav} inert={!menuOpen}>
      <a href="#menu" onClick={() => navigateTo('menu')}><span>01</span> {t.menu} <b aria-hidden="true">↗</b></a>
      <a href="#visit" onClick={() => navigateTo('visit')}><span>02</span> {t.visit} <b aria-hidden="true">↗</b></a>
      {hasDelivery && <a href="#order" onClick={() => navigateTo('order')}><span>03</span> {t.orderDelivery} <b aria-hidden="true">↗</b></a>}
    </nav>
  </header>
}

function Hero({ locale, hasDelivery, openingStatus, openingHours }: {
  locale: PublicLocale; hasDelivery: boolean; openingStatus: Resource<OpeningStatus>; openingHours: Resource<OpeningHours>
}) {
  const t = publicText[locale]
  return <section className="hero" aria-labelledby="hero-title"><div className="hero-inner layout-wrap">
    <div className="hero-copy">
      <p className="eyebrow hero-eyebrow"><span className="eyebrow-mark" /> {t.heroEyebrow}</p>
      <h1 id="hero-title">{t.heroLine1}<br />{t.heroLine2}<br /><em>{t.heroAccent}</em></h1>
      <p className="hero-subtitle">{t.heroSubtitle}</p>
      <div className="hero-actions"><a className="button button-light" href="#menu">{t.exploreMenu} <span aria-hidden="true">↗</span></a>
        {hasDelivery && <a className="text-link" href="#order">{t.orderDelivery} <span aria-hidden="true">↗</span></a>}</div>
    </div>
    <div className="hero-media" aria-hidden="true"><div className="hero-media-frame"><img src={logoUrl} width="1024" height="1024" alt="" fetchPriority="high" /></div></div>
    <div className="hero-foot"><div className="hero-opening" role="status" aria-live="polite">
      <span className={`status-dot${openingStatus.kind === 'success' && openingStatus.data.openNow ? ' is-open' : ''}`} aria-hidden="true" />
      {openingStatus.kind === 'loading' && <span>{t.checkingToday}</span>}
      {openingStatus.kind === 'success' && <span>{openingStatusText(openingStatus.data, locale, openingHours.kind === 'success' ? openingHours.data : undefined)}{openingStatus.data.source === 'SPECIAL' ? ` · ${t.specialToday}` : ''}</span>}
      {openingStatus.kind === 'error' && <span>{t.todayUnavailable} <button type="button" onClick={openingStatus.retry}>{t.retry}</button></span>}
    </div><a className="hero-scroll" href="#menu">{t.scroll} <span aria-hidden="true">↓</span></a></div>
  </div></section>
}

function SiteFooter({ locale, restaurant }: { locale: PublicLocale; restaurant: Restaurant | undefined }) {
  const t = publicText[locale]
  return <footer className="site-footer"><div className="layout-wrap footer-top">
    <p className="footer-brand">{t.seeYou}<span className="footer-period">.</span></p>
    <a href="#top">{t.backTop} <span aria-hidden="true">↑</span></a>
  </div><div className="layout-wrap footer-bottom">
    <span>© {new Date().getFullYear()} Gio's Kebab</span><span>{t.footerLine}</span>
    <div className="footer-socials">
      {restaurant?.instagramUrl && <a href={restaurant.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram <span className="sr-only">({t.newTab})</span></a>}
      {restaurant?.facebookUrl && <a href={restaurant.facebookUrl} target="_blank" rel="noopener noreferrer">Facebook <span className="sr-only">({t.newTab})</span></a>}
    </div>
  </div></footer>
}
