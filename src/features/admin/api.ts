import { apiRequest } from '../../lib/api/request'
import { readAdminLocale } from '../../lib/i18n/locales'
import { adminText } from './text'

export class ApiError extends Error {
  constructor(public status: number | null, message: string) { super(message) }
}

let csrf: { headerName: string; token: string } | null = null

export function clearCsrf() { csrf = null }

export async function getCsrf() {
  const t = adminText[readAdminLocale()]
  let response: Response
  try { response = await apiRequest('/api/admin/auth/csrf') }
  catch { throw new ApiError(null, t.networkError) }
  if (!response.ok) throw new ApiError(response.status, t.csrfError)
  try { csrf = await response.json() as { headerName: string; token: string } }
  catch { throw new ApiError(null, t.csrfError) }
  return csrf
}

export async function adminRequest<T>(path: `/api/admin/${string}`, init: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; body?: unknown } = {}): Promise<T> {
  const t = adminText[readAdminLocale()]
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
    throw new ApiError(null, t.networkError)
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
            throw new ApiError(401, t.sessionExpired)
          }
        } catch (error) { if (error instanceof ApiError) throw error }
      }
    }
    throw new ApiError(response.status, errorMessage(response.status, path))
  }
  if (response.status === 204) return undefined as T
  try { return await response.json() as T }
  catch { throw new ApiError(null, t.serverError) }
}

function errorMessage(status: number, path: string) {
  const t = adminText[readAdminLocale()]
  if (status === 400) return t.invalidEntry
  if (status === 401) return path.endsWith('/login') ? t.credentialsError : t.sessionExpired
  if (status === 403) return t.csrfRefresh
  if (status === 404) return t.missingResource
  if (status === 409) return t.conflict
  return t.serverError
}

export function message(error: unknown) { return error instanceof ApiError ? error.message : adminText[readAdminLocale()].unknownError }
