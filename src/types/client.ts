import type { ListMeta } from '@/components/admin/ui'

export type ClientStatus = 'new_inquiry' | 'discovery' | 'proposal' | 'active' | 'inactive'

export type EngagementType = 'dedicated' | 'part_time' | 'project_based'

export type LeadSource = 'website' | 'referral' | 'outbound' | 'event' | 'partner' | 'other'

export type AdminClient = {
  id: number
  name: string
  email: string
  phone: string | null
  account_status: string
  created_at: string | null
  last_login_at: string | null
  company_name: string
  company_website: string | null
  industry: string | null
  company_size: string | null
  country: string | null
  city: string | null
  job_title: string | null
  billing_email: string | null
  services: Array<string>
  message: string | null
  lead_source: LeadSource | null
  engagement_type: EngagementType | null
  team_size: number | null
  monthly_value: number | null
  currency: string
  contract_start: string | null
  contract_end: string | null
  account_manager: string | null
  notes: string | null
  status: ClientStatus
  status_updated_at: string | null
}

export type ClientCounts = Record<'all' | ClientStatus, number>

export type ClientListResponse = {
  data: Array<AdminClient>
  meta: ListMeta
  counts: ClientCounts
}

export type ClientListParams = {
  page: number
  search: string
  status: ClientStatus | 'all'
}

export type SaveClientPayload = {
  company_name: string
  company_website: string | null
  industry: string
  company_size: string
  country: string | null
  city: string | null
  name: string
  job_title: string
  email: string
  phone: string | null
  billing_email: string | null
  password?: string
  services: Array<string>
  message: string | null
  lead_source: LeadSource | null
  engagement_type: EngagementType | null
  team_size: number | null
  monthly_value: number | null
  currency: string
  contract_start: string | null
  contract_end: string | null
  account_manager: string | null
  notes: string | null
  status: ClientStatus
}
