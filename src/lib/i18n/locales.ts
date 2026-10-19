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

let adminLocaleCache: AdminLocale = 'ka'
export function readAdminLocale(): AdminLocale {
  return adminLocaleCache
}
export function saveAdminLocale(locale: AdminLocale) {
  adminLocaleCache = locale
}
