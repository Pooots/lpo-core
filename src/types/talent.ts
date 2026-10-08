export type TalentStatus = 'for_assessment' | 'for_evaluation' | 'active'

export type CvSummary = {
  name: string | null
  size: number | null
  uploaded_at: string | null
}

export type AdminTalent = {
  id: number
  name: string
  email: string
  phone: string | null
  account_status: string
  created_at: string | null
  last_login_at: string | null
  location: string | null
  desired_position: string | null
  experience_level: string | null
  work_setup: string | null
  skills: Array<string>
  linkedin_url: string | null
  status: TalentStatus
  status_updated_at: string | null
  cv: CvSummary | null
}

export type TalentCounts = Record<'all' | TalentStatus, number>

export type TalentListResponse = {
  data: Array<AdminTalent>
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
  }
  counts: TalentCounts
}

export type TalentListParams = {
  page: number
  search: string
  status: TalentStatus | 'all'
}

export type CreateTalentPayload = {
  name: string
  email: string
  phone: string
  password: string
  location: string
  desired_position: string
  experience_level: string
  work_setup: string
  skills: Array<string>
  linkedin_url?: string
  status: TalentStatus
  cv?: File | null
}
