import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { PublicLocale } from '../../../lib/i18n/locales'
import { capturePublicEvent } from '../../../lib/analytics'
import { formatPrice } from '../format'
import { lunchText } from '../lunchText'
import { publicText } from '../text'
import type { OpeningHours, OpeningStatus, PublicLunchMenu, Weekday } from '../types'
import type { Resource } from '../usePublicResource'
import { ProductDialog } from './ProductDialog'
import { MenuThumbnail } from './MenuThumbnail'

const days: Weekday[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

function restaurantToday(status: Resource<OpeningStatus>, hours: Resource<OpeningHours>): Weekday {
  if (status.kind === 'success') {
    const date = new Date(`${status.data.localDate}T12:00:00Z`)
    return days[(date.getUTCDay() + 6) % 7]
  }
  const timeZone = hours.kind === 'success' ? hours.data.timeZone : 'Europe/Vilnius'
  const name = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone }).format(new Date()).toUpperCase()
  return days.find(day => day === name) ?? 'MONDAY'
}

export function LunchSection({ locale, resource, openingStatus, openingHours }: {
  locale: PublicLocale; resource: Resource<PublicLunchMenu>; openingStatus: Resource<OpeningStatus>; openingHours: Resource<OpeningHours>
}) {
  const t = lunchText[locale]
  const common = publicText[locale]
  const today = restaurantToday(openingStatus, openingHours)
  const [chosenDay, setChosenDay] = useState<Weekday | null>(null)
  const selectedDay = chosenDay ?? today
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const tabStrip = useRef<HTMLDivElement>(null)
  const publicDays = resource.kind === 'success' ? resource.data.days : []
  useEffect(() => {
    const strip = tabStrip.current
    const tab = tabs.current[days.indexOf(selectedDay)]
    if (strip && tab) strip.scrollTo({ left: tab.offsetLeft - strip.offsetLeft - strip.clientWidth / 2 + tab.clientWidth / 2, behavior: 'instant' })
  }, [selectedDay, resource.kind])
  if (resource.kind === 'success' && !publicDays.some(day => day.items.length)) return null
  const items = publicDays.find(day => day.dayOfWeek === selectedDay)?.items ?? []
  const selectedItem = publicDays.flatMap(day => day.items).find(item => item.id === selectedId)
  const label = (day: Weekday) => common.weekdayLabels[(days.indexOf(day) + 1) % 7]
  const selectDay = (day: Weekday) => {
    if (day !== selectedDay) capturePublicEvent('lunch_day_selected', { weekday: day, locale })
    setChosenDay(day)
  }
  const handleKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = days.indexOf(selectedDay)
    const next = event.key === 'ArrowRight' ? (current + 1) % 7 : event.key === 'ArrowLeft' ? (current + 6) % 7 : event.key === 'Home' ? 0 : event.key === 'End' ? 6 : -1
    if (next >= 0) { event.preventDefault(); selectDay(days[next]); tabs.current[next]?.focus() }
  }
  return <section className="lunch-section" id="lunch" aria-labelledby="lunch-title" tabIndex={-1}>
    <div className="layout-wrap">
      <div className="lunch-heading"><div><p className="eyebrow">Gio's Kebab / {t.nav}</p><h2 id="lunch-title">{t.title}</h2></div><p>{t.intro}</p></div>
      {resource.kind === 'loading' && <p role="status">{common.menuLoading}</p>}
      {resource.kind === 'error' && <div className="content-message"><p>{t.error}</p><button type="button" className="inline-action" onClick={resource.retry}>{t.retry}</button></div>}
      {resource.kind === 'success' && <>
        <div className="lunch-tabs" role="tablist" aria-label={t.title} onKeyDown={handleKeys} ref={tabStrip}>
          {days.map((day, index) => <button key={day} ref={node => { tabs.current[index] = node }} type="button" role="tab"
            id={`lunch-tab-${day}`} aria-controls="lunch-panel" aria-selected={selectedDay === day} tabIndex={selectedDay === day ? 0 : -1}
            onClick={() => selectDay(day)}>{label(day)}{today === day && <small>{t.today}</small>}</button>)}
        </div>
        <div id="lunch-panel" className="lunch-panel" role="tabpanel" aria-labelledby={`lunch-tab-${selectedDay}`} tabIndex={0}>
          {items.length === 0 ? <p className="lunch-empty">{t.empty}</p> : items.map(item =>
            <article className={`menu-row${item.available ? '' : ' is-sold-out'}`} key={item.id}><button type="button" className="menu-row-trigger" data-lunch-item-id={item.id} onClick={event => {
              capturePublicEvent('product_opened', { product_id: item.id, product_name: item.name, category_key: 'lunch', category_name: t.title, source: 'lunch', locale })
              trigger.current = event.currentTarget; setSelectedId(item.id)
            }}>
              <span className="menu-row-info"><span className="menu-row-title-line"><span className="sr-only">{common.viewDetails}: </span><span className="menu-row-name">{item.name}</span>{!item.available && <span className="sold-out">{common.soldOut}</span>}</span>{item.description && <span className="menu-row-description">{item.description}</span>}<span className="menu-row-price">{formatPrice(item.priceEur, locale)}</span></span>
              <MenuThumbnail imageUrl={item.imageUrl} />
            </button></article>)}
        </div>
      </>}
    </div>
    {selectedId !== null && <ProductDialog locale={locale} itemId={selectedId} item={selectedItem} categoryName={t.title} imageKind="lunch" loading={resource.kind === 'loading'} returnFocus={trigger} onClose={() => setSelectedId(null)} />}
  </section>
}
