import {
  Briefcase,
  Building2,
  CalendarCheck,
  CircleCheck,
  Cloud,
  Cpu,
  Database,
  HardHat,
  Headphones,
  HeartPulse,
  House,
  Landmark,
  Laptop,
  Layers,
  
  Mail,
  Megaphone,
  PhoneCall,
  Plane,
  Rocket,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Store,
  Target,
  UserCheck,
  Users
} from 'lucide-react'
import type {LucideIcon} from 'lucide-react';

export const CONTACT = {
  email: 'hello@lpoph.com',
  phone: '+63 49 000 0000',
  phoneHref: 'tel:+63490000000',
  location: 'Laguna, Philippines',
}

export const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'about', label: 'About' },
  { id: 'industries', label: 'Industries' },
  { id: 'contact', label: 'Contact' },
] as const

export type NavId = (typeof NAV_LINKS)[number]['id']

export const TRUST_ITEMS: Array<{ icon: LucideIcon; label: string }> = [
  { icon: Target, label: 'B2B Lead Generation' },
  { icon: Search, label: 'Targeted Research' },
  { icon: Megaphone, label: 'Outreach Support' },
  { icon: Users, label: 'Remote Operations' },
]

export type Service = {
  icon: LucideIcon
  title: string
  description: string
  cta: string
  href: string
}

export const SERVICES: Array<Service> = [
  {
    icon: Target,
    title: 'Targeted B2B Lead Generation',
    description:
      'We build targeted prospect lists based on your market, ICP, location, industry, company size, job title, and other requirements—not generic database exports.',
    cta: 'Build My Prospect List',
    href: '#lead-generation',
  },
  {
    icon: Search,
    title: 'Manual Prospect Research',
    description:
      'Our team researches companies and decision-makers using primary sources, with prospecting tools used mainly for secondary verification and enrichment.',
    cta: 'Request a Research Sample',
    href: '#lead-generation',
  },
  {
    icon: CircleCheck,
    title: 'ICP Qualification',
    description:
      'We review prospects against your requirements so your sales team can focus on companies that actually fit your target market.',
    cta: 'Qualify My Prospects',
    href: '#lead-generation',
  },
  {
    icon: Database,
    title: 'Outreach-Ready Databases',
    description:
      'We organize, verify, qualify, and segment prospect data so it is ready for sales outreach, CRM import, or campaign execution.',
    cta: 'Clean Up My Data',
    href: '#lead-generation',
  },
  {
    icon: Megaphone,
    title: 'Cold Outreach',
    description:
      'Already have the leads? We can support cold email campaigns, cold calling, appointment setting, campaign segmentation, and follow-up workflows.',
    cta: 'Plan an Outreach Campaign',
    href: '#cold-outreach',
  },
  {
    icon: Laptop,
    title: 'Virtual Assistance',
    description:
      'Get reliable support for research, data management, administrative work, executive assistance, CRM management, and day-to-day business operations.',
    cta: 'Build My Support Team',
    href: '#virtual-assistance',
  },
  {
    icon: Headphones,
    title: 'IT Service Desk',
    description:
      'LPO provides remote IT Service Desk support for businesses that need structured technical and user support operations.',
    cta: 'Discuss IT Support',
    href: '#it-service-desk',
  },
  {
    icon: Users,
    title: 'Flexible Support',
    description:
      'Hire LPO for one service or build a broader outsourced workflow around your business requirements.',
    cta: 'Scope My Workflow',
    href: '#contact',
  },
]

export const WHY_LPO: Array<{
  icon: LucideIcon
  title: string
  description: string
}> = [
  {
    icon: Target,
    title: 'Targeted Research',
    description: 'Research based on your actual market and ICP.',
  },
  {
    icon: UserCheck,
    title: 'Human Verification',
    description:
      'Prospects are reviewed and qualified instead of relying entirely on automated databases.',
  },
  {
    icon: Layers,
    title: 'Flexible Support',
    description:
      'Start with one service or build a complete outsourced workflow.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Built Around Your Business',
    description:
      'Our workflows adapt to your requirements, processes, and goals.',
  },
]

