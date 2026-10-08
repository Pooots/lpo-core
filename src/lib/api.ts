import axios from 'axios'

/**
 * Resolve API base URL for local (relative / Vite proxy) and Vercel → Hostinger.
 * If Vercel env is only the Hostinger origin (no /api/v1), append it automatically.
 */
function resolveApiBaseUrl(raw: string | undefined): string {
  const value = (raw || '/api/v1').trim().replace(/\/+$/, '')

  if (!value.startsWith('http://') && !value.startsWith('https://')) {
    return value.startsWith('/') ? value : `/${value}`
  }

  try {
    const url = new URL(value)
    const path = url.pathname.replace(/\/+$/, '') || '/'

    if (path === '/' || path === '/api' || !path.includes('/api/v1')) {
      url.pathname = '/api/v1'
    }

    url.search = ''
    url.hash = ''
    return `${url.origin}${url.pathname.replace(/\/+$/, '')}`
  } catch {
    return '/api/v1'
  }
}

export const API_BASE_URL = resolveApiBaseUrl(
  import.meta.env.VITE_API_BASE_URL as string | undefined,
)

/** Unversioned API root (`/api`), where `/api` and `/api/health` live. */
export const API_ROOT_URL = API_BASE_URL.replace(/\/v1$/, '')

export const TOKEN_STORAGE_KEY = 'auth_token'
export const SESSION_STORAGE_KEY = 'auth_session'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

function isAuthFormRequest(config: { url?: string }): boolean {
  const url = config.url ?? ''
  return url.includes('/login')
}

api.interceptors.request.use(
  (config) => {
    if (isAuthFormRequest(config)) {
      if (config.headers) {
        delete config.headers.Authorization
        delete config.headers.authorization
      }
      return config
    }

    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAuthFormRequest(error.config ?? {})) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      localStorage.removeItem(SESSION_STORAGE_KEY)
    }

    return Promise.reject(error)
  },
)

export default api
