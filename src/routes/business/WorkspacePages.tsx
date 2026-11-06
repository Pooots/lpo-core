import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { BarChart3, ListTodo, Target, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { EASE_OUT } from '@/components/home/ui'
import { useServiceCatalog } from '@/hooks/useServiceCatalog'
import { useBusinessSession } from '@/routes/business/BusinessSession'
import { profileContract, readExtraContracts } from '@/routes/business/contracts'

function Shell({
  title,
  text,
  children,
}: {
  title: string
  text: string
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-[1.9rem] font-extrabold tracking-[-0.03em] text-lpo-ink">{title}</h1>
      <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{text}</p>
      <div className="mt-6">{children}</div>
    </div>
  )
}

function EmptyBoard({
  icon: Icon,
  title,
  text,
  columns,
}: {
  icon: LucideIcon
  title: string
  text: string
  columns: Array<string>
}) {
  return (
    <section className="overflow-hidden rounded-[28px] bg-white ring-1 ring-[#07101f]/[0.06]">
      <div className="grid gap-px bg-border sm:grid-cols-4">
        {columns.map((column) => (
          <div key={column} className="bg-[#f7f8fb] px-4 py-3">
            <p className="text-[11px] font-extrabold tracking-[0.14em] text-muted-foreground uppercase">{column}</p>
            <p className="mt-1 text-lg font-extrabold text-lpo-ink">0</p>
          </div>
        ))}
      </div>
      <div className="px-6 py-14 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#07101f] text-lpo-yellow">
          <Icon className="size-6" />
        </span>
        <h2 className="mt-5 text-xl font-extrabold tracking-[-0.02em]">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </section>
  )
}

export function LeadsPage() {
  const { session } = useBusinessSession()
  const company = session.profile?.company_name ?? 'your company'
  return (
    <Shell
      title="Leads"
      text={`Qualified opportunities LPO develops for ${company} will appear here, from first contact through a won engagement.`}
    >
      <EmptyBoard
        icon={Target}
        title="No leads yet"
        columns={['New', 'Qualified', 'In progress', 'Won']}
        text="Once an agreement is approved, LPO-sourced leads for your company show up in this pipeline."
      />
    </Shell>
  )
}

export function TalentsPage() {
  const { session } = useBusinessSession()
  const seats = session.profile?.team_size ?? 0
  const company = session.profile?.company_name ?? 'your company'
  return (
    <Shell
      title="Talents"
      text={`The people LPO assigns to ${company}. Seats open after a contract is approved.`}
    >
      {seats > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: seats }, (_, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT, delay: index * 0.04 }}
              className="rounded-[24px] bg-white p-5 ring-1 ring-[#07101f]/[0.06]"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-[#f3f5f9] text-sm font-extrabold text-[#07101f]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="mt-4 font-extrabold">Seat {index + 1}</p>
              <p className="mt-1 text-sm text-muted-foreground">Awaiting assignment</p>
            </motion.article>
          ))}
        </div>
      ) : (
        <EmptyBoard
          icon={Users}
          title="No talents assigned"
          columns={['Proposed', 'Interview', 'Onboarding', 'Active']}
          text="Talent seats are confirmed when LPO approves a contract and scopes your team."
        />
      )}
    </Shell>
  )
}

export function TasksPage() {
  const { session } = useBusinessSession()
  const company = session.profile?.company_name ?? 'your company'
  return (
    <Shell
      title="Task"
      text={`Delivery work for ${company}. Tasks are created once your assigned talents are in place.`}
    >
      <EmptyBoard
        icon={ListTodo}
        title="No tasks yet"
        columns={['To do', 'In progress', 'In review', 'Done']}
        text="Your team’s tasks will be listed here after the agreement is approved and work begins."
      />
    </Shell>
  )
}

export function ReportsPage() {
  const { session } = useBusinessSession()
  const { labelFor } = useServiceCatalog()
  const profile = session.profile
  const extras = readExtraContracts(session.user.id)
  const intake = profileContract(profile)
  const contracts = intake ? 1 + extras.length : extras.length
  const pending = (intake && intake.status === 'pending_admin' ? 1 : 0) + extras.filter((item) => item.status === 'pending_admin').length
  const services = profile?.services ?? []

  const cards = [
    { label: 'Contracts', value: String(contracts), hint: `${pending} waiting on admin` },
    { label: 'Services', value: String(services.length), hint: 'Requested by your company' },
    { label: 'Leads', value: '0', hint: 'None recorded yet' },
    { label: 'Open tasks', value: '0', hint: 'Delivery has not started' },
  ]

  return (
    <Shell
      title="Reports"
      text="A private summary of your engagement. Figures come from your company profile and contract requests."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-2xl bg-white px-5 py-5 ring-1 ring-[#07101f]/[0.06]">
            <p className="text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">{card.label}</p>
            <p className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">{card.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{card.hint}</p>
          </article>
        ))}
      </div>
      <section className="mt-6 rounded-[28px] bg-[#07101f] p-6 text-white sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-lpo-yellow text-lpo-ink">
            <BarChart3 className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-extrabold">Engagement brief</h2>
            <p className="text-sm text-white/55">{profile?.company_name ?? 'Your company'}</p>
          </div>
        </div>
        <ul className="mt-6 space-y-3">
          {(services.length ? services : ['No services requested yet']).map((service) => (
            <li key={service} className="flex items-center justify-between border-b border-white/10 pb-3 text-sm last:border-0">
              <span className="font-bold">{services.length ? labelFor(service) : service}</span>
              <span className="text-white/45">{services.length ? 'In agreement' : '—'}</span>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  )
}
