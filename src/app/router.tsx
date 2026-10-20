import { createBrowserRouter, Navigate } from 'react-router'
import { PublicLocaleLayout, PublicNotFound, PublicRouteLoading } from './PublicLocaleLayout'
import { OwnerRouteError } from './OwnerRouteError'
import { PublicHome } from '../features/public/PublicHome'
import { PublicRouteError } from '../features/public/PublicRouteError'

const ownerPage = (name: keyof typeof import('../features/admin/routeModules')) => async () => {
  const pages = await import('../features/admin/routeModules')
  return { Component: pages[name] }
}

export const router = createBrowserRouter([
  { path: '/studio', lazy: () => import('../features/studio/StudioPage'), hydrateFallbackElement: <div role="status" aria-label="Loading Idiomorph Studio" style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', background: '#08070b', color: '#b5adbe', fontSize: '10px', letterSpacing: '.18em' }}>IDIOMORPH STUDIO</div> },
  { path: '/', element: <Navigate to="/lt" replace /> },
  { path: '/:lang', Component: PublicLocaleLayout, ErrorBoundary: PublicRouteError, hydrateFallbackElement: <PublicRouteLoading />, children: [
    { index: true, Component: PublicHome },
    { path: 'privacy', lazy: async () => ({ Component: (await import('../features/public/LegalPages')).PrivacyPage }) },
    { path: 'legal', lazy: async () => ({ Component: (await import('../features/public/LegalPages')).BusinessPage }) },
    { path: '*', Component: PublicNotFound },
  ] },
  {
    path: '/admin', lazy: ownerPage('AdminGate'), ErrorBoundary: OwnerRouteError,
    hydrateFallbackElement: <main lang="en" style={{ minHeight: '100svh', padding: '48px 24px' }}><p role="status">Loading owner workspace…</p></main>,
    children: [
      { index: true, lazy: ownerPage('OverviewPage') },
      { path: 'login', lazy: ownerPage('OverviewPage') },
      { path: 'restaurant', lazy: ownerPage('RestaurantPage') },
      { path: 'hours', lazy: ownerPage('HoursPage') },
      { path: 'menu', lazy: ownerPage('MenuPage') },
      { path: 'lunch-menu', lazy: ownerPage('LunchMenuPage') },
      { path: 'promotions', lazy: ownerPage('PromotionsPage') },
    ],
  },
])
