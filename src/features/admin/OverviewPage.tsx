import { Link } from 'react-router'
import { adminRequest, ApiError } from './api'
import { useLoad } from './hooks'
import { LoadError, Loading, PageHeading } from './shared'
import type { Category, Item, Promotion, RestaurantProfile, SpecialDate, WeeklyDay } from './types'

export function OverviewPage() {
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
    { to: '/admin/restaurant', title: 'Restaurant', status: data.profile ? data.profile.displayName : 'Needs setup', detail: 'Name, address, contact and links' },
    { to: '/admin/hours', title: 'Hours', status: `${data.weekly.length}/7 weekly days · ${data.special.length} special dates`, detail: 'Normal week and date overrides' },
    { to: '/admin/menu', title: 'Menu', status: `${data.categories.length} categories · ${data.items.length} items`, detail: 'Categories, prices and availability' },
    { to: '/admin/promotions', title: 'Promotions', status: `${data.promotions.length} saved`, detail: 'Offers and announcements' },
  ]
  return <><PageHeading kicker="Owner workspace" title="Overview" description="Everything your customers see starts here." /><div className="admin-overview-intro"><p>{data.profile && data.weekly.length === 7 ? 'Your restaurant details and weekly hours are set. Keep your menu and offers current as things change.' : 'Start with your restaurant details and a complete weekly schedule, then add your menu.'}</p><Link to="/" target="_blank" rel="noopener noreferrer">View public site ↗</Link></div><div className="admin-overview-list">{links.map(link => <Link key={link.to} to={link.to}><div><h2>{link.title}</h2><p>{link.detail}</p></div><span>{link.status}</span><b aria-hidden="true">↗</b></Link>)}</div></>
}
