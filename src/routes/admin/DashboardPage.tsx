import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  FileWarning,
  Handshake,
  Inbox,
  LoaderCircle,
  RefreshCw,
  ScrollText,
  TrendingUp,
  UsersRound,
  Wallet,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { AdminDashboard } from '@/types/dashboard'
import { EASE_OUT } from '@/components/home/ui'
import { parseApiError } from '@/lib/apiErrors'
import { CLIENT_STATUSES, clientStatusMeta, formatMoney } from '@/lib/clientOptions'
import { formatDate, talentStatusMeta } from '@/lib/talentStatus'
import { cn } from '@/lib/utils'
import { adminDashboardKeys, adminDashboardService } from '@/services/adminDashboardService'

const CHART_TALENT = '#0b2559'
const CHART_CLIENT = '#1463ff'
const SERVICE_COLORS = ['#0b2559', '#1463ff', '#d4a017', '#0f766e', '#475569', '#b45309']

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-lpo-navy/10 bg-white px-2.5 py-2 text-[11px] shadow-lg">
      <p className="font-semibold text-muted-foreground">{label}</p>
      <div className="mt-1 space-y-0.5">
        {payload.map((item) => (
          <p key={item.name} className="flex items-center gap-2 font-medium text-lpo-ink">
            <span className="size-1.5 rounded-full" style={{ background: item.color }} />
            <span className="capitalize text-muted-foreground">{item.name}</span>
            <span className="ml-auto tabular-nums">{item.value}</span>
          </p>
        ))}
      </div>
    </div>
  )
}

function KpiCell({
  icon: Icon,
  label,
  value,
  hint,
  accent,
  to,
}: {
  icon: LucideIcon
  label: string
  value: string | number
  hint: string
  accent: string
  to?: string
}) {
  const content = (
    <>
      <div className="flex items-center gap-2">
        <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-md text-white', accent)}>
          <Icon className="size-3.5" />
        </span>
        <span className="truncate text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {label}
        </span>
      </div>
      <p className="mt-2.5 truncate text-[1.35rem] font-semibold tracking-[-0.02em] text-lpo-ink tabular-nums">
        {value}
      </p>
      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{hint}</p>
    </>
  )

  const className =
    'min-w-0 bg-white px-4 py-3.5 transition-colors hover:bg-lpo-surface/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lpo-blue/30'

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    )
  }

  return <div className={className}>{content}</div>
}