export const STEPS: Array<{ title: string; description: string }> = [
  {
    title: 'Tell Us What You Need',
    description:
      'Share your target market, requirements, goals, and preferred workflow.',
  },
  {
    title: 'We Build Your Workflow',
    description:
      'Our team creates the appropriate research, outreach, administrative, or support process.',
  },
  {
    title: 'We Execute',
    description:
      'Our team performs the work while maintaining quality and consistency.',
  },
  {
    title: 'You Grow',
    description:
      'Your team gets better data, better support, and more time to focus on growth.',
  },
]

export const LEAD_GEN_POINTS = [
  'ICP definition before any research begins',
  'Company and decision-maker contacts',
  'Email verification and enrichment',
  'Segmented, CRM-ready export',
]

export type ProspectRow = {
  company: string
  industry: string
  website: string
  location: string
  size: number
  decisionMaker: string
  title: string
  emailStatus: 'Verified' | 'Pending'
  icp: 'ICP Fit' | 'Review'
}

export const PROSPECTS: Array<ProspectRow> = [
  {
    company: 'Northwind Software',
    industry: 'SaaS',
    website: 'northwind.io',
    location: 'United States',
    size: 120,
    decisionMaker: 'Dana Whitfield',
    title: 'VP Sales',
    emailStatus: 'Verified',
    icp: 'ICP Fit',
  },
  {
    company: 'Harborline Logistics',
    industry: 'Logistics',
    website: 'harborline.com',
    location: 'Singapore',
    size: 480,
    decisionMaker: 'Marcus Lee',
    title: 'Head of Operations',
    emailStatus: 'Verified',
    icp: 'ICP Fit',
  },
  {
    company: 'Brightpath Retail',
    industry: 'E-Commerce',
    website: 'brightpath.co',
    location: 'United Kingdom',
    size: 210,
    decisionMaker: 'Priya Raman',
    title: 'Ecommerce Director',
    emailStatus: 'Verified',
    icp: 'Review',
  },
  {
    company: 'Summit Financial Group',
    industry: 'Financial Services',
    website: 'summitfg.com',
    location: 'Australia',
    size: 860,
    decisionMaker: 'Alex Turner',
    title: 'Director of IT',
    emailStatus: 'Verified',
    icp: 'ICP Fit',
  },
  {
    company: 'Vertex Health Systems',
    industry: 'Healthcare',
    website: 'vertexhealth.com',
    location: 'Canada',
    size: 340,
    decisionMaker: 'Sofia Marino',
    title: 'Procurement Lead',
    emailStatus: 'Pending',
    icp: 'Review',
  },
]

export const PIPELINE_STEPS: Array<{ icon: LucideIcon; label: string }> = [
  { icon: Users, label: 'Prospects' },
  { icon: CircleCheck, label: 'Qualified' },
  { icon: Mail, label: 'Contacted' },
  { icon: PhoneCall, label: 'Follow-Up' },
  { icon: CalendarCheck, label: 'Meeting Booked' },
]

export const VA_AREAS: Array<{ title: string; description: string }> = [
  {
    title: 'Research',
    description: 'Market, company, and contact research prepared for your team.',
  },
  {
    title: 'Data Management',
    description: 'Data entry, clean-up, de-duplication, and enrichment.',
  },
  {
    title: 'Administrative Support',
    description: 'Documentation, scheduling, inbox, and back-office tasks.',
  },
  {
    title: 'CRM Management',
    description: 'Record upkeep, list hygiene, and pipeline updates.',
  },
  {
    title: 'Executive Assistance',
    description: 'Calendar, travel, reporting, and coordination support.',
  },
  {
    title: 'Operations Support',
    description: 'Recurring process work that keeps delivery moving.',
  },
]

export const SUPPORT_WORKFLOW = [
  'User Issue',
  'Ticket Created',
  'Assigned',
  'Troubleshooting',
  'Resolution',
  'Customer Feedback',
]

export const IT_CAPABILITIES: Array<{ title: string; description: string }> = [
  {
    title: 'Technical Support',
    description: 'First-line technical assistance for your users and tools.',
  },
  {
    title: 'User Support',
    description: 'Consistent, professional handling of day-to-day requests.',
  },
  {
    title: 'Ticket Management',
    description:
      'Intake, triage, assignment, and follow-through to closure.',
  },
  {
    title: 'Issue Escalation',
    description: 'Clear escalation paths when an issue needs more depth.',
  },
  {
    title: 'Remote Troubleshooting',
    description: 'Remote diagnosis and resolution of common issues.',
  },
  {
    title: 'Documentation',
    description: 'Knowledge base and process documentation maintained.',
  },
]

