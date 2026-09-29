import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router'
import { isPublicLocale } from '../lib/i18n/locales'
import { startPublicAnalytics, stopPublicAnalytics } from '../lib/analytics'

export function PublicLocaleLayout() {
  const { lang } = useParams()
  useEffect(() => {
    if (isPublicLocale(lang)) startPublicAnalytics()
  }, [lang])
  useEffect(() => stopPublicAnalytics, [])
  if (!isPublicLocale(lang)) return <PublicNotFound />
  return <Outlet context={lang} />
}

export function PublicNotFound() {
  return <main className="public-not-found"><h1>404</h1><a href="/lt">Gio's Kebab</a></main>
}
