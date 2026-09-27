import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { isPublicLocale } from '../../lib/i18n/locales'
import { publicRouteErrorText } from './text'
import './public.css'

export function PublicRouteError() {
  const { lang } = useParams()
  const locale = isPublicLocale(lang) ? lang : 'lt'
  const t = publicRouteErrorText[locale]
  useEffect(() => { document.documentElement.lang = locale; document.title = `${t.title} | Gio's Kebab` }, [locale, t.title])

  return <main className="public-site public-route-error" lang={locale} translate="no">
    <div className="layout-wrap public-route-error-inner">
      <Link to={`/${locale}`} className="public-route-error-brand">Gio's Kebab</Link>
      <div role="alert">
        <p className="eyebrow"><span className="eyebrow-mark" /> {t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className="public-route-error-copy">{t.description}</p>
        <div className="hero-actions">
          <button type="button" className="button button-light" onClick={() => window.location.reload()}>{t.retry} <span aria-hidden="true">↻</span></button>
          <Link className="text-link" to={`/${locale}#menu`}>{t.menu} <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </div>
  </main>
}
