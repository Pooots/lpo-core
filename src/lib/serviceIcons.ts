import {
  BriefcaseBusiness,
  ChartColumn,
  CircleCheck,
  Database,
  Globe,
  Handshake,
  Headphones,
  Laptop,
  Megaphone,
  Search,
  Shield,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ServiceIcon } from '@/types/service'

export const SERVICE_ICON_OPTIONS: Array<{
  value: ServiceIcon
  label: string
  icon: LucideIcon
}> = [
  { value: 'target', label: 'Target', icon: Target },
  { value: 'search', label: 'Search', icon: Search },
  { value: 'circle_check', label: 'Check', icon: CircleCheck },
  { value: 'database', label: 'Database', icon: Database },
  { value: 'megaphone', label: 'Megaphone', icon: Megaphone },
  { value: 'laptop', label: 'Laptop', icon: Laptop },
  { value: 'headphones', label: 'Headphones', icon: Headphones },
  { value: 'users', label: 'Users', icon: Users },
  { value: 'briefcase', label: 'Briefcase', icon: BriefcaseBusiness },
  { value: 'handshake', label: 'Handshake', icon: Handshake },
  { value: 'globe', label: 'Globe', icon: Globe },
  { value: 'chart', label: 'Chart', icon: ChartColumn },
  { value: 'shield', label: 'Shield', icon: Shield },
  { value: 'sparkles', label: 'Sparkles', icon: Sparkles },
]

const ICON_MAP = Object.fromEntries(
  SERVICE_ICON_OPTIONS.map((option) => [option.value, option.icon]),
) as Record<string, LucideIcon>

export function serviceIcon(key: string | null | undefined): LucideIcon {
  return ICON_MAP[key ?? ''] ?? BriefcaseBusiness
}
