import {
  BookOpenCheck,
  ClipboardCheck,
  FileSignature,
  LayoutDashboard,
  UserRound,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type CareersModulePath =
  | '/careers/account'
  | '/careers/account/contract'
  | '/careers/account/work-diary'
  | '/careers/account/payout'
  | '/careers/account/attendance'
  | '/careers/account/profile'

export type CareersModule = {
  id: string
  label: string
  path: CareersModulePath
  icon: LucideIcon
  description: string
  section: 'main' | 'account'
}

export const CAREERS_MODULES: Array<CareersModule> = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/careers/account',
    icon: LayoutDashboard,
    description: 'Your application overview, status, and next steps with LPO.',
    section: 'main',
  },
  {
    id: 'contract',
    label: 'Active Contract',
    path: '/careers/account/contract',
    icon: FileSignature,
    description: 'View your current placement contract, role, and engagement details.',
    section: 'main',
  },
  {
    id: 'work-diary',
    label: 'Work Diary',
    path: '/careers/account/work-diary',
    icon: BookOpenCheck,
    description: 'Log daily work, tasks completed, and notes for your assignment.',
    section: 'main',
  },
  {
    id: 'payout',
    label: 'Available Payout',
    path: '/careers/account/payout',
    icon: Wallet,
    description: 'See earnings ready for release and your payout history.',
    section: 'main',
  },
  {
    id: 'attendance',
    label: 'Attendance',
    path: '/careers/account/attendance',
    icon: ClipboardCheck,
    description: 'Clock in and out, and review your daily attendance records.',
    section: 'main',
  },
  {
    id: 'profile',
    label: 'Profile',
    path: '/careers/account/profile',
    icon: UserRound,
    description: 'Your candidate profile, skills, and CV on file with LPO.',
    section: 'account',
  },
]

export function findCareersModule(id: string): CareersModule {
  return CAREERS_MODULES.find((m) => m.id === id) ?? CAREERS_MODULES[0]
}

export function careersModuleFromPath(pathname: string): CareersModule {
  const exact = CAREERS_MODULES.find((m) => m.path === pathname)
  if (exact) return exact
  return (
    CAREERS_MODULES.find(
      (m) => m.path !== '/careers/account' && pathname.startsWith(m.path),
    ) ?? CAREERS_MODULES[0]
  )
}
