import { useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { localeNames, publicLocales, type PublicLocale } from '../../lib/i18n/locales'
import { capturePublicEvent } from '../../lib/analytics'
import { FacebookIcon, InstagramIcon, TikTokIcon } from './components/ServiceIcons'
import { publicText } from './text'
import { legalText } from './legalText'
import { socialLinks } from './socialLinks'
import type { Restaurant } from './types'

export function LanguageSelector({ locale, onSelect }: { locale: PublicLocale; onSelect: () => void }) {
  const location = useLocation()
  const rest = location.pathname.slice(`/${locale}`.length)
  const detailsRef = useRef<HTMLDetailsElement>(null)
  useEffect(() => { if (detailsRef.current) detailsRef.current.open = false }, [locale])
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => { if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) detailsRef.current.open = false }
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !detailsRef.current?.open) return
      event.preventDefault(); detailsRef.current.open = false; detailsRef.current.querySelector('summary')?.focus()
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeEscape)
    return () => { document.removeEventListener('pointerdown', closeOutside); document.removeEventListener('keydown', closeEscape) }
  }, [])
  return <nav className="public-languages" aria-label={publicText[locale].language}><details ref={detailsRef}>
    <summary aria-label={`${publicText[locale].language}: ${localeNames[locale]}`}><span className="public-language-code">{locale.toUpperCase()}</span><span className="dropdown-chevron language-chevron" aria-hidden="true" /></summary>
    <div className="public-language-list">{publicLocales.map(code => <Link key={code} to={`/${code}${rest}${location.search}${location.hash}`}
      lang={code} hrefLang={code} aria-label={localeNames[code]} aria-current={locale === code ? 'page' : undefined}
      className={locale === code ? 'active' : ''} onClick={() => {
        if (code !== locale) capturePublicEvent('language_changed', { from_locale: locale, to_locale: code })
        if (detailsRef.current) detailsRef.current.open = false; onSelect(); requestAnimationFrame(() => detailsRef.current?.querySelector('summary')?.focus())
      }}>
      <span>{code.toUpperCase()}</span><span>{localeNames[code]}</span>{locale === code && <span aria-hidden="true">✓</span>}</Link>)}</div>
  </details></nav>
}

export function SiteFooter({ locale, restaurant }: { locale: PublicLocale; restaurant: Restaurant | undefined }) {
  const t = publicText[locale]
  return <footer className="site-footer"><div className="layout-wrap footer-top">
    <a href="#top">{t.backTop} <span aria-hidden="true">↑</span></a>
  </div><div className="layout-wrap footer-bottom">
    <span>© {new Date().getFullYear()} Gio's Kebab</span>
    <div className="footer-socials">
      {restaurant?.instagramUrl && <a href={restaurant.instagramUrl} target="_blank" rel="noopener noreferrer" onClick={() => capturePublicEvent('social_clicked', { provider: 'instagram', locale })}><InstagramIcon /> Instagram <span className="sr-only">({t.newTab})</span></a>}
      <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" aria-label={`TikTok (${t.newTab})`} onClick={() => capturePublicEvent('social_clicked', { provider: 'tiktok', locale })}><TikTokIcon /> TikTok</a>
      <a href={restaurant?.facebookUrl || socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label={`Facebook (${t.newTab})`} onClick={() => capturePublicEvent('social_clicked', { provider: 'facebook', locale })}><FacebookIcon /> Facebook</a>
    </div>
  </div><div className="layout-wrap"><LegalLinks locale={locale} /></div></footer>
}

export function LegalLinks({ locale }: { locale: PublicLocale }) {
  const t = legalText[locale]
  return <nav className="footer-legal" aria-label={t.navigation}>
    <NavLink to={`/${locale}/privacy`}>{t.privacy}</NavLink>
    <NavLink to={`/${locale}/legal`}>{t.legal}</NavLink>
  </nav>
}
