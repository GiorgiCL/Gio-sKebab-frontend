import type { OpeningHours, OpeningStatus, Restaurant } from './types'

const euroFormatter = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
})

export function formatPrice(value: number): string {
  return euroFormatter.format(value)
}

export function formatTime(value: string | null): string {
  return value?.slice(0, 5) ?? ''
}

export function formatLocalDate(value: string): string {
  return dateFormatter.format(new Date(`${value.slice(0, 10)}T12:00:00Z`))
}

export function openingStatusText(status: OpeningStatus, hours?: OpeningHours): string {
  if (status.openNow) {
    return status.closingTime ? `Open now · until ${formatTime(status.closingTime)}` : 'Open now'
  }
  if (status.openingTime && status.localTime < status.openingTime) {
    return `Opens today at ${formatTime(status.openingTime)}`
  }

  if (hours) {
    const date = new Date(`${status.localDate}T12:00:00Z`)
    const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
    const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    for (let offset = 1; offset <= 30; offset += 1) {
      date.setUTCDate(date.getUTCDate() + 1)
      const dateKey = date.toISOString().slice(0, 10)
      const rule = hours.specialDates.find((special) => special.date === dateKey) ??
        hours.weekly.find((weekly) => weekly.dayOfWeek === weekdays[date.getUTCDay()])
      if (rule?.open && rule.openingTime) {
        const day = offset === 1 ? 'tomorrow' : weekdayNames[date.getUTCDay()]
        return `Closed now · opens ${day} at ${formatTime(rule.openingTime)}`
      }
    }
  }

  return status.closedToday ? 'Closed today' : 'Closed for today'
}

export function deliveryLinks(restaurant: Restaurant | undefined) {
  if (!restaurant) return []
  return [
    restaurant.woltUrl ? { label: 'Wolt', url: restaurant.woltUrl } : null,
    restaurant.boltFoodUrl ? { label: 'Bolt Food', url: restaurant.boltFoodUrl } : null,
  ].filter((link): link is { label: string; url: string } => link !== null)
}
