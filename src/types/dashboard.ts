import type { ClientStatus } from '@/types/client'
import type { TalentStatus } from '@/types/talent'

export type DashboardSummary = {
  talents: number
  clients: number
  active_talents: number
  active_clients: number
  services: number
  services_total: number
  pipeline_talents: number
  pipeline_clients: number
  active_seats: number
  monthly_value_by_currency: Array<{ currency: string; amount: number }>
}

export type PipelinePoint = {
  status: string
  count: number
}

export type RegistrationPoint = {
  date: string
  label: string
  talents: number
  clients: number
  total: number
}

export type TopServicePoint = {
  slug: string
  name: string
  count: number
}

export type RecentTalent = {
  id: number
  name: string
  email: string
  desired_position: string | null
  status: TalentStatus
  has_cv: boolean
  created_at: string | null
}

export type RecentClient = {
  id: number
  name: string
  email: string
  company_name: string | null
  status: ClientStatus
  services: Array<string>
  created_at: string | null
}

export type NeedsAttention = {
  talents_missing_cv: number
  clients_new_inquiry: number
  talents_for_assessment: number
  clients_in_proposal: number
}

export type AdminDashboard = {
  generated_at: string
  summary: DashboardSummary
  talent_pipeline: Array<PipelinePoint>
  client_pipeline: Array<PipelinePoint>
  registrations: Array<RegistrationPoint>
  top_services: Array<TopServicePoint>
  recent_talents: Array<RecentTalent>
  recent_clients: Array<RecentClient>
  needs_attention: NeedsAttention
}