function Panel({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'min-w-0 rounded-xl bg-white p-4 ring-1 ring-lpo-navy/[0.07] sm:p-5',
        className,
      )}
    >
      <div className="mb-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[13px] font-semibold text-lpo-ink">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function PipelineBars({
  items,
  meta,
}: {
  items: Array<{ status: string; count: number }>
  meta: (status: string) => { label: string; soft: string; dot: string }
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0) || 1

  return (
    <div className="space-y-2.5">
      {items.map((item) => {
        const info = meta(item.status)
        const pct = Math.round((item.count / total) * 100)
        return (
          <div key={item.status}>
            <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
              <span className="font-medium text-lpo-ink">{info.label}</span>
              <span className="tabular-nums text-muted-foreground">
                {item.count}
                <span className="text-muted-foreground/70"> · {pct}%</span>
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-lpo-surface">
              <div
                className={cn('h-full rounded-full transition-[width] duration-700', info.dot)}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function AttentionItem({
  icon: Icon,
  label,
  count,
  to,
  tone,
}: {
  icon: LucideIcon
  label: string
  count: number
  to: string
  tone: string
}) {
  return (
    <Link
      to={to}
      className="group flex min-w-0 items-center gap-2.5 rounded-lg border border-lpo-navy/[0.06] bg-lpo-surface/40 px-3 py-2.5 transition-colors hover:bg-lpo-surface"
    >
      <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-md text-white', tone)}>
        <Icon className="size-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold text-lpo-ink tabular-nums">{count}</span>
        <span className="block truncate text-[11px] text-muted-foreground">{label}</span>
      </span>
      <ArrowRight className="size-3.5 shrink-0 text-muted-foreground/70 transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

function RecentRow({
  name,
  detail,
  badge,
  badgeClass,
  avatarClass,
}: {
  name: string
  detail: string
  badge: string
  badgeClass: string
  avatarClass: string
}) {
  return (
    <li className="flex min-w-0 items-center gap-2.5 border-t border-lpo-navy/[0.05] py-2.5 first:border-0 first:pt-0 last:pb-0">
      <span
        className={cn(
          'flex size-7 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold text-white',
          avatarClass,
        )}
      >
        {initials(name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12px] font-medium text-lpo-ink">{name}</span>
        <span className="block truncate text-[11px] text-muted-foreground">{detail}</span>
      </span>
      <span
        className={cn(
          'max-w-[7.5rem] shrink-0 truncate rounded px-1.5 py-0.5 text-[10px] font-semibold ring-1',
          badgeClass,
        )}
      >
        {badge}
      </span>
    </li>
  )
}

function DashboardBody({
  data,
  onRefresh,
  refreshing,
}: {
  data: AdminDashboard
  onRefresh: () => void
  refreshing: boolean
}) {
  const { summary, needs_attention: attention } = data
  const primaryValue =
    summary.monthly_value_by_currency.length > 0
      ? summary.monthly_value_by_currency[0]
      : null
  const signupTotal = data.registrations.reduce((sum, day) => sum + day.total, 0)
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const talentMeta = (status: string) => talentStatusMeta(status as never)
  const clientMeta = (status: string) => clientStatusMeta(status as never)

  return (
    <div className="w-full min-w-0">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
        className="flex flex-wrap items-end justify-between gap-3"
      >
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground">{today}</p>
          <h1 className="mt-0.5 text-[1.35rem] font-semibold tracking-[-0.02em] text-lpo-ink">
            {greeting()} — operations overview
          </h1>
          <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-muted-foreground">
            Pipeline health, registrations, and service demand from your live modules.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-lpo-surface px-2.5 py-1.5 text-[11px] font-medium text-lpo-ink">
            Pipeline{' '}
            <span className="font-semibold tabular-nums">
              {summary.pipeline_talents + summary.pipeline_clients}
            </span>
          </span>
          <span className="rounded-md bg-lpo-surface px-2.5 py-1.5 text-[11px] font-medium text-lpo-ink">
            30-day joins <span className="font-semibold tabular-nums">{signupTotal}</span>
          </span>
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-white px-2.5 text-[11px] font-semibold text-lpo-navy hover:bg-lpo-surface disabled:opacity-60"
          >
            <RefreshCw className={cn('size-3.5', refreshing && 'animate-spin')} />
            Refresh
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.04 }}
        className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-lpo-navy/[0.08] ring-1 ring-lpo-navy/[0.07] lg:grid-cols-5"
      >
        <KpiCell
          icon={UsersRound}
          label="Talents"
          value={summary.talents}
          hint={`${summary.active_talents} active · ${summary.pipeline_talents} in review`}
          accent="bg-lpo-navy"
          to="/admin/talents"
        />
        <KpiCell
          icon={Building2}
          label="Clients"
          value={summary.clients}
          hint={`${summary.active_clients} active · ${summary.pipeline_clients} pipeline`}
          accent="bg-lpo-blue"
          to="/admin/clients"
        />
        <KpiCell
          icon={BriefcaseBusiness}
          label="Services"
          value={summary.services}
          hint={`${summary.services_total} in catalog`}
          accent="bg-[#b8960f]"
          to="/admin/services"
        />
        <KpiCell
          icon={Handshake}
          label="Active seats"
          value={summary.active_seats}
          hint="On active contracts"
          accent="bg-emerald-600"
          to="/admin/clients"
        />
        <KpiCell
          icon={Wallet}
          label="Monthly value"
          value={
            primaryValue ? formatMoney(primaryValue.amount, primaryValue.currency) : '—'
          }
          hint={
            summary.monthly_value_by_currency.length > 1
              ? `${summary.monthly_value_by_currency.length} currencies`
              : 'Active engagements'
          }
          accent="bg-teal-700"
        />
      </motion.div>

      <div className="mt-4 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.85fr)]">
        <Panel
          title="Registrations"
          subtitle="New talents and clients · last 30 days"
          action={
            <span className="inline-flex items-center gap-1 rounded-md bg-lpo-surface px-2 py-1 text-[10px] font-semibold text-lpo-navy">
              <TrendingUp className="size-3" />
              {signupTotal} total
            </span>
          }
        >
          <div className="mb-2 flex gap-4 text-[11px] font-medium text-lpo-ink">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ background: CHART_TALENT }} />
              Talents
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ background: CHART_CLIENT }} />
              Clients
            </span>
          </div>
          <div className="h-[210px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.registrations} margin={{ top: 6, right: 4, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="talentFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_TALENT} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={CHART_TALENT} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="clientFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_CLIENT} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={CHART_CLIENT} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(11,37,89,0.07)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  minTickGap={32}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={28}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="talents"
                  name="talents"
                  stroke={CHART_TALENT}
                  strokeWidth={1.8}
                  fill="url(#talentFill)"
                  activeDot={{ r: 3, strokeWidth: 0 }}
                />
                <Area
                  type="monotone"
                  dataKey="clients"
                  name="clients"
                  stroke={CHART_CLIENT}
                  strokeWidth={1.8}
                  fill="url(#clientFill)"
                  activeDot={{ r: 3, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Needs attention" subtitle="Items that usually need action first">
          <div className="grid gap-2">
            <AttentionItem
              icon={FileWarning}
              label="Talents missing a CV"
              count={attention.talents_missing_cv}
              to="/admin/talents"
              tone="bg-amber-500"
            />
            <AttentionItem
              icon={Inbox}
              label="New client inquiries"
              count={attention.clients_new_inquiry}
              to="/admin/clients"
              tone="bg-amber-600"
            />
            <AttentionItem
              icon={UsersRound}
              label="Talents for assessment"
              count={attention.talents_for_assessment}
              to="/admin/talents"
              tone="bg-lpo-navy"
            />
            <AttentionItem
              icon={ScrollText}
              label="Clients in proposal"
              count={attention.clients_in_proposal}
              to="/admin/clients"
              tone="bg-lpo-blue"
            />
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-2">
        <Panel title="Talent pipeline" subtitle="Candidate status mix">
          <PipelineBars items={data.talent_pipeline} meta={talentMeta} />
        </Panel>
        <Panel title="Client pipeline" subtitle="Company account status mix">
          <PipelineBars
            items={data.client_pipeline.filter((p) =>
              CLIENT_STATUSES.some((s) => s.value === p.status),
            )}
            meta={clientMeta}
          />
        </Panel>
      </div>

      <div className="mt-4 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Panel title="Service demand" subtitle="Most selected services by clients">
          <div className="h-[220px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.top_services}
                layout="vertical"
                margin={{ top: 2, right: 8, left: 0, bottom: 2 }}
              >
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(11,37,89,0.07)" horizontal={false} />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={108}
                  tick={{ fill: '#0b2559', fontSize: 10, fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip cursor={{ fill: 'rgba(11,37,89,0.04)' }} content={<ChartTooltip />} />
                <Bar dataKey="count" name="clients" radius={[0, 4, 4, 0]} barSize={12}>
                  {data.top_services.map((_, i) => (
                    <Cell key={i} fill={SERVICE_COLORS[i % SERVICE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <Panel
            title="Recent talents"
            action={
              <Link to="/admin/talents" className="text-[11px] font-semibold text-lpo-blue hover:underline">
                View all
              </Link>
            }
          >
            <ul>
              {data.recent_talents.length === 0 && (
                <li className="py-6 text-center text-[12px] text-muted-foreground">No talents yet.</li>
              )}
              {data.recent_talents.map((talent) => {
                const status = talentStatusMeta(talent.status)
                return (
                  <RecentRow
                    key={talent.id}
                    name={talent.name}
                    detail={talent.desired_position ?? talent.email}
                    badge={status.label}
                    badgeClass={status.badge}
                    avatarClass="bg-lpo-navy"
                  />
                )
              })}
            </ul>
          </Panel>

          <Panel
            title="Recent clients"
            action={
              <Link to="/admin/clients" className="text-[11px] font-semibold text-lpo-blue hover:underline">
                View all
              </Link>
            }
          >
            <ul>
              {data.recent_clients.length === 0 && (
                <li className="py-6 text-center text-[12px] text-muted-foreground">No clients yet.</li>
              )}
              {data.recent_clients.map((client) => {
                const status = clientStatusMeta(client.status)
                return (
                  <RecentRow
                    key={client.id}
                    name={client.company_name ?? client.name}
                    detail={`${client.name} · ${formatDate(client.created_at)}`}
                    badge={status.label}
                    badgeClass={status.badge}
                    avatarClass="bg-lpo-blue"
                  />
                )
              })}
            </ul>
          </Panel>
        </div>
      </div>

      <p className="mt-4 text-[11px] text-muted-foreground">
        Live from talents, clients, and services · refreshed {formatDate(data.generated_at)}
      </p>
    </div>
  )
}

export default function DashboardPage() {
  const query = useQuery({
    queryKey: adminDashboardKeys.all,
    queryFn: adminDashboardService.get,
    refetchInterval: 60_000,
  })

  if (query.isPending) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-muted-foreground">
        <LoaderCircle className="size-6 animate-spin text-lpo-navy" />
        <p className="text-[13px] font-medium">Loading dashboard…</p>
      </div>
    )
  }

  if (query.isError) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-xl bg-white px-6 py-12 text-center ring-1 ring-lpo-navy/[0.07]">
        <span className="flex size-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
          <AlertTriangle className="size-5" />
        </span>
        <h1 className="mt-3 text-[15px] font-semibold text-lpo-ink">Could not load dashboard</h1>
        <p className="mt-1 text-[12px] text-muted-foreground">
          {parseApiError(query.error, 'Something went wrong loading the overview.').message}
        </p>
        <button
          type="button"
          onClick={() => void query.refetch()}
          className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-lpo-navy px-3 py-2 text-[12px] font-semibold text-white"
        >
          <RefreshCw className="size-3.5" />
          Try again
        </button>
      </div>
    )
  }

  return (
    <DashboardBody
      data={query.data}
      onRefresh={() => void query.refetch()}
      refreshing={query.isFetching}
    />
  )
}
