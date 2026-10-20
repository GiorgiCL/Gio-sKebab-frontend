import { useEffect, useRef } from 'react'
import { Link, useOutletContext } from 'react-router'
import { usePageMetadata } from '../../lib/pageMetadata'
import { brandImage } from './brandImage'
import { intlLocales, type PublicLocale } from '../../lib/i18n/locales'
import { additionalBusinessEmail, authorities, businessIdentity, legalText, legalUpdatedDate } from './legalText'
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
  const extraEmail = additionalBusinessEmail(profile?.email)

  usePageMetadata({ locale, page: kind, title: `${title} | Gio's Kebab`, description })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    heading.current?.focus({ preventScroll: true })
  }, [locale, title, description])

  const sections = kind === 'privacy'
    ? [t.scope, t.technical, t.correspondence, t.admin, t.cookies, t.retention, t.providers, t.external]
    : [t.scope, t.external]

  return <div className="public-site information-site" id="top" lang={locale} translate="no">
    <a className="skip-link" href="#main">{common.skip}</a>
    <header className="site-header"><div className="site-header-inner layout-wrap">
      <Link className="brand-link" to={`/${locale}`} aria-label={t.home}><img {...brandImage} sizes="(max-width: 370px) 54px, (max-width: 1100px) 62px, 69px" alt={common.logoAlt} /></Link>
      <div className="public-header-right">
        <Link className="information-home" to={`/${locale}`}>{t.home}</Link>
        <LanguageSelector locale={locale} onSelect={() => {}} />
      </div>
    </div></header>
    <main id="main" className="information-main" tabIndex={-1}>
      <article className="information-copy">
        <h1 ref={heading} tabIndex={-1}>{title}</h1>
        <p>{t.updated} <time dateTime={legalUpdatedDate}>{new Intl.DateTimeFormat(intlLocales[locale], { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${legalUpdatedDate}T00:00:00Z`))}</time></p>
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
          <h3>{t.objection.title}</h3><p>{t.objection.body}</p>
          <p>{t.complaint} <a href={authorities.privacy.url} lang="lt">{authorities.privacy.name}</a>.</p>
        </section> : <section>
          <h2>{t.disputes.title}</h2><p>{t.disputes.body}</p>
          <p>{t.consumerGuidance} <a href={authorities.consumer.url} lang="lt">{authorities.consumer.name}</a>.</p>
          <p>{authorities.consumer.address}</p>
        </section>}
        <section aria-labelledby="contact-heading">
          <h2 id="contact-heading">{t.contact}</h2><p>{t.contactIntro}</p>
          <dl className="information-details">
            <div><dt>{t.email}</dt><dd><a href={`mailto:${businessIdentity.email}`}>{businessIdentity.email}</a></dd></div>
            <div><dt>{t.restaurantAddress}</dt><dd><address>{profile?.address?.trim() || businessIdentity.restaurantAddress}</address></dd></div>
            <div><dt>{t.phone}</dt><dd><a href={`tel:${(profile?.phone?.trim() || businessIdentity.phone).replace(/[^\d+]/g, '')}`}>{profile?.phone?.trim() || businessIdentity.phone}</a></dd></div>
            {extraEmail && <div><dt>{t.email}</dt><dd><a href={`mailto:${extraEmail}`}>{extraEmail}</a></dd></div>}
          </dl>
          {restaurant.kind === 'loading' && <p role="status">{common.visitLoading}</p>}
          {restaurant.kind === 'error' && <div><p role="status">{t.contactUnavailable}</p><button className="information-retry" type="button" onClick={restaurant.retry}>{common.retry}</button></div>}
        </section>
      </article>
    </main>
    <SiteFooter locale={locale} restaurant={profile} />
  </div>
}
