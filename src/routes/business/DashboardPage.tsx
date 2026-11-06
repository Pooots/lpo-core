import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowUpRight, CircleCheck, ClipboardList, Rocket, ScrollText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { BusinessProfile } from '@/types/auth'
import type { ClientStatus } from '@/types/client'
import { EASE_OUT } from '@/components/home/ui'
import { ENGAGEMENT_TYPES } from '@/lib/clientOptions'
import { labelFor } from '@/lib/accountOptions'
import { useServiceCatalog } from '@/hooks/useServiceCatalog'
import { cn } from '@/lib/utils'
import { useBusinessSession } from '@/routes/business/BusinessSession'

const STEPS: Array<{ status: ClientStatus; icon: LucideIcon; title: string; text: string }> = [
  { status: 'new_inquiry', icon: CircleCheck, title: 'Request received', text: 'Your service request is with the LPO solutions team.' },
  { status: 'discovery', icon: ClipboardList, title: 'Discovery', text: 'We map your goals, workflow, and the team you need.' },
  { status: 'proposal', icon: ScrollText, title: 'Agreement', text: 'A contract is prepared from the services you requested.' },
  { status: 'active', icon: Rocket, title: 'Delivery', text: 'Your talents are onboarded and work is underway.' },
]

const BADGE: Record<ClientStatus, string> = {
  new_inquiry: 'Request received',
  discovery: 'In discovery',
  proposal: 'Agreement in review',
  active: 'Active client',
  inactive: 'Inactive',
}

function intro(profile: BusinessProfile | null): string {
  const company = profile?.company_name ?? 'your company'
  switch (profile?.status) {
    case 'discovery':
      return `We are in discovery with ${company}. The next step is an agreement built from the services you need.`
    case 'proposal':
      return `An agreement for ${company} is with our team for review. You can add further service requests at any time.`
    case 'active':
      return `${company} is live with LPO. Open a new contract whenever you need another service.`
    case 'inactive':
      return `This engagement is paused. A new contract request will put ${company} back in front of the LPO team.`
    default:
      return `Thank you for choosing LPO. We are reviewing ${company}'s request and will confirm the agreement shortly.`
  }
}

function reachedIndex(status: ClientStatus | undefined): number {
  const index = STEPS.findIndex((step) => step.status === status)
  return index < 0 ? 0 : index
}

export default function BusinessDashboardPage() {
  const { session } = useBusinessSession()
  const { labelFor: serviceLabel } = useServiceCatalog()
  const profile = session.profile
  const company = profile?.company_name ?? 'Your company'
  const firstName = session.user.name.split(' ')[0]
  const services = profile?.services ?? []
  const current = reachedIndex(profile?.status)
  const joined = session.user.created_at
    ? new Date(session.user.created_at).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <div className="mx-auto max-w-6xl">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="relative overflow-hidden rounded-[28px] bg-[#07101f] px-7 py-8 text-white shadow-[0_30px_80px_-40px_rgb(7_16_31/0.8)] sm:px-10 sm:py-10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgb(255 255 255 / 0.16) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.16) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 70% 80% at 100% 0%, black, transparent)',
          }}
        />
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-lpo-yellow/20 blur-[90px]" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-lpo-yellow px-3 py-1 text-[10px] font-extrabold tracking-[0.16em] text-lpo-ink uppercase">
              {BADGE[profile?.status ?? 'new_inquiry']}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">
              Welcome, {firstName}.
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/65">{intro(profile)}</p>
            {joined && <p className="mt-4 text-xs font-semibold text-white/40">Member since {joined}</p>}
          </div>
          <Link
            to="/business/account/contracts"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-extrabold text-[#07101f] transition-transform hover:-translate-y-0.5"
          >
            View contracts
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </motion.section>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Services requested', value: String(services.length), hint: 'Included in your agreements' },
          { label: 'Engagement', value: profile?.engagement_type ? labelFor(ENGAGEMENT_TYPES, profile.engagement_type) : 'To be scoped', hint: profile?.team_size ? `${profile.team_size} ${profile.team_size === 1 ? 'seat' : 'seats'}` : 'Seats confirmed after approval' },
          { label: 'Account manager', value: profile?.account_manager ?? 'Assigning', hint: company },
        ].map((item, index) => (
          <motion.article
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.08 + index * 0.05 }}
            className="rounded-2xl bg-white px-5 py-5 shadow-[0_20px_50px_-36px_rgb(7_16_31/0.5)] ring-1 ring-[#07101f]/[0.06]"
          >
            <p className="text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">{item.label}</p>
            <p className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-lpo-ink">{item.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.hint}</p>
          </motion.article>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[28px] bg-white p-6 ring-1 ring-[#07101f]/[0.06] sm:p-8">
          <h2 className="text-lg font-extrabold tracking-[-0.02em]">Engagement</h2>
          <ol className="mt-6 space-y-0">
            {STEPS.map((step, index) => {
              const done = index <= current && profile?.status !== 'inactive'
              const Icon = step.icon
              return (
                <li key={step.status} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        'flex size-10 items-center justify-center rounded-2xl',
                        done ? 'bg-[#07101f] text-lpo-yellow' : 'bg-[#f3f5f9] text-muted-foreground',
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    {index < STEPS.length - 1 && (
                      <span className={cn('my-1 w-px flex-1', done ? 'bg-[#07101f]/30' : 'bg-border')} />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="font-extrabold text-lpo-ink">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        <section className="rounded-[28px] bg-white p-6 ring-1 ring-[#07101f]/[0.06] sm:p-8">
          <h2 className="text-lg font-extrabold tracking-[-0.02em]">Requested services</h2>
          <p className="mt-1 text-sm text-muted-foreground">These services form the basis of your contract with LPO.</p>
          {services.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">No services yet. Add them from Contract.</p>
          ) : (
            <ul className="mt-5 space-y-2">
              {services.map((service) => (
                <li key={service} className="flex items-center justify-between rounded-2xl bg-[#f7f8fb] px-4 py-3">
                  <span className="text-sm font-bold text-lpo-ink">{serviceLabel(service)}</span>
                  <span className="text-[11px] font-bold tracking-[0.12em] text-[#8a6a00] uppercase">Requested</span>
                </li>
              ))}
            </ul>
          )}
          <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Industry</dt>
              <dd className="font-bold text-lpo-ink">{profile?.industry ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Company size</dt>
              <dd className="font-bold text-lpo-ink">{profile?.company_size ? `${profile.company_size} employees` : '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Contact</dt>
              <dd className="text-right font-bold text-lpo-ink">{session.user.email}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  )
}
