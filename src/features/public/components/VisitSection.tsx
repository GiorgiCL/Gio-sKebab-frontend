import { deliveryLinks, formatLocalDate, formatTime } from '../format'
import type { OpeningHours, Restaurant } from '../types'
import type { Resource } from '../usePublicResource'

const dayLabels: Record<OpeningHours['weekly'][number]['dayOfWeek'], string> = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
}

export function VisitSection({ restaurant, openingHours }: {
  restaurant: Resource<Restaurant>
  openingHours: Resource<OpeningHours>
}) {
  const profile = restaurant.kind === 'success' ? restaurant.data : undefined
  const orderLinks = deliveryLinks(profile)

  return (
    <section className="visit-section" id="visit" aria-labelledby="visit-title" tabIndex={-1}>
      <div className="layout-wrap">
        <div className="visit-top">
          <div className="visit-heading">
            <p className="eyebrow"><span className="index-line" /> 03 / Come through</p>
            <h2 id="visit-title">Find us.<br /><em>Say hello.</em></h2>
            {profile?.description && <p className="visit-description">{profile.description}</p>}
          </div>
          <div className="visit-contact">
            <p className="detail-label">The place</p>
            {restaurant.kind === 'loading' && <p className="visit-state" role="status">Finding the details…</p>}
            {restaurant.kind === 'error' && (
              <div className="visit-state">
                <p>{restaurant.status === 404 ? 'Visit details are being prepared.' : "We couldn't load the visit details right now."}</p>
                {restaurant.status !== 404 && <button type="button" className="inline-action dark" onClick={restaurant.retry}>Try again <span aria-hidden="true">↗</span></button>}
              </div>
            )}
            {profile && (
              <>
                <address>{profile.address}</address>
                <a className="visit-direction" href={profile.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                  Get directions <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
                </a>
                <div className="visit-contact-links">
                  <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}>{profile.phone}</a>
                  {profile.email && <a href={`mailto:${profile.email}`}>{profile.email}</a>}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="hours-block">
          <div className="hours-heading">
            <p className="detail-label">When to drop by</p>
            <h3>Opening hours</h3>
            {openingHours.kind === 'success' && <p>Times shown for the restaurant's local time zone.</p>}
          </div>
          <div className="hours-content">
            {openingHours.kind === 'loading' && <p className="hours-state" role="status">Checking opening hours…</p>}
            {openingHours.kind === 'error' && (
              <div className="hours-state">
                <p>{openingHours.status === 503 || openingHours.status === 404 ? 'Opening hours are being updated.' : "We couldn't load the opening hours right now."}</p>
                {openingHours.status !== 404 && openingHours.status !== 503 && <button type="button" className="inline-action dark" onClick={openingHours.retry}>Try again <span aria-hidden="true">↗</span></button>}
              </div>
            )}
            {openingHours.kind === 'success' && (
              <>
                <dl className="hours-list">
                  {openingHours.data.weekly.map((rule) => (
                    <div className="hours-row" key={rule.dayOfWeek}>
                      <dt>{dayLabels[rule.dayOfWeek]}</dt>
                      <dd>{rule.open ? `${formatTime(rule.openingTime)}–${formatTime(rule.closingTime)}` : 'Closed'}</dd>
                    </div>
                  ))}
                </dl>
                {openingHours.data.specialDates.length > 0 && (
                  <div className="special-hours">
                    <p className="detail-label">Upcoming changes</p>
                    <dl className="hours-list">
                      {openingHours.data.specialDates.map((rule) => (
                        <div className="hours-row" key={rule.date}>
                          <dt>{formatLocalDate(rule.date)}</dt>
                          <dd>{rule.open ? `${formatTime(rule.openingTime)}–${formatTime(rule.closingTime)}` : 'Closed'}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {orderLinks.length > 0 && (
          <div className="order-block" id="order" tabIndex={-1}>
            <div>
              <p className="detail-label">A little closer to home</p>
              <h3>Take Gio's with you.</h3>
            </div>
            <div className="order-links">
              {orderLinks.map((link) => (
                <a href={link.url} key={link.label} target="_blank" rel="noopener noreferrer">
                  Order on {link.label} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
