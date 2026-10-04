import { useEffect } from 'react'
import { publicLocales, type PublicLocale } from './i18n/locales'
import type { Restaurant } from '../features/public/types'

export const siteOrigin = 'https://gioskebab.lt'
export const logoUrl = '/gios-kebab-logo.jpg'
type PublicPage = '' | 'privacy' | 'legal'

type PageMetadata = {
  locale: PublicLocale
  title: string
  description?: string
  /** Omit for admin, missing routes and errors: these must not be indexed. */
  page?: PublicPage
  restaurant?: Restaurant
}

export function usePageMetadata({ locale, title, description = '', page, restaurant }: PageMetadata) {
  const path = page === undefined ? null : `/${locale}${page ? `/${page}` : ''}`
  // Address remains API-provided text. Do not guess postal fields, hours or ratings.
  const structuredData = page === '' && restaurant?.displayName?.trim() && restaurant.address?.trim()
    ? JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Restaurant', '@id': `${siteOrigin}/#restaurant`,
      name: restaurant.displayName, url: `${siteOrigin}${path}`, address: restaurant.address,
      ...(restaurant.description?.trim() ? { description: restaurant.description } : {}),
      ...(restaurant.phone?.trim() ? { telephone: restaurant.phone } : {}),
      ...(restaurant.email?.trim() ? { email: restaurant.email } : {}),
      logo: `${siteOrigin}${logoUrl}`, hasMenu: `${siteOrigin}${path}#menu`,
    }) : null

  useEffect(() => {
    // Replace the static fallback and previous route metadata, including on SPA navigation.
    document.head.querySelectorAll('[data-page-metadata], meta[name="description"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"], link[rel="alternate"][hreflang]').forEach(node => node.remove())
    document.documentElement.lang = locale
    document.title = title
    const meta = (key: string, content: string, property = false) => {
      const element = document.createElement('meta')
      element.setAttribute(property ? 'property' : 'name', key)
      element.content = content
      element.dataset.pageMetadata = ''
      document.head.append(element)
    }
    const link = (rel: string, href: string, language?: string) => {
      const element = document.createElement('link')
      element.rel = rel; element.href = href
      if (language) element.hreflang = language
      element.dataset.pageMetadata = ''
      document.head.append(element)
    }
    meta('robots', path ? 'index, follow' : 'noindex, nofollow')
    if (description) meta('description', description)
    if (path) {
      const url = `${siteOrigin}${path}`
      const suffix = page ? `/${page}` : ''
      link('canonical', url)
      publicLocales.forEach(code => link('alternate', `${siteOrigin}/${code}${suffix}`, code))
      link('alternate', `${siteOrigin}/lt${suffix}`, 'x-default')
      meta('og:type', 'website', true)
      meta('og:site_name', "Gio's Kebab", true)
      meta('og:title', title, true)
      meta('og:description', description, true)
      meta('og:url', url, true)
      meta('og:image', `${siteOrigin}${logoUrl}`, true)
      meta('og:image:alt', "Gio's Kebab", true)
      meta('twitter:card', 'summary')
      meta('twitter:title', title)
      meta('twitter:description', description)
      meta('twitter:image', `${siteOrigin}${logoUrl}`)
      meta('twitter:image:alt', "Gio's Kebab")
      if (structuredData) {
        const script = document.createElement('script')
        script.type = 'application/ld+json'; script.dataset.pageMetadata = ''
        script.textContent = structuredData
        document.head.append(script)
      }
    }
    return () => document.head.querySelectorAll('[data-page-metadata]').forEach(node => node.remove())
  }, [locale, title, description, page, path, structuredData])
}
