import { useEffect, useRef, useState } from 'react'
import { useLocation, useOutletContext } from 'react-router'
import { usePageMetadata } from '../../lib/pageMetadata'
import { brandImage } from './brandImage'
// Illustrative development asset; owner photography can replace this import later.
import { heroImage } from './heroImage'
import { type PublicLocale } from '../../lib/i18n/locales'
import { capturePublicEvent, deliveryProvider } from '../../lib/analytics'
import { MenuSection } from './components/MenuSection'
import { LunchSection } from './components/LunchSection'
import { PromotionsSection } from './components/PromotionsSection'
import { VisitSection } from './components/VisitSection'
import { DeliveryProviderBrand } from './components/ServiceIcons'
import { deliveryLinks, openingStatusText } from './format'
import { publicText } from './text'
import { lunchText } from './lunchText'
import { LanguageSelector, SiteFooter } from './PublicNavigation'
import type { OpeningHours, OpeningStatus, PublicLunchMenu, PublicMenu, PublicPromotions, Restaurant } from './types'
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
  const lunch = usePublicResource<PublicLunchMenu>(`/api/public/lunch-menu?lang=${locale}`)
  const promotions = usePublicResource<PublicPromotions>(`/api/public/promotions?lang=${locale}`)
  const profile = restaurant.kind === 'success' ? restaurant.data : undefined
  const orderLinks = deliveryLinks(profile)
  const showLunch = lunch.kind === 'success' && lunch.data.days.some(day => day.items.length > 0)

  usePageMetadata({ locale, page: '', restaurant: profile,
    title: profile ? `${profile.displayName} | ${t.metaTitle}` : t.metaFallbackTitle,
    description: profile?.description?.trim().slice(0, 160) || t.metaFallbackDescription,
  })

  useEffect(() => {
    if (location.hash !== '#menu' && location.hash !== '#lunch') return
    const frame = requestAnimationFrame(() => {
      const menu = document.getElementById(location.hash.slice(1))
      menu?.scrollIntoView({ behavior: 'instant', block: 'start' })
      menu?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [location.hash, locale, lunch.kind])

  return <div className="public-site" id="top" lang={locale} translate="no">
    <a className="skip-link" href="#main">{t.skip}</a>
    <SiteHeader locale={locale} orderLinks={orderLinks} showLunch={showLunch} />
    <main id="main">
      <Hero locale={locale} displayName={profile?.displayName} description={profile?.description} profileLoading={restaurant.kind === 'loading'} openingStatus={openingStatus} orderLinks={orderLinks} showLunch={showLunch} />
      <LunchSection locale={locale} resource={lunch} openingStatus={openingStatus} openingHours={openingHours} />
      <MenuSection locale={locale} resource={menu} showLunch={showLunch} />
      <PromotionsSection locale={locale} resource={promotions} />
      <VisitSection locale={locale} restaurant={restaurant} openingHours={openingHours} openingStatus={openingStatus} />
      <div className="closing-signature"><img {...brandImage} sizes="clamp(148px, 15vw, 220px)" alt={t.logoAlt} loading="lazy" /></div>
    </main>
    <SiteFooter locale={locale} restaurant={profile} />
  </div>
}

function SiteHeader({ locale, orderLinks, showLunch }: { locale: PublicLocale; orderLinks: ReturnType<typeof deliveryLinks>; showLunch: boolean }) {
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
      <a className="brand-link" href="#top" aria-label={t.backTopLabel} onClick={closeMenu}><img {...brandImage} sizes="(max-width: 370px) 54px, (max-width: 1100px) 62px, 69px" alt={t.logoAlt} /></a>
      <div className="public-header-right">
        <nav className="desktop-nav" aria-label={t.primaryNav}>
          {showLunch && <a href="#lunch">{lunchText[locale].nav}</a>}<a href="#menu">{t.menu}</a><a href="#visit">{t.visit}</a>
          {orderLinks.length > 0 && <HeaderDelivery locale={locale} links={orderLinks} />}
        </nav>
        {orderLinks.length > 0 && <div className="mobile-header-order"><HeaderDelivery locale={locale} links={orderLinks} compact onOpen={closeMenu} /></div>}
        <LanguageSelector locale={locale} onSelect={closeMenu} />
        <button className="menu-toggle" type="button" ref={toggleRef} aria-label={menuOpen ? `${t.close} — ${t.closeMenu}` : `${t.menu} — ${t.openMenu}`}
          aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(open => !open)}>
          <span className="menu-toggle-label">{menuOpen ? t.close : t.menu}</span>
          <span className={`menu-toggle-lines${menuOpen ? ' is-open' : ''}`} aria-hidden="true"><i /><i /></span>
        </button>
      </div>
    </div>
    <nav id="mobile-navigation" className={`mobile-nav${menuOpen ? ' is-open' : ''}`} aria-label={t.mobileNav} inert={!menuOpen}>
      {showLunch && <a href="#lunch" onClick={() => navigateTo('lunch')}>{lunchText[locale].nav} <b aria-hidden="true">↗</b></a>}
      <a href="#menu" onClick={() => navigateTo('menu')}>{t.menu} <b aria-hidden="true">↗</b></a>
      <a href="#visit" onClick={() => navigateTo('visit')}>{t.visit} <b aria-hidden="true">↗</b></a>
      {orderLinks.length > 0 && <div className="mobile-delivery" role="group" aria-label={t.orderDelivery}>
        <span className="mobile-delivery-label">{t.orderDelivery}</span>
        <div className="mobile-delivery-links">{orderLinks.map(link => <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => {
          const provider = deliveryProvider(link.label)
          if (provider) capturePublicEvent('delivery_provider_clicked', { provider, placement: 'header', locale })
          closeMenu()
        }}>
          <DeliveryProviderBrand service={link.label} /> <b aria-hidden="true">↗</b><span className="sr-only"> ({t.newTab})</span></a>)}</div>
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
  if (links.length === 1) return <a className={`nav-order-direct${compact ? ' is-compact' : ''}`} href={links[0].url} target="_blank" rel="noopener noreferrer" onClick={() => {
    const provider = deliveryProvider(links[0].label)
    if (provider) capturePublicEvent('delivery_provider_clicked', { provider, placement: 'header', locale })
    onOpen?.()
  }} aria-label={`${t.orderDelivery}: ${links[0].label} (${t.newTab})`}>
    <span>{t.orderDelivery}</span>{!compact && <DeliveryProviderBrand service={links[0].label} />}</a>
  return <details ref={detailsRef} className={`nav-order${compact ? ' is-compact' : ''}`}><summary aria-label={compact ? t.orderDelivery : undefined} onClick={onOpen}>
    <span className="nav-order-label">{t.orderDelivery}</span><span className="dropdown-chevron nav-order-chevron" aria-hidden="true" /></summary>
    <div className="nav-order-list" role="group" aria-label={t.chooseDeliveryService}>{links.map(link => <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => {
      const provider = deliveryProvider(link.label)
      if (provider) capturePublicEvent('delivery_provider_clicked', { provider, placement: 'header', locale })
    }}>
      <DeliveryProviderBrand service={link.label} /><span aria-hidden="true">↗</span><span className="sr-only"> ({t.newTab})</span></a>)}</div>
  </details>
}

