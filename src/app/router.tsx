import { createBrowserRouter, Navigate } from 'react-router'
import { PublicLocaleLayout, PublicNotFound } from './PublicLocaleLayout'
import { AdminGate } from '../features/admin/AdminApp'
import { OverviewPage } from '../features/admin/OverviewPage'
import { RestaurantPage } from '../features/admin/RestaurantPage'
import { HoursPage } from '../features/admin/HoursPage'
import { MenuPage } from '../features/admin/MenuPage'
import { LunchMenuPage } from '../features/admin/LunchMenuPage'
import { PromotionsPage } from '../features/admin/PromotionsPage'
import { PrivacyPage, BusinessPage } from '../features/public/LegalPages'
import { PublicHome } from '../features/public/PublicHome'
import { PublicRouteError } from '../features/public/PublicRouteError'

export const router = createBrowserRouter([
  { path: '/studio', lazy: () => import('../features/studio/StudioPage'), hydrateFallbackElement: <div role="status" aria-label="Loading Idiomorph Studio" style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', background: '#08070b', color: '#b5adbe', fontSize: '10px', letterSpacing: '.18em' }}>IDIOMORPH STUDIO</div> },
  { path: '/', element: <Navigate to="/lt" replace /> },
  { path: '/:lang', Component: PublicLocaleLayout, ErrorBoundary: PublicRouteError, children: [
    { index: true, Component: PublicHome },
    { path: 'privacy', Component: PrivacyPage },
    { path: 'legal', Component: BusinessPage },
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
      { path: 'lunch-menu', Component: LunchMenuPage },
      { path: 'promotions', Component: PromotionsPage },
    ],
  },
])
