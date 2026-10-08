import {
  Building2,
  CalendarClock,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  Settings,
  UsersRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type AdminModulePath =
  | '/admin'
  | '/admin/talents'
  | '/admin/clients'
  | '/admin/projects'
  | '/admin/tasks'
  | '/admin/hris'
  | '/admin/settings'

export type AdminModule = {
  id: string
  label: string
  path: AdminModulePath
  icon: LucideIcon
  description: string
}

export const ADMIN_MODULES: Array<AdminModule> = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/admin',
    icon: LayoutDashboard,
    description: 'A live overview of talents, clients, projects, and team activity.',
  },
  {
    id: 'talents',
    label: 'Talents',
    path: '/admin/talents',
    icon: UsersRound,
    description: 'Review candidate profiles, screen applicants, and manage the talent pool.',
  },
  {
    id: 'clients',
    label: 'Clients',
    path: '/admin/clients',
    icon: Building2,
    description: 'Manage business accounts, service requests, and proposals.',
  },
  {
    id: 'projects',
    label: 'Projects',
    path: '/admin/projects',
    icon: FolderKanban,
    description: 'Track client engagements, assigned teams, and deliverables.',
  },
  {
    id: 'tasks',
    label: 'Task',
    path: '/admin/tasks',
    icon: ListChecks,
    description: 'Assign, prioritize, and follow up on day-to-day work.',
  },
  {
    id: 'hris',
    label: 'HRIS / Tracker',
    path: '/admin/hris',
    icon: CalendarClock,
    description: 'Employee records, attendance, time tracking, and leave.',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/admin/settings',
    icon: Settings,
    description: 'Admin accounts, roles, and platform configuration.',
  },
]

export function findAdminModule(id: string): AdminModule {
  return ADMIN_MODULES.find((m) => m.id === id) ?? ADMIN_MODULES[0]
}
