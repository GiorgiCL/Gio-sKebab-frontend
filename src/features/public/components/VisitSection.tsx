import type { PublicLocale } from '../../../lib/i18n/locales'
import { deliveryLinks, formatLocalDate, formatTime } from '../format'
import { publicText } from '../text'
import { lunchText } from '../lunchText'
import type { OpeningHours, OpeningStatus, Restaurant } from '../types'
import type { Resource } from '../usePublicResource'
import { DeliveryProviderBrand, ReviewIcon } from './ServiceIcons'

const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

export function VisitSection({ locale, restaurant, openingHours, openingStatus }: { locale: PublicLocale; restaurant: Resource<Restaurant>; openingHours: Resource<OpeningHours>; openingStatus: Resource<OpeningStatus> }) {
  const t = publicText[locale]
  const georgianOrderWords = locale === 'ka' ? t.orderDelivery.split(' ') : null
  const profile = restaurant.kind === 'success' ? restaurant.data : undefined
  const orderLinks = deliveryLinks(profile)
  const todayDay = openingStatus.kind === 'success' && openingStatus.data.source === 'WEEKLY'
    ? weekdays[new Date(`${openingStatus.data.localDate}T12:00:00Z`).getUTCDay()] : null
  return <section className="visit-section" id="visit" aria-labelledby="visit-title" tabIndex={-1}><div className="layout-wrap">
    <div className="visit-top"><div className="visit-heading"><h2 id="visit-title">{t.visitTitle}</h2></div>
      <div className="visit-contact"><p className="detail-label">{t.place}</p>
        {restaurant.kind === 'loading' && <p className="visit-state" role="status">{t.visitLoading}</p>}
        {restaurant.kind === 'error' && <div className="visit-state"><p>{restaurant.status === 404 ? t.visitPreparing : t.visitUnavailable}</p>{restaurant.status !== 404 && <button type="button" className="inline-action dark" onClick={restaurant.retry}>{t.tryAgain} <span aria-hidden="true">↗</span></button>}</div>}
        {profile && <><address>{profile.address}</address><div className="visit-actions"><a className="visit-direction" href={profile.googleMapsUrl} target="_blank" rel="noopener noreferrer">{t.directions} <span aria-hidden="true">↗</span><span className="sr-only"> ({t.newTab})</span></a>
          <a className="visit-review" href={profile.googleMapsUrl} target="_blank" rel="noopener noreferrer"><ReviewIcon /> {t.reviewOnGoogle} <span aria-hidden="true">↗</span><span className="sr-only"> ({t.newTab})</span></a>
          <a className="visit-call" href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`} aria-label={lunchText[locale].call}><span aria-hidden="true">☎</span><span>{lunchText[locale].call}</span></a></div>
          {profile.email && <div className="visit-contact-links"><a href={`mailto:${profile.email}`}>{profile.email}</a></div>}</>}
      </div></div>
    <div className="hours-block"><div className="hours-heading"><h3>{t.openingHours}</h3></div>
      <div className="hours-content">
        {openingHours.kind === 'loading' && <p className="hours-state" role="status">{t.hoursLoading}</p>}
        {openingHours.kind === 'error' && <div className="hours-state"><p>{openingHours.status === 503 || openingHours.status === 404 ? t.hoursUpdating : t.hoursUnavailable}</p>{openingHours.status !== 404 && openingHours.status !== 503 && <button type="button" className="inline-action dark" onClick={openingHours.retry}>{t.tryAgain} <span aria-hidden="true">↗</span></button>}</div>}
        {openingHours.kind === 'success' && <><dl className="hours-list">{openingHours.data.weekly.map(rule => <div className={`hours-row${rule.dayOfWeek === todayDay ? ' is-today' : ''}`} key={rule.dayOfWeek} aria-current={rule.dayOfWeek === todayDay ? 'date' : undefined}><dt>{t.weekdayLabels[weekdays.indexOf(rule.dayOfWeek)]}</dt><dd>{rule.open ? `${formatTime(rule.openingTime)}–${formatTime(rule.closingTime)}` : t.closed}</dd></div>)}</dl>
          {openingHours.data.specialDates.length > 0 && <div className="special-hours"><p className="detail-label">{t.upcoming}</p><dl className="hours-list">{openingHours.data.specialDates.map(rule => <div className="hours-row" key={rule.date}><dt>{formatLocalDate(rule.date, locale)}</dt><dd>{rule.open ? `${formatTime(rule.openingTime)}–${formatTime(rule.closingTime)}` : t.closed}</dd></div>)}</dl></div>}
        </>}
      </div></div>
    {orderLinks.length > 0 && <div className="order-block" id="order" tabIndex={-1} aria-labelledby="order-title"><h3 id="order-title" aria-label={georgianOrderWords ? t.orderDelivery : undefined}>{georgianOrderWords ? <>{georgianOrderWords[0]}<br />{georgianOrderWords.slice(1).join(' ')}</> : t.orderDelivery}</h3><div className="order-links">{orderLinks.map(link => <a href={link.url} key={link.label} target="_blank" rel="noopener noreferrer"><DeliveryProviderBrand service={link.label} /> <span aria-hidden="true">↗</span><span className="sr-only">{t.newTab}</span></a>)}</div></div>}
  </div></section>
}
