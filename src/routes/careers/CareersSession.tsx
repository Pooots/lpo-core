import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { AccountSession } from '@/types/auth'

export type TalentSession = Extract<AccountSession, { type: 'talent' }>

type CareersSessionValue = {
  session: TalentSession
  setSession: (session: AccountSession) => void
}

const CareersSessionContext = createContext<CareersSessionValue | null>(null)

export function CareersSessionProvider({
  value,
  children,
}: {
  value: CareersSessionValue
  children: ReactNode
}) {
  return (
    <CareersSessionContext.Provider value={value}>{children}</CareersSessionContext.Provider>
  )
}

export function useCareersSession(): CareersSessionValue {
  const ctx = useContext(CareersSessionContext)
  if (!ctx) throw new Error('useCareersSession must be used within CareersLayout')
  return ctx
}
