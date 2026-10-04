import { useEffect, useRef } from 'react'
import { Link, useOutletContext } from 'react-router'
import logoUrl from '../../assets/brand/gios-kebab-logo.jpg'
import type { PublicLocale } from '../../lib/i18n/locales'
import { authorities, businessIdentity, legalText } from './legalText'
import { LanguageSelector, SiteFooter } from './PublicNavigation'
import { publicText } from './text'
import type { Restaurant } from './types'
import { usePublicResource } from './usePublicResource'
import './public.css'
import './legal.css'

export function PrivacyPage() { return <InformationPage kind="privacy" /> }
export function BusinessPage() { return <InformationPage kind="legal" /> }

function InformationPage({ kind }: { kind: 'privacy' | 'legal' }) {
  const locale = useOutletContext<PublicLocale>()
  const t = legalText[locale]
  const common = publicText[locale]
  const title = t[kind]
  const description = kind === 'privacy' ? t.privacyDescription : t.legalDescription
  const heading = useRef<HTMLHeadingElement>(null)
  const restaurant = usePublicResource<Restaurant>(`/api/public/restaurant?lang=${locale}`)
  const profile = restaurant.kind === 'success' ? restaurant.data : undefined

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = `${title} | Gio's Kebab`
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (meta) meta.content = description
    window.scrollTo({ top: 0, behavior: 'instant' })
    heading.current?.focus({ preventScroll: true })
  }, [locale, title, description])

  const sections = kind === 'privacy'
    ? [t.scope, t.technical, t.admin, t.cookies, t.providers, t.external]
    : [t.scope, t.external]

  return <div className="public-site information-site" id="top" lang={locale} translate="no">
    <a className="skip-link" href="#main">{common.skip}</a>
    <header className="site-header"><div className="site-header-inner layout-wrap">
      <Link className="brand-link" to={`/${locale}`} aria-label={t.home}><img src={logoUrl} width="1024" height="1024" alt={common.logoAlt} /></Link>
      <div className="public-header-right">
        <Link className="information-home" to={`/${locale}`}>{t.home}</Link>
        <LanguageSelector locale={locale} onSelect={() => {}} />
      </div>
    </div></header>
    <main id="main" className="information-main" tabIndex={-1}>
      <article className="information-copy">
        <h1 ref={heading} tabIndex={-1}>{title}</h1>
        <section>
          <h2>{kind === 'privacy' ? t.controller : t.operator}</h2>
          <p>{t.operatedBy}</p>
          <dl className="information-details">
            <div><dt>{t.companyCode}</dt><dd>{businessIdentity.companyCode}</dd></div>
            <div><dt>{t.vatCode}</dt><dd>{businessIdentity.vatCode}</dd></div>
            <div><dt>{t.registeredOffice}</dt><dd>{businessIdentity.registeredOffice}</dd></div>
          </dl>
          <p>{t.register}</p>
          <p>{t.officeNote}</p>
        </section>
        {sections.map(section => <section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}
        {kind === 'privacy' ? <section>
          <h2>{t.rights.title}</h2><p>{t.rights.body}</p>
          <p>{t.complaint} <a href={authorities.privacy.url} lang="lt">{authorities.privacy.name}</a>.</p>
        </section> : <section>
          <h2>{t.disputes.title}</h2><p>{t.disputes.body}</p>
          <p>{t.consumerGuidance} <a href={authorities.consumer.url} lang="lt">{authorities.consumer.name}</a>.</p>
          <p>{authorities.consumer.address}</p>
        </section>}
        <section aria-labelledby="contact-heading">
          <h2 id="contact-heading">{t.contact}</h2><p>{t.contactIntro}</p>
          {restaurant.kind === 'loading' && <p role="status">{common.visitLoading}</p>}
          {restaurant.kind === 'error' && <div><p role="status">{t.contactUnavailable}</p><button className="information-retry" type="button" onClick={restaurant.retry}>{common.retry}</button></div>}
          {profile && <dl className="information-details">
            {profile.address?.trim() && <div><dt>{t.restaurantAddress}</dt><dd><address>{profile.address}</address></dd></div>}
            {profile.phone?.trim() && <div><dt>{t.phone}</dt><dd><a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}>{profile.phone}</a></dd></div>}
            {profile.email?.trim() && <div><dt>{t.email}</dt><dd><a href={`mailto:${profile.email}`}>{profile.email}</a></dd></div>}
          </dl>}
        </section>
      </article>
    </main>
    <SiteFooter locale={locale} restaurant={profile} />
  </div>
}
