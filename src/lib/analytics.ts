import type { PublicLocale } from './i18n/locales'

type Provider = 'wolt' | 'bolt'
type Placement = 'hero' | 'header' | 'visit/order-delivery'
type SocialProvider = 'instagram' | 'facebook' | 'tiktok'

type Events = {
  product_opened: { product_id: number; product_name: string; category_id?: number; category_key: string; category_name?: string; source: 'menu' | 'lunch'; locale: PublicLocale }
  menu_category_selected: { category_id: number; category_name: string; locale: PublicLocale }
  lunch_day_selected: { weekday: string; locale: PublicLocale }
  delivery_provider_clicked: { provider: Provider; placement: Placement; locale: PublicLocale }
  call_clicked: { placement: 'visit'; locale: PublicLocale }
  directions_clicked: { locale: PublicLocale }
  google_review_clicked: { locale: PublicLocale }
  social_clicked: { provider: SocialProvider; locale: PublicLocale }
  language_changed: { from_locale: PublicLocale; to_locale: PublicLocale }
  menu_explore_clicked: { locale: PublicLocale }
  api_request_failed: { method: 'GET'; endpoint: string; status?: number; failure_category: 'server_error' | 'network' | 'invalid_response'; route: string; locale: PublicLocale }
}

export function capturePublicEvent<Name extends keyof Events>(name: Name, properties: Events[Name]): void {
  // Product analytics intentionally disabled for V1. Preserve typed event semantics only.
  void name
  void properties
}

export function deliveryProvider(label: string): Provider | null {
  return label === 'Wolt' ? 'wolt' : label === 'Bolt Food' ? 'bolt' : null
}

export function reportPublicApiFailure(path: string, status: number | null, category: Events['api_request_failed']['failure_category']): void {
  if (!/^\/(lt|en|ru|ka)(?:\/|$)/.test(window.location.pathname)) return
  const locale = window.location.pathname.split('/')[1] as PublicLocale
  const endpoint = /^\/api\/public\/(restaurant|opening-status|opening-hours|menu|lunch-menu|promotions)(?:\?|$)/.exec(path)?.[1]
  if (!endpoint) return
  capturePublicEvent('api_request_failed', {
    method: 'GET', endpoint, ...(status === null ? {} : { status }), failure_category: category,
    route: window.location.pathname, locale,
  })
}
