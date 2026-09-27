import { intlLocales, type PublicLocale } from '../../lib/i18n/locales'
import { publicText } from './text'
import type { OpeningHours, OpeningStatus, Restaurant } from './types'

export function formatPrice(value: number, locale: PublicLocale): string {
  return new Intl.NumberFormat(intlLocales[locale], { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(value)
}

export function formatTime(value: string | null): string { return value?.slice(0, 5) ?? '' }

export function formatLocalDate(value: string, locale: PublicLocale): string {
  return new Intl.DateTimeFormat(intlLocales[locale], { day: 'numeric', month: 'short', timeZone: 'UTC' })
    .format(new Date(`${value.slice(0, 10)}T12:00:00Z`))
}

export function openingStatusText(status: OpeningStatus, locale: PublicLocale, hours?: OpeningHours): string {
  const t = publicText[locale]
  if (status.openNow) return status.closingTime ? `${t.openNow} · ${t.until} ${formatTime(status.closingTime)}` : t.openNow
  if (status.openingTime && status.localTime < status.openingTime) return `${t.opensToday} ${formatTime(status.openingTime)}`
  if (hours) {
    const date = new Date(`${status.localDate}T12:00:00Z`)
    const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
    for (let offset = 1; offset <= 30; offset += 1) {
      date.setUTCDate(date.getUTCDate() + 1)
      const dateKey = date.toISOString().slice(0, 10)
      const rule = hours.specialDates.find(special => special.date === dateKey) ??
        hours.weekly.find(weekly => weekly.dayOfWeek === weekdays[date.getUTCDay()])
      if (rule?.open && rule.openingTime) {
        const day = offset === 1 ? t.tomorrow : t.weekdays[date.getUTCDay()]
        return `${t.closedNow} · ${t.opens} ${day} ${formatTime(rule.openingTime)}`
      }
    }
  }
  return status.closedToday ? t.closedToday : t.closedForToday
}

export function deliveryLinks(restaurant: Restaurant | undefined) {
  if (!restaurant) return []
  // Owner-provided destination until boltFoodUrl is populated in the public profile.
  // The API value always takes precedence; no backend or database change is needed here.
  const boltFoodUrl = restaurant.boltFoodUrl || 'https://food.bolt.eu/en/9-vilnius/p/105108-gios-kebab-savanoriu-av/?utm_source=share_provider&utm_medium=product&utm_content=menu_header'
  return [restaurant.woltUrl ? { label: 'Wolt', url: restaurant.woltUrl } : null,
    { label: 'Bolt Food', url: boltFoodUrl }]
    .filter((link): link is { label: string; url: string } => link !== null)
}
