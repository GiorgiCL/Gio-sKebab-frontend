type Destination = 'overview' | 'restaurant' | 'hours' | 'menu' | 'lunch' | 'promotions'

const paths: Record<Destination, string> = {
  overview: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  restaurant: 'M3 10h18L19 3H5z M5 10v11h14V10 M9 21v-7h6v7',
  hours: 'M12 8v5l3 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  menu: 'M4 3h6v18H4z M14 3h6v18h-6z M7 7v6 M17 7v6',
  lunch: 'M3 12h18 M5 12a7 7 0 0 1 14 0 M12 3v2 M3 16h18 M7 20h10',
  promotions: 'M3 3h8l10 10-8 8L3 11z M7 7h.01',
}

export function AdminNavIcon({ destination }: { destination: Destination }) {
  return <svg className="admin-nav-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={paths[destination]} /></svg>
}
