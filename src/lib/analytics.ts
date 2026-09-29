import type { PublicLocale } from './i18n/locales'

type Provider = 'wolt' | 'bolt'
type Placement = 'hero' | 'header' | 'visit/order-delivery'
type SocialProvider = 'instagram' | 'facebook' | 'tiktok'

type Events = {
  product_opened: { product_id: number; product_name: string; category_id?: number; category_name?: string; source: 'menu' | 'lunch'; locale: PublicLocale }
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

type Client = typeof import('posthog-js').default
let client: Client | undefined
let starting: Promise<void> | undefined

const publicRoute = (path: string) => /^\/(lt|en|ru|ka)(?:\/|$)/.test(path)

export function startPublicAnalytics(): void {
  if (!publicRoute(window.location.pathname)) return
  if (client) return
  if (starting) return
  const key = import.meta.env.VITE_POSTHOG_KEY?.trim()
  const host = import.meta.env.VITE_POSTHOG_HOST?.trim()
  if (import.meta.env.VITE_POSTHOG_ENABLED !== 'true' || !key || !host) return

  starting = import('posthog-js').then(({ default: posthog }) => {
    if (!publicRoute(window.location.pathname)) return
    posthog.init(key, {
      api_host: host,
      defaults: '2026-05-30',
      cookieless_mode: 'always',
      person_profiles: 'never',
      respect_dnt: true,
      capture_pageview: 'history_change',
      capture_pageleave: true,
      autocapture: { dom_event_allowlist: ['click'], element_allowlist: ['a', 'button'], url_allowlist: [/\/(lt|en|ru|ka)(?:[/?#]|$)/] },
      rageclick: false,
      capture_dead_clicks: false,
      capture_heatmaps: false,
      disable_surveys: true,
      advanced_disable_feature_flags: true,
      enable_recording_console_log: false,
      capture_exceptions: { capture_unhandled_errors: true, capture_unhandled_rejections: true, capture_console_errors: false },
      capture_performance: { web_vitals: true },
      // PostHog does not support Replay without cookie consent in cookieless mode.
      disable_session_recording: true,
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: '*',
        blockSelector: '.ph-no-capture',
        recordHeaders: false,
        recordBody: false,
        maskCapturedNetworkRequestFn: () => null,
      },
      mask_all_element_attributes: true,
      mask_all_text: true,
      mask_personal_data_properties: true,
      disable_capture_url_hashes: true,
      before_send: event => {
        if (!event || !publicRoute(window.location.pathname)) return null
        const capturedUrl = event.properties?.$current_url
        if (typeof capturedUrl === 'string') {
          try { if (!publicRoute(new URL(capturedUrl).pathname)) return null }
          catch { return null }
        }
        // Do not send arbitrary URL queries or fragments. PostHog extracts UTM fields separately.
        for (const property of ['$current_url', '$initial_current_url', '$session_entry_url', '$referrer', '$initial_referrer', '$external_click_url']) {
          const value = event.properties?.[property]
          if (typeof value !== 'string') continue
          try {
            const url = new URL(value)
            if (url.protocol === 'https:' || url.protocol === 'http:') event.properties[property] = url.origin + url.pathname
            else delete event.properties[property]
          }
          catch { delete event.properties[property] }
        }
        return event
      },
    })
    client = posthog
  }).catch(() => { /* Telemetry must never affect the public site. */ }).finally(() => { starting = undefined })
}

export function stopPublicAnalytics(): void {
  try { client?.stopSessionRecording() } catch { /* Replay is optional. */ }
}

export function capturePublicEvent<Name extends keyof Events>(name: Name, properties: Events[Name]): void {
  if (!publicRoute(window.location.pathname)) return
  if (!client) {
    startPublicAnalytics()
    void starting?.then(() => {
      if (client && publicRoute(window.location.pathname)) {
        try { client.capture(name, properties) } catch { /* Telemetry is optional. */ }
      }
    })
    return
  }
  try { client.capture(name, properties) } catch { /* Telemetry is optional. */ }
}

export function deliveryProvider(label: string): Provider | null {
  return label === 'Wolt' ? 'wolt' : label === 'Bolt Food' ? 'bolt' : null
}

export function reportPublicApiFailure(path: string, status: number | null, category: Events['api_request_failed']['failure_category']): void {
  if (!publicRoute(window.location.pathname)) return
  const locale = window.location.pathname.split('/')[1] as PublicLocale
  const endpoint = /^\/api\/public\/(restaurant|opening-status|opening-hours|menu|lunch-menu|promotions)(?:\?|$)/.exec(path)?.[1]
  if (!endpoint) return
  capturePublicEvent('api_request_failed', {
    method: 'GET', endpoint, ...(status === null ? {} : { status }), failure_category: category,
    route: window.location.pathname, locale,
  })
}
