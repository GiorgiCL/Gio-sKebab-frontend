import { useCallback, useEffect, useState } from 'react'
import { useBlocker } from 'react-router'
import { message } from './api'
import { readAdminLocale } from '../../lib/i18n/locales'
import { adminText } from './text'

export function useDirtyGuard(dirty: boolean) {
  const blocker = useBlocker(dirty)
  useEffect(() => {
    if (!dirty) return
    const leave = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', leave)
    return () => window.removeEventListener('beforeunload', leave)
  }, [dirty])
  useEffect(() => {
    if (blocker.state === 'blocked') {
      if (window.confirm(adminText[readAdminLocale()].discardPrompt)) blocker.proceed()
      else blocker.reset()
    }
  }, [blocker])
}

export function confirmDiscard(dirty: boolean) { return !dirty || window.confirm(adminText[readAdminLocale()].discardPrompt) }

export function useLoad<T>(load: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadInitial] = useState(() => load)
  const refresh = useCallback(async () => {
    setLoading(true); setError(null)
    try { setData(await loadInitial()) } catch (error) { setError(message(error)) } finally { setLoading(false) }
  }, [loadInitial])
  useEffect(() => {
    let active = true
    loadInitial().then(value => { if (active) setData(value) }).catch(error => { if (active) setError(message(error)) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [loadInitial])
  return { data, setData, loading, error, refresh }
}
