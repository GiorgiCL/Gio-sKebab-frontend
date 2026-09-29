import { useEffect, useState } from 'react'
import { apiRequest } from '../../lib/api/request'
import { reportPublicApiFailure } from '../../lib/analytics'

export type Resource<T> = (
  | { kind: 'loading' }
  | { kind: 'success'; data: T }
  | { kind: 'error'; status: number | null }
) & { retry: () => void }

export function usePublicResource<T>(path: `/${string}`, refreshIntervalMs = 0): Resource<T> {
  const [state, setState] = useState<{
    path: string
    value:
    | { kind: 'loading' }
    | { kind: 'success'; data: T }
    | { kind: 'error'; status: number | null }
  }>({ path, value: { kind: 'loading' } })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    apiRequest(path, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          if (!controller.signal.aborted) {
            if (response.status >= 500 && !(response.status === 503 && /^\/api\/public\/(opening-hours|opening-status)/.test(path))) {
              reportPublicApiFailure(path, response.status, 'server_error')
            }
            setState({ path, value: { kind: 'error', status: response.status } })
          }
          return
        }
        let data: T
        try { data = await response.json() as T }
        catch {
          if (!controller.signal.aborted) reportPublicApiFailure(path, response.status, 'invalid_response')
          if (!controller.signal.aborted) setState({ path, value: { kind: 'error', status: response.status } })
          return
        }
        if (!controller.signal.aborted) setState({ path, value: { kind: 'success', data } })
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          reportPublicApiFailure(path, null, 'network')
          setState({ path, value: { kind: 'error', status: null } })
          if (import.meta.env.DEV) console.error(`Public request failed: ${path}`, error)
        }
      })

    return () => controller.abort()
  }, [path, attempt])

  useEffect(() => {
    const refreshWhenVisible = () => {
      if (!document.hidden) setAttempt((current) => current + 1)
    }
    document.addEventListener('visibilitychange', refreshWhenVisible)
    const interval = refreshIntervalMs > 0 ? window.setInterval(refreshWhenVisible, refreshIntervalMs) : undefined
    return () => {
      document.removeEventListener('visibilitychange', refreshWhenVisible)
      if (interval !== undefined) window.clearInterval(interval)
    }
  }, [refreshIntervalMs])

  return {
    ...(state.path === path ? state.value : { kind: 'loading' as const }),
    retry: () => {
      setState({ path, value: { kind: 'loading' } })
      setAttempt((current) => current + 1)
    },
  }
}
