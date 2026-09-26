import type { PublicLocale } from '../../../lib/i18n/locales'
import { deliveryLinks, formatLocalDate, formatTime } from '../format'
import { publicText } from '../text'
import type { OpeningHours, Restaurant } from '../types'
import type { Resource } from '../usePublicResource'

const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

export function VisitSection({ locale, restaurant, openingHours }: { locale: PublicLocale; restaurant: Resource<Restaurant>; openingHours: Resource<OpeningHours> }) {
  const t = publicText[locale]
  const profile = restaurant.kind === 'success' ? restaurant.data : undefined
  const orderLinks = deliveryLinks(profile)
  return <section className="visit-section" id="visit" aria-labelledby="visit-title" tabIndex={-1}><div className="layout-wrap">
    <div className="visit-top"><div className="visit-heading"><p className="eyebrow"><span className="index-line" /> {t.visitIndex}</p><h2 id="visit-title">{t.visitTitle}<br /><em>{t.visitAccent}</em></h2>{profile?.description && <p className="visit-description">{profile.description}</p>}</div>
      <div className="visit-contact"><p className="detail-label">{t.place}</p>
        {restaurant.kind === 'loading' && <p className="visit-state" role="status">{t.visitLoading}</p>}
        {restaurant.kind === 'error' && <div className="visit-state"><p>{restaurant.status === 404 ? t.visitPreparing : t.visitUnavailable}</p>{restaurant.status !== 404 && <button type="button" className="inline-action dark" onClick={restaurant.retry}>{t.tryAgain} <span aria-hidden="true">↗</span></button>}</div>}
        {profile && <><address>{profile.address}</address><a className="visit-direction" href={profile.googleMapsUrl} target="_blank" rel="noopener noreferrer">{t.directions} <span aria-hidden="true">↗</span><span className="sr-only"> ({t.newTab})</span></a>
          <div className="visit-contact-links"><a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}>{profile.phone}</a>{profile.email && <a href={`mailto:${profile.email}`}>{profile.email}</a>}</div></>}
      </div></div>
    <div className="hours-block"><div className="hours-heading"><p className="detail-label">{t.when}</p><h3>{t.openingHours}</h3>{openingHours.kind === 'success' && <p>{t.timezoneHint}</p>}</div>
      <div className="hours-content">
        {openingHours.kind === 'loading' && <p className="hours-state" role="status">{t.hoursLoading}</p>}
        {openingHours.kind === 'error' && <div className="hours-state"><p>{openingHours.status === 503 || openingHours.status === 404 ? t.hoursUpdating : t.hoursUnavailable}</p>{openingHours.status !== 404 && openingHours.status !== 503 && <button type="button" className="inline-action dark" onClick={openingHours.retry}>{t.tryAgain} <span aria-hidden="true">↗</span></button>}</div>}
        {openingHours.kind === 'success' && <><dl className="hours-list">{openingHours.data.weekly.map(rule => <div className="hours-row" key={rule.dayOfWeek}><dt>{t.weekdayLabels[weekdays.indexOf(rule.dayOfWeek)]}</dt><dd>{rule.open ? `${formatTime(rule.openingTime)}–${formatTime(rule.closingTime)}` : t.closed}</dd></div>)}</dl>
          {openingHours.data.specialDates.length > 0 && <div className="special-hours"><p className="detail-label">{t.upcoming}</p><dl className="hours-list">{openingHours.data.specialDates.map(rule => <div className="hours-row" key={rule.date}><dt>{formatLocalDate(rule.date, locale)}</dt><dd>{rule.open ? `${formatTime(rule.openingTime)}–${formatTime(rule.closingTime)}` : t.closed}</dd></div>)}</dl></div>}
        </>}
      </div></div>
    {orderLinks.length > 0 && <div className="order-block" id="order" tabIndex={-1}><div><p className="detail-label">{t.orderKicker}</p><h3>{t.takeWithYou}</h3></div><div className="order-links">{orderLinks.map(link => <a href={link.url} key={link.label} target="_blank" rel="noopener noreferrer">{t.orderOn} {link.label} <span aria-hidden="true">↗</span><span className="sr-only"> ({t.newTab})</span></a>)}</div></div>}
  </div></section>
}
