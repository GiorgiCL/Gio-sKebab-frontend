import { apiRequest } from '../../lib/api/request'

export class ApiError extends Error {
  constructor(public status: number | null, message: string) { super(message) }
}

let csrf: { headerName: string; token: string } | null = null

export function clearCsrf() { csrf = null }

export async function getCsrf() {
  let response: Response
  try { response = await apiRequest('/api/admin/auth/csrf') }
  catch { throw new ApiError(null, 'Could not reach the server. Check your connection and try again.') }
  if (!response.ok) throw new ApiError(response.status, 'Could not start a secure session. Please try again.')
  csrf = await response.json() as { headerName: string; token: string }
  return csrf
}

export async function adminRequest<T>(path: `/api/admin/${string}`, init: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; body?: unknown } = {}): Promise<T> {
  const method = init.method ?? 'GET'
  const headers: Record<string, string> = {}
  if (init.body !== undefined) headers['Content-Type'] = 'application/json'
  if (method !== 'GET') {
    const token = csrf ?? await getCsrf()
    headers[token.headerName] = token.token
  }
  let response: Response
  try {
    response = await apiRequest(path, { method, headers, body: init.body === undefined ? undefined : JSON.stringify(init.body) })
  } catch {
    throw new ApiError(null, 'Could not reach the server. Check your connection and try again.')
  }
  if (response.status === 401 && path !== '/api/admin/auth/login' && path !== '/api/admin/auth/me') {
    clearCsrf()
    window.dispatchEvent(new Event('admin-session-expired'))
  }
  if (!response.ok) {
    if (response.status === 403) {
      clearCsrf()
      if (path !== '/api/admin/auth/login') {
        try {
          const session = await apiRequest('/api/admin/auth/me')
          if (session.status === 401) {
            window.dispatchEvent(new Event('admin-session-expired'))
            throw new ApiError(401, 'Your session has expired. Please sign in again.')
          }
        } catch (error) { if (error instanceof ApiError) throw error }
      }
    }
    throw new ApiError(response.status, errorMessage(response.status, path))
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

function errorMessage(status: number, path: string) {
  if (status === 400) return 'The server rejected this entry. Check the required values, links, dates and times.'
  if (status === 401) return path.endsWith('/login') ? 'Email or password is incorrect.' : 'Your session has expired. Please sign in again.'
  if (status === 403) return 'Your secure session needs refreshing. Please try again.'
  if (status === 404) return 'This content no longer exists. Refresh the page to see the latest data.'
  if (status === 409) return 'This change conflicts with existing content. Review related entries and try again.'
  return 'The server could not save this change. Please try again.'
}

export function message(error: unknown) { return error instanceof Error ? error.message : 'Something went wrong. Please try again.' }