export const INDUSTRIES: Array<{ icon: LucideIcon; label: string }> = [
  { icon: Cpu, label: 'Technology' },
  { icon: Cloud, label: 'SaaS' },
  { icon: House, label: 'Real Estate' },
  { icon: Briefcase, label: 'Professional Services' },
  { icon: HeartPulse, label: 'Healthcare' },
  { icon: ShoppingCart, label: 'E-Commerce' },
  { icon: Landmark, label: 'Financial Services' },
  { icon: HardHat, label: 'Construction' },
  { icon: Plane, label: 'Travel & Hospitality' },
  { icon: Rocket, label: 'Startups' },
  { icon: Store, label: 'SMEs' },
  { icon: Building2, label: 'B2B Services' },
]

export const ABOUT_STATS: Array<{ value: number; suffix?: string; label: string }> = [
  { value: 2500, suffix: '+', label: 'Prospects Researched' },
  { value: 12, label: 'Industries Supported' },
  { value: 8, label: 'Core Services' },
]

export const TESTIMONIALS: Array<{ quote: string; role: string; company: string }> = [
  {
    quote:
      'The prospect list matched our ICP far better than anything we had purchased before. Our reps spent their time selling instead of cleaning data.',
    role: 'Head of Sales',
    company: 'B2B SaaS company',
  },
  {
    quote:
      'LPO took over our research and CRM upkeep, and our team finally had time to focus on real conversations.',
    role: 'Operations Manager',
    company: 'Professional services firm',
  },
  {
    quote:
      'Structured, responsive, and easy to work with. They understood our process quickly and kept quality consistent.',
    role: 'Managing Director',
    company: 'Technology company',
  },
]

export const FAQS: Array<{ question: string; answer: string }> = [
  {
    question: 'What services does LPO provide?',
    answer:
      'We provide targeted B2B lead generation, manual prospect research, ICP qualification, outreach-ready database building, cold outreach support, virtual assistance, and remote IT Service Desk support. Engagements can cover one service or a combined workflow.',
  },
  {
    question: 'Can LPO build a custom prospect list?',
    answer:
      'Yes. Every list starts from your ICP—target industries, locations, company size, job titles, and any other criteria you define. We research and verify each record instead of reselling generic database exports.',
  },
  {
    question: 'Do you work with international businesses?',
    answer:
      'Yes. We support businesses across North America, Europe, Asia-Pacific, and other regions, and align research, outreach, and support hours to your target markets and time zones.',
  },
  {
    question: 'Can you work with our existing CRM?',
    answer:
      'Yes. We can work directly inside your CRM or deliver CRM-ready exports formatted for tools such as HubSpot, Salesforce, Pipedrive, and Zoho.',
  },
  {
    question: 'Can LPO manage cold outreach?',
    answer:
      'Yes. We support cold email, cold calling, appointment setting, campaign segmentation, and follow-up workflows—using your existing leads or lists we build for you.',
  },
  {
    question: 'Can we hire LPO for only one service?',
    answer:
      'Absolutely. Many clients start with a single service, such as lead generation or virtual assistance, and expand into a broader workflow when they are ready.',
  },
  {
    question: 'Do you provide ongoing support?',
    answer:
      'Yes. Most engagements run as ongoing monthly support with consistent team members, regular reporting, and built-in quality checks.',
  },
  {
    question: 'How does your IT Service Desk work?',
    answer:
      'Your users report issues through your preferred channel. We log the ticket, triage and assign it, troubleshoot remotely, escalate when needed, and document the resolution through to closure and feedback.',
  },
]

export const FOOTER_SERVICES = [
  { label: 'Lead Generation', href: '#lead-generation' },
  { label: 'Prospect Research', href: '#services' },
  { label: 'Cold Outreach', href: '#cold-outreach' },
  { label: 'Virtual Assistance', href: '#virtual-assistance' },
  { label: 'IT Service Desk', href: '#it-service-desk' },
]

export const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'Facebook', href: 'https://www.facebook.com/' },
  { label: 'Instagram', href: 'https://www.instagram.com/' },
]
