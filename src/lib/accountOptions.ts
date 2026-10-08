import {
  CircleCheck,
  Database,
  Headphones,
  Laptop,
  
  Megaphone,
  Search,
  Target,
  Users
} from 'lucide-react'
import type {LucideIcon} from 'lucide-react';

/** Keep values in sync with lpo-ws/app/Support/AccountOptions.php. */

export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry level', hint: 'New to the field' },
  { value: '1-3', label: '1–3 years', hint: 'Some experience' },
  { value: '3-5', label: '3–5 years', hint: 'Experienced' },
  { value: '5-10', label: '5–10 years', hint: 'Senior' },
  { value: '10+', label: '10+ years', hint: 'Expert' },
] as const

export const WORK_SETUPS = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
] as const

export const CANDIDATE_SKILLS = [
  'Lead Generation',
  'Prospect Research',
  'Cold Calling',
  'Cold Email',
  'Appointment Setting',
  'Virtual Assistance',
  'Data Entry',
  'CRM Management',
  'Executive Assistance',
  'Customer Support',
  'IT Support',
  'Bookkeeping',
] as const

export const SERVICE_OPTIONS: Array<{
  value: string
  label: string
  description: string
  icon: LucideIcon
}> = [
  {
    value: 'lead_generation',
    label: 'B2B Lead Generation',
    description: 'Targeted prospect lists built on your ICP.',
    icon: Target,
  },
  {
    value: 'prospect_research',
    label: 'Prospect Research',
    description: 'Manual research on companies and decision-makers.',
    icon: Search,
  },
  {
    value: 'icp_qualification',
    label: 'ICP Qualification',
    description: 'Prospects reviewed against your requirements.',
    icon: CircleCheck,
  },
  {
    value: 'outreach_databases',
    label: 'Outreach-Ready Data',
    description: 'Verified, segmented, CRM-ready databases.',
    icon: Database,
  },
  {
    value: 'cold_outreach',
    label: 'Cold Outreach',
    description: 'Email, calling, and appointment setting.',
    icon: Megaphone,
  },
  {
    value: 'virtual_assistance',
    label: 'Virtual Assistance',
    description: 'Admin, CRM, research, and operations support.',
    icon: Laptop,
  },
  {
    value: 'it_service_desk',
    label: 'IT Service Desk',
    description: 'Remote technical and user support.',
    icon: Headphones,
  },
  {
    value: 'flexible_support',
    label: 'Flexible Support',
    description: 'A custom workflow around your business.',
    icon: Users,
  },
]

export const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'] as const

export const INDUSTRY_OPTIONS = [
  'Technology',
  'SaaS',
  'Real Estate',
  'Professional Services',
  'Healthcare',
  'E-Commerce',
  'Financial Services',
  'Construction',
  'Travel & Hospitality',
  'Startups',
  'SMEs',
  'B2B Services',
  'Other',
] as const

export function labelFor<T extends { value: string; label: string }>(
  options: ReadonlyArray<T>,
  value: string | null | undefined,
): string {
  return options.find((o) => o.value === value)?.label ?? value ?? '—'
}
