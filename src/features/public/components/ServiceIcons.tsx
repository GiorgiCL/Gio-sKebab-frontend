import woltWordmark from '../../../assets/brand/providers/wolt-wordmark.png'

// Official Wolt wordmark from the Wolt Newsroom media kit (bundled locally).
export function DeliveryProviderBrand({ service, compact = false }: { service: string; compact?: boolean }) {
  const isWolt = service === 'Wolt'
  return <span className={`provider-brand ${isWolt ? 'provider-brand-wolt' : 'provider-brand-bolt'}${compact ? ' is-compact' : ''}`}>
    {isWolt ? <img src={woltWordmark} alt="Wolt" /> : <span className="provider-brand-name">Bolt Food</span>}
  </span>
}

export function ReviewIcon() {
  return <svg className="service-icon review-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <path d="m12 2.5 2.8 6.1 6.7.8-4.9 4.7 1.3 6.7L12 17.5l-5.9 3.3 1.3-6.7-4.9-4.7 6.7-.8L12 2.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
}

export function DirectionsIcon() {
  return <svg className="service-icon directions-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <path d="M20 10c0 5.2-8 11.5-8 11.5S4 15.2 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.7" />
  </svg>
}

export function PhoneIcon() {
  return <svg className="service-icon phone-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <path d="m7.2 3.5 3 4.1-2 2.1a14 14 0 0 0 6.1 6.1l2.1-2 4.1 3c.5.4.7 1.1.4 1.7l-.9 1.7c-.4.7-1.2 1-2 .8C9.5 19 5 14.5 3 6c-.2-.8.1-1.6.8-2l1.7-.9c.6-.3 1.3-.1 1.7.4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
}

export function InstagramIcon() {
  return <svg className="service-icon instagram-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="17.6" cy="6.5" r="1.15" fill="currentColor" />
  </svg>
}

export function TikTokIcon() {
  return <svg className="service-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.7 2h-3.1v13.5a3.1 3.1 0 1 1-2.7-3.1V9.2a6.3 6.3 0 1 0 5.8 6.3V8.8a7 7 0 0 0 4.2 1.3V7a4 4 0 0 1-4.2-5Z" />
  </svg>
}

export function FacebookIcon() {
  return <svg className="service-icon" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.8 22v-9.1h3.1l.5-3.5h-3.6V7.2c0-1 .3-1.7 1.8-1.7h1.9V2.3c-.3 0-1.5-.1-2.8-.1-2.8 0-4.7 1.7-4.7 4.8v2.4H7v3.5h3V22h3.8Z" />
  </svg>
}
