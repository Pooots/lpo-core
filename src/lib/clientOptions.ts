import { CircleSlash, Handshake, Inbox, PhoneCall, ScrollText } from 'lucide-react'
import type { StatusOption } from '@/components/admin/StatusMenu'
import type { ClientStatus, EngagementType, LeadSource } from '@/types/client'

/** Keep in sync with lpo-ws/app/Support/AccountOptions.php CLIENT_STATUSES. */
export const CLIENT_STATUSES: Array<StatusOption<ClientStatus>> = [
  {
    value: 'new_inquiry',
    label: 'New Inquiry',
    description: 'Service request received. Waiting for the first call with the client.',
    icon: Inbox,
    badge: 'bg-amber-50 text-amber-700 ring-amber-200',
    dot: 'bg-amber-500',
    solid: 'bg-amber-500 text-white',
    soft: 'bg-amber-50 text-amber-600',
  },
  {
    value: 'discovery',
    label: 'Discovery',
    description: 'Discovery call in progress to understand goals, workflow, and team needs.',
    icon: PhoneCall,
    badge: 'bg-violet-50 text-violet-700 ring-violet-200',
    dot: 'bg-violet-500',
    solid: 'bg-violet-500 text-white',
    soft: 'bg-violet-50 text-violet-600',
  },
  {
    value: 'proposal',
    label: 'Proposal',
    description: 'Scoped proposal sent. Waiting for the client to approve and sign.',
    icon: ScrollText,
    badge: 'bg-lpo-blue-soft text-lpo-blue ring-lpo-blue/20',
    dot: 'bg-lpo-blue',
    solid: 'bg-lpo-blue text-white',
    soft: 'bg-lpo-blue-soft text-lpo-blue',
  },
  {
    value: 'active',
    label: 'Active',
    description: 'Signed client. The LPO team is onboarded and delivering.',
    icon: Handshake,
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    dot: 'bg-emerald-500',
    solid: 'bg-emerald-500 text-white',
    soft: 'bg-emerald-50 text-emerald-600',
  },
  {
    value: 'inactive',
    label: 'Inactive',
    description: 'Engagement paused, ended, or the client did not proceed.',
    icon: CircleSlash,
    badge: 'bg-slate-100 text-slate-600 ring-slate-200',
    dot: 'bg-slate-400',
    solid: 'bg-slate-500 text-white',
    soft: 'bg-slate-100 text-slate-600',
    offPipeline: true,
  },
]

export function clientStatusMeta(status: ClientStatus) {
  return CLIENT_STATUSES.find((s) => s.value === status) ?? CLIENT_STATUSES[0]
}

export const ENGAGEMENT_TYPES: ReadonlyArray<{ value: EngagementType; label: string; hint: string }> = [
  { value: 'dedicated', label: 'Dedicated team', hint: 'Full-time seats' },
  { value: 'part_time', label: 'Part-time', hint: 'Shared hours' },
  { value: 'project_based', label: 'Project-based', hint: 'Fixed scope' },
]

export const LEAD_SOURCES: ReadonlyArray<{ value: LeadSource; label: string }> = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'outbound', label: 'Outbound' },
  { value: 'event', label: 'Event' },
  { value: 'partner', label: 'Partner' },
  { value: 'other', label: 'Other' },
]

export const CURRENCIES = ['USD', 'AUD', 'GBP', 'EUR', 'CAD', 'PHP'] as const

export function formatMoney(value: number | null | undefined, currency: string): string {
  if (value === null || value === undefined) return '—'
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value)
  } catch {
    return `${currency} ${value.toLocaleString()}`
  }
}

export function websiteHost(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    return new URL(url).host.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function clientLocation(city: string | null, country: string | null): string {
  return [city, country].filter(Boolean).join(', ') || '—'
}
