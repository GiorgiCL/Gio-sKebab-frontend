import { createContext, useContext } from 'react'
import type { Owner } from './types'

export const AuthContext = createContext<{ owner: Owner; signOut: () => Promise<void> } | null>(null)
export function useOwner() { const value = useContext(AuthContext); if (!value) throw new Error('Owner context missing'); return value }
