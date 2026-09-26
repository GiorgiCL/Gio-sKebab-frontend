export interface Owner { email: string }
export interface RestaurantProfile {
  displayName: string; description: string; address: string; phone: string
  email: string | null; googleMapsUrl: string; woltUrl: string | null
  boltFoodUrl: string | null; instagramUrl: string | null; facebookUrl: string | null
  createdAt: string; updatedAt: string
}
export type ProfileInput = Omit<RestaurantProfile, 'createdAt' | 'updatedAt'>
export type Day = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
export interface HoursRule { open: boolean; openingTime: string | null; closingTime: string | null }
export interface WeeklyDay extends HoursRule { dayOfWeek: Day }
export interface SpecialDate extends HoursRule { date: string }
export interface CategoryInput { name: string; displayOrder: number; active: boolean }
export interface Category extends CategoryInput { id: number; createdAt: string; updatedAt: string }
export interface ItemInput {
  categoryId: number; name: string; description: string; priceEur: number
  active: boolean; available: boolean; featured: boolean; imageUrl: string | null; displayOrder: number
}
export interface Item extends ItemInput { id: number; createdAt: string; updatedAt: string }
export interface PromotionInput {
  title: string; description: string | null; active: boolean
  startsAt: string | null; endsAt: string | null; displayOrder: number
}
export interface Promotion extends PromotionInput { id: number; timeZone: string; createdAt: string; updatedAt: string }
