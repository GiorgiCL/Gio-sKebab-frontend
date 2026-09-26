import type { PublicLocale, TranslationLocale } from '../../lib/i18n/locales'
import type { TranslationMap } from './types'

export interface TextDraft { first: string; second: string }
export type TranslationDraft = Record<PublicLocale, TextDraft>
const empty = (): TextDraft => ({ first: '', second: '' })

export function makeTranslationDraft(canonical: TextDraft, translations: Partial<Record<TranslationLocale, Partial<TextDraft>>> = {}): TranslationDraft {
  return {
    lt: canonical,
    en: { ...empty(), ...translations.en },
    ru: { ...empty(), ...translations.ru },
    ka: { ...empty(), ...translations.ka },
  }
}

export function collectTranslations<T>(draft: TranslationDraft, make: (first: string | null, second: string | null) => T): TranslationMap<T> {
  const result: TranslationMap<T> = {}
  for (const locale of ['en', 'ru', 'ka'] as const) {
    const first = draft[locale].first.trim() || null
    const second = draft[locale].second.trim() || null
    if (first !== null || second !== null) result[locale] = make(first, second)
  }
  return result
}
