import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, LoaderCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type StatusOption<TValue extends string> = {
  value: TValue
  label: string
  description: string
  icon: LucideIcon
  badge: string
  dot: string
  solid: string
  soft: string
  /** Shown after the numbered pipeline stages (e.g. paused or ended). */
  offPipeline?: boolean
}

function findOption<TValue extends string>(
  options: ReadonlyArray<StatusOption<TValue>>,
  value: TValue,
): StatusOption<TValue> {
  return options.find((o) => o.value === value) ?? options[0]
}

export function StatusBadge<TValue extends string>({
  options,
  status,
  className,
}: {
  options: ReadonlyArray<StatusOption<TValue>>
  status: TValue
  className?: string
}) {
  const meta = findOption(options, status)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-medium whitespace-nowrap ring-1',
        meta.badge,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', meta.dot)} />
      {meta.label}
    </span>
  )
}

/** Status badge that opens a menu for admins to change the status. */
export function StatusMenu<TValue extends string>({
  options,
  status,
  loading,
  onChange,
}: {
  options: ReadonlyArray<StatusOption<TValue>>
  status: TValue
  loading?: boolean
  onChange: (status: TValue) => void
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const open = position !== null
  const meta = findOption(options, status)
  const stages = options.filter((o) => !o.offPipeline)
  const extras = options.filter((o) => o.offPipeline)

  // Flip above the badge when the measured menu would overflow the viewport.
  useLayoutEffect(() => {
    const menu = menuRef.current
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!open || !menu || !rect) return
    const height = menu.offsetHeight
    if (rect.bottom + 8 + height <= window.innerHeight - 12) return
    const above = rect.top - 8 - height
    const top = above >= 12 ? above : Math.max(12, window.innerHeight - 12 - height)
    setPosition((current) => (current && current.top !== top ? { ...current, top } : current))
  }, [open])

  useEffect(() => {
    if (!open) return
    const close = () => setPosition(null)
    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node
      if (!menuRef.current?.contains(target) && !buttonRef.current?.contains(target)) close()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close, true)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [open])

  const toggle = () => {
    if (open) return setPosition(null)
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return
    const width = 288
    setPosition({
      top: rect.bottom + 8,
      left: Math.min(Math.max(12, rect.left), window.innerWidth - width - 12),
    })
  }

  const item = (option: StatusOption<TValue>, number?: number) => {
    const Icon = option.icon
    const current = option.value === status
    return (
      <button
        key={option.value}
        type="button"
        role="menuitemradio"
        aria-checked={current}
        onClick={() => {
          setPosition(null)
          if (!current) onChange(option.value)
        }}
        className={cn(
          'flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
          current ? 'bg-lpo-surface' : 'hover:bg-lpo-surface/70',
        )}
      >
        <span className={cn('mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg', option.soft)}>
          <Icon className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 text-[13px] font-medium text-lpo-ink">
            {number !== undefined && (
              <span className="text-[10px] font-medium text-muted-foreground">{number}.</span>
            )}
            {option.label}
          </span>
          <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
            {option.description}
          </span>
        </span>
        {current && <Check className="mt-1 size-4 text-lpo-blue" strokeWidth={3} />}
      </button>
    )
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        disabled={loading}
        onClick={(e) => {
          e.stopPropagation()
          toggle()
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'group inline-flex items-center gap-1.5 rounded-full py-0.5 pr-1.5 pl-2.5 text-[12px] font-medium whitespace-nowrap ring-1 transition-shadow hover:shadow-[0_6px_16px_-8px_rgb(11_37_89/0.5)] disabled:cursor-wait',
          meta.badge,
        )}
      >
        {loading ? (
          <LoaderCircle className="size-3 animate-spin" />
        ) : (
          <span className={cn('size-1.5 rounded-full', meta.dot)} />
        )}
        {meta.label}
        <ChevronDown className={cn('size-3.5 opacity-60 transition-transform', open && 'rotate-180')} />
      </button>

      {createPortal(
        <AnimatePresence>
          {position && (
            <motion.div
              ref={menuRef}
              role="menu"
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.16 }}
              style={{ top: position.top, left: position.left }}
              onClick={(e) => e.stopPropagation()}
              className="fixed z-[70] w-72 origin-top-left rounded-2xl bg-white p-1.5 shadow-[0_24px_60px_-20px_rgb(11_37_89/0.45)] ring-1 ring-lpo-navy/10"
            >
              <p className="px-3 pt-2 pb-1.5 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                Change status
              </p>
              {stages.map((option, i) => item(option, i + 1))}
              {extras.length > 0 && <div className="mx-3 my-1 h-px bg-lpo-navy/[0.07]" />}
              {extras.map((option) => item(option))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
