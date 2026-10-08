import type { TalentStatus } from '@/types/talent'
import { StatusBadge, StatusMenu } from '@/components/admin/StatusMenu'
import { TALENT_STATUSES } from '@/lib/talentStatus'

export function TalentStatusBadge({ status, className }: { status: TalentStatus; className?: string }) {
  return <StatusBadge options={TALENT_STATUSES} status={status} className={className} />
}

export function TalentStatusMenu({
  status,
  loading,
  onChange,
}: {
  status: TalentStatus
  loading?: boolean
  onChange: (status: TalentStatus) => void
}) {
  return <StatusMenu options={TALENT_STATUSES} status={status} loading={loading} onChange={onChange} />
}
