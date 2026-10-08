import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, LoaderCircle, X } from 'lucide-react'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { StatusOption } from '@/components/admin/StatusMenu'
import { cn } from '@/lib/utils'

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

/** Right-side detail panel with backdrop, Escape to close, and body scroll lock. */
export function DrawerShell({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean
  onClose: () => void
  label: string
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-lpo-ink/40 backdrop-blur-[2px]"
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label={label}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-[480px] flex-col bg-white shadow-[-30px_0_80px_-30px_rgb(11_37_89/0.45)]"
          >
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export function DrawerHeader({
  eyebrow,
  avatar,
  title,
  subtitle,
  badge,
  action,
  onClose,
}: {
  eyebrow: string
  avatar: string
  title: string
  subtitle: ReactNode
  badge: ReactNode
  action?: ReactNode
  onClose: () => void
}) {
  return (
    <div className="relative shrink-0 overflow-hidden bg-lpo-navy px-6 pt-5 pb-6 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full border-[30px] border-lpo-yellow/10"
      />
      <div className="relative flex items-center justify-between">
        <span className="text-[10.5px] font-medium tracking-wider text-white/50 uppercase">{eyebrow}</span>
        <div className="flex items-center gap-1">
          {action}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="size-[18px]" />
          </button>
        </div>
      </div>
      <div className="relative mt-4 flex items-center gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-lpo-yellow text-lg font-semibold text-lpo-ink">
          {avatar}
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold">{title}</h2>
          <p className="truncate text-[13px] text-white/60">{subtitle}</p>
          <div className="mt-2">{badge}</div>
        </div>
      </div>
    </div>
  )
}

export function DrawerSection({
  title,
  action,
  children,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="border-t border-lpo-navy/[0.06] px-6 py-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[10.5px] font-medium tracking-wider text-muted-foreground uppercase">{title}</h3>
        {action}
      </div>
      <div className="mt-3.5">{children}</div>
    </section>
  )
}

export function DrawerInfo({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-lpo-surface text-lpo-navy/70">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] text-muted-foreground">{label}</span>
        <span className="block text-[13px] font-medium break-words text-lpo-ink">{children}</span>
      </span>
    </div>
  )
}

/**
 * Clickable stage tracker. Options flagged `offPipeline` (e.g. Inactive) are not drawn as stages;
 * they appear as secondary actions instead.
 */
export function PipelineStepper<TValue extends string>({
  options,
  status,
  changing,
  onChange,
  noun,
}: {
  options: ReadonlyArray<StatusOption<TValue>>
  status: TValue
  changing: boolean
  onChange: (status: TValue) => void
  noun: string
}) {
  const stages = options.filter((o) => !o.offPipeline)
  const extras = options.filter((o) => o.offPipeline)
  const current = stages.findIndex((o) => o.value === status)
  const last = stages.length - 1
  const meta = options.find((o) => o.value === status) ?? stages[0]
  const next = current >= 0 && current < last ? stages[current + 1] : undefined
  const edge = 100 / (2 * stages.length)

  return (
    <div>
      <div className="relative flex items-start justify-between">
        <div
          aria-hidden
          className="absolute top-[18px] h-0.5 rounded-full bg-lpo-navy/[0.08]"
          style={{ left: `${edge}%`, right: `${edge}%` }}
        />
        <motion.div
          aria-hidden
          className="absolute top-[18px] h-0.5 rounded-full bg-gradient-to-r from-amber-400 via-lpo-blue to-emerald-500"
          style={{ left: `${edge}%` }}
          initial={false}
          animate={{ width: `${current > 0 ? (current / last) * (100 - 2 * edge) : 0}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        {stages.map((option, i) => {
          const Icon = option.icon
          const active = i === current
          const done = current >= 0 && (i < current || (active && i === last))
          return (
            <button
              key={option.value}
              type="button"
              disabled={changing || active}
              onClick={() => onChange(option.value)}
              className="group relative z-10 flex flex-1 flex-col items-center gap-1.5 text-center disabled:cursor-default"
            >
              <motion.span
                initial={false}
                animate={{ scale: active ? 1.08 : 1 }}
                className={cn(
                  'flex size-9 items-center justify-center rounded-full ring-4 ring-white transition-colors duration-300',
                  done || active ? option.solid : 'bg-lpo-surface text-lpo-navy/40 group-hover:text-lpo-navy',
                  active && i !== last && 'shadow-[0_0_0_6px_rgb(20_99_255/0.12)]',
                )}
              >
                {done && !active ? <Check className="size-4" strokeWidth={3} /> : <Icon className="size-4" />}
              </motion.span>
              <span
                className={cn(
                  'text-[11.5px] leading-tight font-medium',
                  active ? 'text-lpo-ink' : 'text-muted-foreground group-hover:text-lpo-ink',
                )}
              >
                {option.label}
              </span>
            </button>
          )
        })}
      </div>

      <div className={cn('mt-4 rounded-xl p-3.5', meta.soft)}>
        <p className="text-[13px] font-semibold">Currently {meta.label}</p>
        <p className="mt-0.5 text-[12px] leading-relaxed opacity-80">{meta.description}</p>
      </div>

      {next && (
        <button
          type="button"
          disabled={changing}
          onClick={() => onChange(next.value)}
          className="lpo-shine group mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-lpo-navy text-[13px] font-semibold text-white shadow-[0_12px_26px_-14px_rgb(11_37_89/0.8)] transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
        >
          {changing ? <LoaderCircle className="size-4 animate-spin" /> : null}
          Move to {next.label}
          {!changing && <ArrowRight className="size-4 text-lpo-yellow transition-transform group-hover:translate-x-1" />}
        </button>
      )}

      {current < 0 && (
        <button
          type="button"
          disabled={changing}
          onClick={() => onChange(stages[last].value)}
          className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-[13px] font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70"
        >
          {changing && <LoaderCircle className="size-4 animate-spin" />}
          Reactivate as {stages[last].label}
        </button>
      )}

      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[11px] text-muted-foreground">
        <span>Click any stage to move the {noun} back or forward.</span>
        {current >= 0 &&
          extras.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={changing}
              onClick={() => onChange(option.value)}
              className="font-medium text-rose-600 hover:underline disabled:opacity-60"
            >
              Mark as {option.label.toLowerCase()}
            </button>
          ))}
      </div>
    </div>
  )
}
