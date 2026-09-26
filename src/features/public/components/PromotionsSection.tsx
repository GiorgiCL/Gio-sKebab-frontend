import { formatLocalDate, formatTime } from '../format'
import type { PublicPromotions } from '../types'
import type { Resource } from '../usePublicResource'

export function PromotionsSection({ resource }: { resource: Resource<PublicPromotions> }) {
  if (resource.kind === 'success' && resource.data.promotions.length === 0) return null

  return (
    <section className="offers-section" aria-labelledby="offers-title">
      <div className="layout-wrap offers-inner">
        <div className="offers-heading">
          <p className="eyebrow"><span className="index-line" /> 02 / Good to know</p>
          <h2 id="offers-title">On the <em>board.</em></h2>
        </div>
        {resource.kind === 'loading' && <p className="offers-state" role="status">Checking what's on the board…</p>}
        {resource.kind === 'error' && (
          <div className="offers-state">
            <p>Current updates are unavailable.</p>
            <button className="inline-action" type="button" onClick={resource.retry}>Try again <span aria-hidden="true">↗</span></button>
          </div>
        )}
        {resource.kind === 'success' && (
          <div className="offers-list">
            {resource.data.promotions.map((promotion, index) => (
              <article className="offer" key={promotion.id}>
                <span className="offer-number">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{promotion.title}</h3>
                  {promotion.description && <p>{promotion.description}</p>}
                  {promotion.endsAt && <span className="offer-end">Ends {formatLocalDate(promotion.endsAt)} at {formatTime(promotion.endsAt.slice(11))} local time</span>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
