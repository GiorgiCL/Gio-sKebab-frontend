// These shapes mirror the backend's public response DTOs. Admin-only fields stay out of this layer.
export interface Restaurant {
  displayName: string
  description: string
  address: string
  phone: string
  email: string | null
  googleMapsUrl: string
  woltUrl: string | null
  boltFoodUrl: string | null
  instagramUrl: string | null
  facebookUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface OpeningStatus {
  openNow: boolean
  closedToday: boolean
  localDate: string
  localTime: string
  timeZone: string
  source: 'WEEKLY' | 'SPECIAL'
  openingTime: string | null
  closingTime: string | null
}

interface HoursRule {
  open: boolean
  openingTime: string | null
  closingTime: string | null
}

export interface WeeklyHours extends HoursRule {
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
}

export interface SpecialHours extends HoursRule {
  date: string
}

export interface OpeningHours {
  timeZone: string
  weekly: WeeklyHours[]
  specialDates: SpecialHours[]
}

export interface MenuItem {
  id: number
  name: string
  description: string
  priceEur: number
  available: boolean
  featured: boolean
  imageUrl: string | null
}

export interface MenuCategory {
  id: number
  name: string
  items: MenuItem[]
}

export interface PublicMenu {
  categories: MenuCategory[]
}

export interface Promotion {
  id: number
  title: string
  description: string | null
  startsAt: string | null
  endsAt: string | null
}

export interface PublicPromotions {
  timeZone: string
  promotions: Promotion[]
}
