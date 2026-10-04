import { usePageMetadata } from '../lib/pageMetadata'
import { Outlet, useParams } from 'react-router'
import { isPublicLocale } from '../lib/i18n/locales'

export function PublicLocaleLayout() {
  const { lang } = useParams()
  if (!isPublicLocale(lang)) return <PublicNotFound />
  return <Outlet context={lang} />
}

export function PublicNotFound() {
  const { lang } = useParams()
  usePageMetadata({ locale: isPublicLocale(lang) ? lang : 'lt', title: "404 | Gio's Kebab" })
  return <main className="public-not-found"><h1>404</h1><a href="/lt">Gio's Kebab</a></main>
}
