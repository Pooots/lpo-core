import type { BusinessProfile } from '@/types/auth'

export type ContractApproval = 'pending_admin' | 'approved'

export type ClientContract = {
  id: string
  reference: string
  services: Array<string>
  note: string
  createdAt: string
  status: ContractApproval
  source: 'profile' | 'request'
}

const STORAGE_PREFIX = 'lpo-client-contracts:'

export function storageKey(userId: number): string {
  return `${STORAGE_PREFIX}${userId}`
}

export function profileContract(profile: BusinessProfile | null): ClientContract | null {
  if (!profile || profile.services.length === 0) return null
  return {
    id: 'profile-request',
    reference: 'LPO-CTR-001',
    services: profile.services,
    note: profile.message?.trim() || 'Initial service request submitted with your company profile.',
    createdAt: profile.created_at,
    status: profile.status === 'active' ? 'approved' : 'pending_admin',
    source: 'profile',
  }
}

export function readExtraContracts(userId: number): Array<ClientContract> {
  try {
    const raw = sessionStorage.getItem(storageKey(userId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as Array<ClientContract>
    return Array.isArray(parsed) ? parsed.filter((item) => item.source === 'request') : []
  } catch {
    return []
  }
}

export function writeExtraContracts(userId: number, contracts: Array<ClientContract>): void {
  sessionStorage.setItem(
    storageKey(userId),
    JSON.stringify(contracts.filter((item) => item.source === 'request')),
  )
}

export function nextReference(count: number): string {
  return `LPO-CTR-${String(count + 1).padStart(3, '0')}`
}