function Hero({ locale, displayName, description, profileLoading, openingStatus, orderLinks, showLunch }: {
  locale: PublicLocale; displayName?: string; description?: string; profileLoading: boolean; openingStatus: Resource<OpeningStatus>; orderLinks: ReturnType<typeof deliveryLinks>; showLunch: boolean
}) {
  const t = publicText[locale]
  const today = openingStatus.kind === 'success' ? openingStatus.data : undefined
  const browseOrderText = orderLinks.length > 1 ? t.browseOrderBoth : orderLinks[0]?.label === 'Wolt' ? t.browseOrderWolt : t.browseOrderBolt
  return <section className="hero" aria-labelledby="hero-title">
    <div className="hero-media" aria-hidden="true"><img {...heroImage} width="1672" height="941" alt="" fetchPriority="high" decoding="async" /></div>
    <div className="hero-inner layout-wrap"><div className="hero-copy">
      <h1 id="hero-title">{displayName ?? "Gio's Kebab"}</h1>
      {profileLoading ? <p className="hero-description hero-description-loading" role="status"><span className="sr-only">{t.menuLoading}</span></p>
        : description?.trim() && <p className="hero-description">{description}</p>}
      <div className="hero-ordering">
        <div className="hero-actions"><a className="button button-light" href={showLunch ? '#lunch' : '#menu'} onClick={() => capturePublicEvent('menu_explore_clicked', { locale })}>{t.exploreMenu} <span aria-hidden="true">↗</span></a></div>
        {(orderLinks.length > 0 || profileLoading) && <><p className={`hero-order-helper${profileLoading ? ' hero-helper-loading' : ''}`} aria-hidden={profileLoading || undefined}>{profileLoading ? t.browseOrderBoth : browseOrderText}</p>
          <div className={`hero-provider-actions${orderLinks.length === 1 ? ' is-single' : ''}`} role="group" aria-label={t.orderDelivery} aria-hidden={profileLoading || undefined}>
            {profileLoading && <><span className="hero-provider-action hero-provider-loading" /><span className="hero-provider-action hero-provider-loading" /></>}
            {orderLinks.map(link => <a key={link.label} className="hero-provider-action" href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} (${t.newTab})`} onClick={() => {
              const provider = deliveryProvider(link.label)
              if (provider) capturePublicEvent('delivery_provider_clicked', { provider, placement: 'hero', locale })
            }}>
              <DeliveryProviderBrand service={link.label} /><span className="hero-provider-arrow" aria-hidden="true">↗</span><span className="sr-only">{t.newTab}</span>
            </a>)}
          </div></>}
      </div>
      {openingStatus.kind === 'loading' && <div className="hero-opening hero-opening-loading" aria-hidden="true"><span className="status-dot" /><span>&nbsp;</span></div>}
      {today && <div className="hero-opening" role="status"><span className={`status-dot${today.openNow ? ' is-open' : ' is-closed'}`} aria-hidden="true" />
        <span>{openingStatusText(today, locale)}{today.source === 'SPECIAL' ? ` · ${t.specialToday}` : ''}</span></div>}
    </div></div>
  </section>
}
