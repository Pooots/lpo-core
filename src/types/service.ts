import type { ListMeta } from '@/components/admin/ui'

export type ServiceIcon =
  | 'target'
  | 'search'
  | 'circle_check'
  | 'database'
  | 'megaphone'
  | 'laptop'
  | 'headphones'
  | 'users'
  | 'briefcase'
  | 'handshake'
  | 'globe'
  | 'chart'
  | 'shield'
  | 'sparkles'

export type AdminService = {
  id: number
  slug: string
  name: string
  description: string
  icon: ServiceIcon | string
  is_active: boolean
  sort_order: number
  client_count: number
  created_at: string | null
  updated_at: string | null
}

export type ServiceCounts = {
  all: number
  active: number
  inactive: number
}

export type ServiceListResponse = {
  data: Array<AdminService>
  meta: ListMeta
  counts: ServiceCounts
}

export type ServiceListParams = {
  page?: number
  search?: string
  status?: 'all' | 'active' | 'inactive'
  per_page?: number
}

export type SaveServicePayload = {
  name: string
  slug?: string
  description: string
  icon: ServiceIcon | string
  is_active: boolean
  sort_order?: number | null
}

export type ServiceOption = {
  value: string
  label: string
  description: string
  icon: ServiceIcon | string
}
