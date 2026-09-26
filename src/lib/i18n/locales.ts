export const publicLocales = ['lt', 'en', 'ru', 'ka'] as const
export type PublicLocale = typeof publicLocales[number]
export type AdminLocale = 'ka' | 'ru'
export type TranslationLocale = Exclude<PublicLocale, 'lt'>

export const localeNames: Record<PublicLocale, string> = {
  lt: 'Lietuvių', en: 'English', ru: 'Русский', ka: 'ქართული',
}

export const intlLocales: Record<PublicLocale, string> = {
  lt: 'lt-LT', en: 'en', ru: 'ru', ka: 'ka-GE',
}

export function isPublicLocale(value: string | undefined): value is PublicLocale {
  return publicLocales.some(locale => locale === value)
}

const adminPreferenceKey = 'gios-admin-interface-language'
let adminLocaleCache: AdminLocale | null = null
export function readAdminLocale(): AdminLocale {
  if (adminLocaleCache) return adminLocaleCache
  try { adminLocaleCache = localStorage.getItem(adminPreferenceKey) === 'ru' ? 'ru' : 'ka' }
  catch { adminLocaleCache = 'ka' }
  return adminLocaleCache
}
export function saveAdminLocale(locale: AdminLocale) {
  adminLocaleCache = locale
  try { localStorage.setItem(adminPreferenceKey, locale) } catch { /* Preferences remain usable in memory. */ }
}
