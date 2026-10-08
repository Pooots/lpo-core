import { BadgeCheck, ClipboardCheck, FileSearch } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TalentStatus } from '@/types/talent'

/** Keep in sync with lpo-ws/app/Support/AccountOptions.php TALENT_STATUSES. */
export const TALENT_STATUSES: Array<{
  value: TalentStatus
  label: string
  description: string
  icon: LucideIcon
  badge: string
  dot: string
  solid: string
  soft: string
}> = [
  {
    value: 'for_assessment',
    label: 'For Assessment',
    description: 'CV received and waiting for the recruitment team to assess.',
    icon: FileSearch,
    badge: 'bg-amber-50 text-amber-700 ring-amber-200',
    dot: 'bg-amber-500',
    solid: 'bg-amber-500 text-white',
    soft: 'bg-amber-50 text-amber-600',
  },
  {
    value: 'for_evaluation',
    label: 'For Evaluation',
    description: 'Passed assessment and is being evaluated for placement.',
    icon: ClipboardCheck,
    badge: 'bg-lpo-blue-soft text-lpo-blue ring-lpo-blue/20',
    dot: 'bg-lpo-blue',
    solid: 'bg-lpo-blue text-white',
    soft: 'bg-lpo-blue-soft text-lpo-blue',
  },
  {
    value: 'active',
    label: 'Active',
    description: 'Evaluation complete. The talent is active and ready to be placed.',
    icon: BadgeCheck,
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    dot: 'bg-emerald-500',
    solid: 'bg-emerald-500 text-white',
    soft: 'bg-emerald-50 text-emerald-600',
  },
]

export function talentStatusMeta(status: TalentStatus) {
  return TALENT_STATUSES.find((s) => s.value === status) ?? TALENT_STATUSES[0]
}

export function talentStatusIndex(status: TalentStatus): number {
  return Math.max(
    0,
    TALENT_STATUSES.findIndex((s) => s.value === status),
  )
}

export const CV_ACCEPT =
  '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

const CV_MAX_BYTES = 5 * 1024 * 1024

export function cvFileError(file: File | null | undefined, required = true): string | undefined {
  if (!file) return required ? 'Please upload your CV.' : undefined
  if (!/\.(pdf|docx?)$/i.test(file.name)) return 'Upload a PDF, DOC, or DOCX file.'
  if (file.size > CV_MAX_BYTES) return 'The file must be 5 MB or smaller.'
  return undefined
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatDate(value: string | null | undefined, withTime = false): string {
  if (!value) return '—'
  // Date-only values (e.g. contract dates) are calendar days, not UTC midnight.
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...(withTime ? { hour: 'numeric', minute: '2-digit' } : {}),
  })
}
