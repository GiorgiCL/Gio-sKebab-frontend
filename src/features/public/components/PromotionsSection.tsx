import type { PublicLocale } from '../../../lib/i18n/locales'
import { formatLocalDate, formatTime } from '../format'
import { publicText } from '../text'
import type { PublicPromotions } from '../types'
import type { Resource } from '../usePublicResource'

export function PromotionsSection({ locale, resource }: { locale: PublicLocale; resource: Resource<PublicPromotions> }) {
  const t = publicText[locale]
  if (resource.kind === 'success' && resource.data.promotions.length === 0) return null
  return <section className="offers-section" aria-labelledby="offers-title"><div className="layout-wrap offers-inner">
    <div className="offers-heading"><p className="eyebrow"><span className="index-line" /> {t.offersIndex}</p><h2 id="offers-title">{t.offersTitle} <em>{t.offersAccent}</em></h2></div>
    {resource.kind === 'loading' && <p className="offers-state" role="status">{t.offersLoading}</p>}
    {resource.kind === 'error' && <div className="offers-state"><p>{t.offersUnavailable}</p><button className="inline-action" type="button" onClick={resource.retry}>{t.tryAgain} <span aria-hidden="true">↗</span></button></div>}
    {resource.kind === 'success' && <div className="offers-list">{resource.data.promotions.map((promotion, index) => <article className="offer" key={promotion.id}>
      <span className="offer-number">{String(index + 1).padStart(2, '0')}</span><div><h3>{promotion.title}</h3>{promotion.description && <p>{promotion.description}</p>}
        {promotion.endsAt && <span className="offer-end">{t.ends} {formatLocalDate(promotion.endsAt, locale)} {t.at} {formatTime(promotion.endsAt.slice(11))} {t.localTime}</span>}</div>
    </article>)}</div>}
  </div></section>
}
