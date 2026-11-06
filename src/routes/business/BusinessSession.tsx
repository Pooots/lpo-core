import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { AccountSession, BusinessProfile } from '@/types/auth'

export type ClientSession = Extract<AccountSession, { type: 'client' }>

type BusinessSessionValue = {
  session: ClientSession
  setSession: (next: AccountSession) => void
}

const BusinessSessionContext = createContext<BusinessSessionValue | null>(null)

export function BusinessSessionProvider({
  value,
  children,
}: {
  value: BusinessSessionValue
  children: ReactNode
}) {
  return <BusinessSessionContext.Provider value={value}>{children}</BusinessSessionContext.Provider>
}

export function useBusinessSession(): BusinessSessionValue {
  const value = useContext(BusinessSessionContext)
  if (!value) throw new Error('useBusinessSession must be used inside the client account.')
  return value
}

export function useClientProfile(): BusinessProfile | null {
  return useBusinessSession().session.profile
}
