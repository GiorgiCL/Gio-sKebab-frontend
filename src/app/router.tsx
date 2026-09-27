import { createBrowserRouter, Navigate } from 'react-router'
import { PublicLocaleLayout, PublicNotFound } from './PublicLocaleLayout'
import { AdminGate } from '../features/admin/AdminApp'
import { OverviewPage } from '../features/admin/OverviewPage'
import { RestaurantPage } from '../features/admin/RestaurantPage'
import { HoursPage } from '../features/admin/HoursPage'
import { MenuPage } from '../features/admin/MenuPage'
import { PromotionsPage } from '../features/admin/PromotionsPage'
import { PublicHome } from '../features/public/PublicHome'
import { PublicRouteError } from '../features/public/PublicRouteError'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/lt" replace /> },
  { path: '/:lang', Component: PublicLocaleLayout, ErrorBoundary: PublicRouteError, children: [
    { index: true, Component: PublicHome },
    { path: '*', Component: PublicNotFound },
  ] },
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
