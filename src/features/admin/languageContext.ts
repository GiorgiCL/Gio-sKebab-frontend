import { createContext, useContext } from 'react'
import type { AdminLocale } from '../../lib/i18n/locales'
import { adminText } from './text'

export interface AdminLanguageState { locale: AdminLocale; setLocale: (locale: AdminLocale) => void; t: typeof adminText[AdminLocale] }
export const AdminLanguageContext = createContext<AdminLanguageState | null>(null)
export function useAdminLanguage() {
  const state = useContext(AdminLanguageContext)
  if (!state) throw new Error('Admin language context missing')
  return state
}
