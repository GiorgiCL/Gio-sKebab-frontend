import { createBrowserRouter } from 'react-router'
import { AdminGate } from '../features/admin/AdminApp'
import { OverviewPage } from '../features/admin/OverviewPage'
import { RestaurantPage } from '../features/admin/RestaurantPage'
import { HoursPage } from '../features/admin/HoursPage'
import { MenuPage } from '../features/admin/MenuPage'
import { PromotionsPage } from '../features/admin/PromotionsPage'
import { PublicHome } from '../features/public/PublicHome'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: PublicHome,
  },
  {
    path: '/admin', Component: AdminGate,
    children: [
      { index: true, Component: OverviewPage },
      { path: 'login', Component: OverviewPage },
      { path: 'restaurant', Component: RestaurantPage },
      { path: 'hours', Component: HoursPage },
      { path: 'menu', Component: MenuPage },
      { path: 'promotions', Component: PromotionsPage },
    ],
  },
])
