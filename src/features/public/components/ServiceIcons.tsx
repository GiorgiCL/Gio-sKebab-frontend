export function DeliveryServiceIcon({ service }: { service: string }) {
  if (service === 'Bolt Food') return <svg className="service-icon service-icon-bolt" aria-hidden="true" viewBox="0 0 32 32" fill="none">
    <path d="M18 2 7 18h8l-2 12 12-18h-8l1-10Z" fill="currentColor" />
  </svg>
  return <svg className={`service-icon${service === 'Wolt' ? ' service-icon-wolt' : ''}`} aria-hidden="true" viewBox="0 0 32 32" fill="none">
    <path d="M7 12h18l-1.5 15h-15L7 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 13V9a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 18h8M12 21h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
}

export function ReviewIcon() {
  return <svg className="service-icon review-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <path d="m12 2.5 2.8 6.1 6.7.8-4.9 4.7 1.3 6.7L12 17.5l-5.9 3.3 1.3-6.7-4.9-4.7 6.7-.8L12 2.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
}

export function InstagramIcon() {
  return <svg className="service-icon instagram-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="17.6" cy="6.5" r="1.15" fill="currentColor" />
  </svg>
}
