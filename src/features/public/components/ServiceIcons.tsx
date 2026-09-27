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

export function InstagramIcon() {
  return <svg className="service-icon instagram-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="17.6" cy="6.5" r="1.15" fill="currentColor" />
  </svg>
}
