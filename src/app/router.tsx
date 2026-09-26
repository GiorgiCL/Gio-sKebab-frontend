import { createBrowserRouter } from 'react-router'
import { AdminPlaceholder } from '../features/admin/AdminPlaceholder'
import { PublicPlaceholder } from '../features/public/PublicPlaceholder'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: PublicPlaceholder,
  },
  {
    path: '/admin',
    Component: AdminPlaceholder,
  },
])
