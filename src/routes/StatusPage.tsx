import { useQuery } from '@tanstack/react-query'
import {
  Database,
  LoaderCircle,
  MonitorSmartphone,
  RefreshCw,
  Server,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { API_ROOT_URL } from '@/lib/api'
import { cn } from '@/lib/utils'
import { systemService } from '@/services/systemService'

type Status = 'ok' | 'error' | 'loading'

const STATUS_LABEL: Record<Status, string> = {
  ok: 'Operational',
  error: 'Unavailable',
  loading: 'Checking…',
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold',
        status === 'ok' && 'bg-emerald-50 text-emerald-700',
        status === 'error' && 'bg-rose-50 text-rose-700',
        status === 'loading' && 'bg-secondary text-primary',
      )}
    >
      {status === 'loading' ? (
        <LoaderCircle className="size-3.5 animate-spin" />
      ) : (
        <span className="relative flex size-2">
          {status === 'ok' && (
            <span className="status-ping absolute inline-flex size-full rounded-full bg-emerald-500" />
          )}
          <span
            className={cn(
              'relative inline-flex size-2 rounded-full',
              status === 'ok' ? 'bg-emerald-500' : 'bg-rose-500',
            )}
          />
        </span>
      )}
      {STATUS_LABEL[status]}
    </span>
  )
}

function StatusCard({
  icon,
  title,
  subtitle,
  status,
  rows,
  footer,
  className,
}: {
  icon: ReactNode
  title: string
  subtitle: string
  status: Status
  rows: Array<[string, ReactNode]>
  footer?: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'flex flex-col rounded-2xl border bg-card p-5 shadow-[0_1px_2px_rgb(15_42_74/0.04),0_8px_24px_-12px_rgb(15_42_74/0.12)]',
        status === 'error' && 'border-rose-200',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
            {icon}
          </div>
          <div>
            <h2 className="text-base font-semibold text-primary">{title}</h2>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <dl className="mt-5 space-y-2.5 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="truncate text-right font-mono text-xs text-foreground">
              {value ?? '—'}
            </dd>
          </div>
        ))}
      </dl>

      {footer && (
        <div className="mt-4 border-t pt-3 text-xs text-muted-foreground">
          {footer}
        </div>
      )}
    </section>
  )
}

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-secondary px-1 py-0.5 font-mono text-[0.7rem] text-primary">
      {children}
    </code>
  )
}

export default function StatusPage() {
  const apiInfo = useQuery({
    queryKey: ['system', 'api-info'],
    queryFn: systemService.getApiInfo,
    refetchInterval: 15_000,
  })

  const health = useQuery({
    queryKey: ['system', 'health'],
    queryFn: systemService.getHealth,
    refetchInterval: 15_000,
  })

  const backendStatus: Status =
    apiInfo.isPending || health.isPending
      ? 'loading'
      : apiInfo.isSuccess && health.isSuccess
        ? 'ok'
        : 'error'

  const db = health.data?.database
  const databaseStatus: Status = health.isPending
    ? 'loading'
    : db?.status === 'ok'
      ? 'ok'
      : 'error'

  const allOk = backendStatus === 'ok' && databaseStatus === 'ok'
  const anyLoading = backendStatus === 'loading' || databaseStatus === 'loading'
  const isRefreshing = apiInfo.isFetching || health.isFetching

  const refresh = () => {
    void apiInfo.refetch()
    void health.refetch()
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 70% 50% at 10% 10%, rgb(15 42 74 / 0.08), transparent 55%), radial-gradient(ellipse 55% 45% at 95% 90%, rgb(20 184 166 / 0.10), transparent 50%)',
        }}
      />
      <div
        aria-hidden
        className="status-orb pointer-events-none absolute -left-24 top-16 size-72 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="status-orb pointer-events-none absolute -right-20 bottom-0 size-80 rounded-full bg-accent/15 blur-3xl"
        style={{ animationDelay: '1.4s' }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <header className="status-rise flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/brand/lpo-mark.png"
                alt=""
                className="size-11 rounded-xl"
              />
              <span className="text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                LPO Platform
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
              {anyLoading
                ? 'Checking system status…'
                : allOk
                  ? 'All systems operational'
                  : 'Some systems need attention'}
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Foundation is ready. Frontend, backend API, and database are
              checked live every 15 seconds.
            </p>
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2 text-sm font-medium text-primary shadow-sm transition hover:bg-secondary disabled:opacity-60"
          >
            <RefreshCw
              className={cn('size-4', isRefreshing && 'animate-spin')}
            />
            Refresh
          </button>
        </header>

        <div className="status-rise-delay mt-10 grid gap-5 md:grid-cols-3">
          <StatusCard
            icon={<MonitorSmartphone className="size-5" />}
            title="Frontend"
            subtitle="lpo-core · React + Vite"
            status="ok"
            rows={[
              ['Mode', import.meta.env.MODE],
              ['Origin', window.location.origin],
              ['API base', API_ROOT_URL],
            ]}
            footer="Rendered in your browser — the UI is running."
          />

          <StatusCard
            icon={<Server className="size-5" />}
            title="Backend API"
            subtitle="lpo-ws · Laravel"
            status={backendStatus}
            rows={[
              ['Service', apiInfo.data?.service],
              ['Version', apiInfo.data?.version],
              ['Environment', health.data?.env],
              ['Laravel', health.data?.laravel],
              ['PHP', health.data?.php],
            ]}
            footer={
              backendStatus === 'error' ? (
                <span className="text-rose-700">
                  Cannot reach the API. Start <Code>lpo-ws</Code> with{' '}
                  <Code>php artisan serve</Code>.
                </span>
              ) : (
                <>
                  <Code>GET /api</Code> and <Code>GET /api/health</Code>{' '}
                  responding.
                </>
              )
            }
          />

          <StatusCard
            icon={<Database className="size-5" />}
            title="Database"
            subtitle="MySQL via Laravel"
            status={databaseStatus}
            rows={[
              ['Driver', db?.driver],
              ['Database', db?.name],
              ['Server', db?.version],
              ['Migrations', db?.migrations],
              [
                'Latency',
                db?.latency_ms != null ? `${db.latency_ms} ms` : undefined,
              ],
            ]}
            footer={
              databaseStatus === 'error' ? (
                <span className="text-rose-700">
                  {db?.error ??
                    'No database status (backend unreachable).'}{' '}
                  Start MySQL in XAMPP and check <Code>DB_*</Code> in{' '}
                  <Code>.env</Code>.
                </span>
              ) : (
                'Connection and query check passed.'
              )
            }
          />
        </div>

        <section className="status-rise-delay-2 mt-8 overflow-hidden rounded-2xl bg-primary text-primary-foreground">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-xs">
            <span className="font-mono">GET {API_ROOT_URL}/health</span>
            <span className="text-primary-foreground/60">
              {health.dataUpdatedAt
                ? `Updated ${new Date(health.dataUpdatedAt).toLocaleTimeString()}`
                : 'Waiting for response…'}
            </span>
          </div>
          <pre className="max-h-72 overflow-auto p-5 font-mono text-xs leading-relaxed">
            {health.isError
              ? (health.error).message
              : health.data
                ? JSON.stringify(health.data, null, 2)
                : '…'}
          </pre>
        </section>
      </div>
    </main>
  )
}
