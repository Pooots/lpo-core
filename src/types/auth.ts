import type { ClientStatus, EngagementType } from './client'
import type { CvSummary, TalentStatus } from './talent'

export type UserType = 'admin' | 'talent' | 'client'

/** Public self-service account types (admins are created by the seeder). */
export type AccountType = Exclude<UserType, 'admin'>

export type AuthUser = {
  id: number
  name: string
  email: string
  phone: string | null
  status: string
  created_at: string | null
}

export type CandidateProfile = {
  id: number
  location: string
  desired_position: string
  experience_level: string
  work_setup: string
  skills: Array<string> | null
  linkedin_url: string | null
  status: TalentStatus
  status_updated_at: string | null
  cv: CvSummary | null
  created_at: string
}

export type BusinessProfile = {
  id: number
  company_name: string
  company_website: string | null
  industry: string
  company_size: string
  job_title: string
  services: Array<string>
  message: string | null
  country: string | null
  city: string | null
  billing_email: string | null
  engagement_type: EngagementType | null
  team_size: number | null
  contract_start: string | null
  contract_end: string | null
  account_manager: string | null
  status: ClientStatus
  status_updated_at: string | null
  created_at: string
}

export type AccountSession =
  | { type: 'talent'; user: AuthUser; profile: CandidateProfile | null }
  | { type: 'client'; user: AuthUser; profile: BusinessProfile | null }
  | { type: 'admin'; user: AuthUser; profile: null }

export type AuthResponse = AccountSession & {
  message: string
  access_token: string
  token_type: string
  expires_in: number
}

export type CandidateRegisterPayload = {
  name: string
  email: string
  phone: string
  password: string
  password_confirmation: string
  location: string
  desired_position: string
  experience_level: string
  work_setup: string
  skills: Array<string>
  linkedin_url?: string
  cv: File
  terms: boolean
}

export type BusinessRegisterPayload = {
  company_name: string
  company_website?: string
  industry: string
  company_size: string
  name: string
  job_title: string
  email: string
  phone?: string
  password: string
  password_confirmation: string
  services: Array<string>
  message?: string
  terms: boolean
}
