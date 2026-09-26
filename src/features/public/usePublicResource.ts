import { useEffect, useState } from 'react'
import { apiRequest } from '../../lib/api/request'

export type Resource<T> = (
  | { kind: 'loading' }
  | { kind: 'success'; data: T }
  | { kind: 'error'; status: number | null }
) & { retry: () => void }

export function usePublicResource<T>(path: `/${string}`, refreshIntervalMs = 0): Resource<T> {
  const [state, setState] = useState<
    | { kind: 'loading' }
    | { kind: 'success'; data: T }
    | { kind: 'error'; status: number | null }
  >({ kind: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    apiRequest(path, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          setState({ kind: 'error', status: response.status })
          return
        }
        setState({ kind: 'success', data: (await response.json()) as T })
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({ kind: 'error', status: null })
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
    ...state,
    retry: () => {
      setState({ kind: 'loading' })
      setAttempt((current) => current + 1)
    },
  }
}
