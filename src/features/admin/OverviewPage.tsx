import { Link } from 'react-router'
import { adminRequest, ApiError } from './api'
import { useLoad } from './hooks'
import { useAdminLanguage } from './languageContext'
import { LoadError, Loading, PageHeading } from './shared'
import type { Category, Item, Promotion, RestaurantProfile, SpecialDate, WeeklyDay } from './types'

export function OverviewPage() {
  const { t } = useAdminLanguage()
  const resource = useLoad(async () => {
    const [profile, weekly, special, categories, items, promotions] = await Promise.all([
      adminRequest<RestaurantProfile>('/api/admin/restaurant').catch(error => { if (error instanceof ApiError && error.status === 404) return null; throw error }),
      adminRequest<WeeklyDay[]>('/api/admin/opening-hours/weekly'),
      adminRequest<SpecialDate[]>('/api/admin/opening-hours/special-dates'),
      adminRequest<Category[]>('/api/admin/menu/categories'),
      adminRequest<Item[]>('/api/admin/menu/items'),
      adminRequest<Promotion[]>('/api/admin/promotions'),
    ])
    return { profile, weekly, special, categories, items, promotions }
  })
  if (resource.loading) return <Loading />
  if (resource.error) return <LoadError error={resource.error} retry={resource.refresh} />
  const data = resource.data!
  const links = [
    { to: '/admin/restaurant', title: t.restaurant, status: data.profile ? data.profile.displayName : t.needsSetup, detail: t.restaurantSummary },
    { to: '/admin/hours', title: t.hours, status: `${data.weekly.length}/7 ${t.weeklyDays} · ${data.special.length} ${t.specialDatesCount}`, detail: t.hoursSummary },
    { to: '/admin/menu', title: t.menu, status: `${data.categories.length} ${t.categoriesCount} · ${data.items.length} ${t.itemsCount}`, detail: t.menuSummary },
    { to: '/admin/promotions', title: t.promotions, status: `${t.activeCount}: ${data.promotions.filter(row => row.active).length} · ${t.savedCount}: ${data.promotions.length}`, detail: t.promotionsSummary },
  ]
  return <><PageHeading kicker={t.ownerWorkspace} title={t.overview} description={t.overviewDescription} />
    <div className="admin-overview-intro"><p>{data.profile && data.weekly.length === 7 ? t.overviewReady : t.overviewSetup}</p><Link to="/lt" target="_blank" rel="noopener noreferrer">{t.viewSite} ↗</Link></div>
    <div className="admin-overview-list">{links.map(link => <Link key={link.to} to={link.to}><div><h2>{link.title}</h2><p>{link.detail}</p></div><span>{link.status}</span><b aria-hidden="true">↗</b></Link>)}</div>
  </>
}
