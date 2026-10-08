import type {
  AccountSession,
  AuthResponse,
  BusinessRegisterPayload,
  CandidateRegisterPayload,
  UserType,
} from '@/types/auth'
import api, { SESSION_STORAGE_KEY, TOKEN_STORAGE_KEY } from '@/lib/api'
import { MULTIPART, toFormData } from '@/lib/formData'

const SESSION_KEY = SESSION_STORAGE_KEY

function persist(data: AuthResponse): AuthResponse {
  localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token)
  persistSession(data)
  return data
}

function persistSession(data: AccountSession): void {
  const session = {
    type: data.type,
    user: data.user,
    profile: data.profile,
  } as AccountSession
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export const ACCOUNT_HOME = {
  talent: '/careers/account',
  client: '/business/account',
  admin: '/admin',
} as const satisfies Record<UserType, string>

export const ACCOUNT_LOGIN = {
  talent: '/careers/login',
  client: '/business/login',
  admin: '/admin/login',
} as const satisfies Record<UserType, string>

export const authService = {
  async registerCandidate(payload: CandidateRegisterPayload): Promise<AuthResponse> {
    this.clear()
    const { data } = await api.post<AuthResponse>(
      '/auth/candidate/register',
      toFormData(payload),
      MULTIPART,
    )
    return persist(data)
  },

  async uploadCv(file: File): Promise<AccountSession> {
    const { data } = await api.post<AccountSession>('/talent/cv', toFormData({ cv: file }), MULTIPART)
    persistSession(data)
    return data
  },

  async registerBusiness(payload: BusinessRegisterPayload): Promise<AuthResponse> {
    this.clear()
    const { data } = await api.post<AuthResponse>('/auth/business/register', payload)
    return persist(data)
  },

  async login(credentials: {
    email: string
    password: string
    type: UserType
  }): Promise<AuthResponse> {
    this.clear()
    const { data } = await api.post<AuthResponse>('/auth/login', credentials)
    return persist(data)
  },

  async me(): Promise<AccountSession> {
    const { data } = await api.get<AccountSession>('/auth/me')
    persistSession(data)
    return data
  },

  async logout(): Promise<void> {
    try {
      if (this.isAuthenticated()) await api.post('/auth/logout')
    } catch {
      // Token may already be expired; the local session is cleared either way.
    } finally {
      this.clear()
    }
  },

  clear(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(SESSION_KEY)
  },

  getSession(): AccountSession | null {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AccountSession
    } catch {
      return null
    }
  },

  getUserType(): UserType | null {
    return this.isAuthenticated() ? (this.getSession()?.type ?? null) : null
  },

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(TOKEN_STORAGE_KEY))
  },
}
