import {
  BarChart3,
  FileSignature,
  LayoutDashboard,
  ListTodo,
  Target,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type BusinessModulePath =
  | '/business/account'
  | '/business/account/leads'
  | '/business/account/contracts'
  | '/business/account/talents'
  | '/business/account/tasks'
  | '/business/account/reports'

export type BusinessModule = {
  id: string
  label: string
  path: BusinessModulePath
  icon: LucideIcon
  description: string
}

export const BUSINESS_MODULES: Array<BusinessModule> = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/business/account',
    icon: LayoutDashboard,
    description: 'Your company overview, engagement status, and open agreements.',
  },
  {
    id: 'leads',
    label: 'Leads',
    path: '/business/account/leads',
    icon: Target,
    description: 'Leads LPO sources and qualifies for your company.',
  },
  {
    id: 'contracts',
    label: 'Contract',
    path: '/business/account/contracts',
    icon: FileSignature,
    description: 'Agreements built from the services you request. Each one is approved by LPO admin.',
  },
  {
    id: 'talents',
    label: 'Talents',
    path: '/business/account/talents',
    icon: Users,
    description: 'The LPO talents assigned to your company.',
  },
  {
    id: 'tasks',
    label: 'Task',
    path: '/business/account/tasks',
    icon: ListTodo,
    description: 'Work your assigned team is delivering.',
  },
  {
    id: 'reports',
    label: 'Reports',
    path: '/business/account/reports',
    icon: BarChart3,
    description: 'A clear summary of your engagement, services, and agreements.',
  },
]

export function businessModuleFromPath(pathname: string): BusinessModule {
  const exact = BUSINESS_MODULES.find((module) => module.path === pathname)
  if (exact) return exact
  return (
    BUSINESS_MODULES.find(
      (module) => module.path !== '/business/account' && pathname.startsWith(module.path),
    ) ?? BUSINESS_MODULES[0]
  )
}
