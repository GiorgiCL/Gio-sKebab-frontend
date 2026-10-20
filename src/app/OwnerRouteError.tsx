import { Link } from 'react-router'
import { usePageMetadata } from '../lib/pageMetadata'
import { readAdminLocale } from '../lib/i18n/locales'

export function OwnerRouteError() {
  usePageMetadata({ locale: readAdminLocale(), title: "Owner workspace | Gio's Kebab" })
  return <main lang="en" style={{ minHeight: '100svh', padding: '48px 24px' }}>
    <h1>The owner workspace could not load.</h1>
    <p>Please check your connection and try again.</p>
    <button type="button" onClick={() => window.location.reload()}>Try again</button>
    <p><Link to="/lt">Gio's Kebab</Link></p>
  </main>
}
