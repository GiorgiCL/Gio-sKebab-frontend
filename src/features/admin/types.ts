import type { TranslationLocale } from '../../lib/i18n/locales'

export type TranslationMap<T> = Partial<Record<TranslationLocale, T>>
export type ResponseTranslations<T> = { lt: T } & TranslationMap<T>
export interface ProfileTranslation { displayName: string | null; description: string | null }
export interface CategoryTranslation { name: string | null }
export interface ItemTranslation { name: string | null; description: string | null }
export interface PromotionTranslation { title: string | null; description: string | null }
export interface Owner { email: string }
export interface RestaurantProfile {
  displayName: string; description: string; address: string; phone: string
  email: string | null; googleMapsUrl: string; woltUrl: string | null
  boltFoodUrl: string | null; instagramUrl: string | null; facebookUrl: string | null
  createdAt: string; updatedAt: string; translations: ResponseTranslations<ProfileTranslation>
}
export type ProfileInput = Omit<RestaurantProfile, 'createdAt' | 'updatedAt' | 'translations'> & { translations: TranslationMap<ProfileTranslation> }
export type Day = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
export interface HoursRule { open: boolean; openingTime: string | null; closingTime: string | null }
export interface WeeklyDay extends HoursRule { dayOfWeek: Day }
export interface SpecialDate extends HoursRule { date: string }
export interface CategoryInput { name: string; displayOrder: number; active: boolean; translations: TranslationMap<CategoryTranslation> }
export interface Category extends CategoryInput { id: number; createdAt: string; updatedAt: string; translations: ResponseTranslations<CategoryTranslation> }
export interface ItemInput {
  categoryId: number; name: string; description: string; priceEur: number
  active: boolean; available: boolean; featured: boolean; imageUrl: string | null; displayOrder: number; translations: TranslationMap<ItemTranslation>
}
export interface Item extends ItemInput { id: number; createdAt: string; updatedAt: string; translations: ResponseTranslations<ItemTranslation> }
export interface PromotionInput {
  title: string; description: string | null; active: boolean
  startsAt: string | null; endsAt: string | null; displayOrder: number; translations: TranslationMap<PromotionTranslation>
}
export interface Promotion extends PromotionInput { id: number; timeZone: string; createdAt: string; updatedAt: string; translations: ResponseTranslations<PromotionTranslation> }
