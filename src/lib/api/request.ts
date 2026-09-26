import { API_BASE_URL } from './config'

/** Sends a request to a documented backend path while retaining its session cookie. */
export function apiRequest(path: `/${string}`, init: RequestInit = {}): Promise<Response> {
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
  })
}
