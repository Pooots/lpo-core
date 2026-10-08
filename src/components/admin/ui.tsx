import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  SearchX,
  X,
} from 'lucide-react'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { EASE_OUT } from '@/components/home/ui'
import { cn } from '@/lib/utils'

export type ListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

export function useDebounced<TValue>(value: TValue, ms: number): TValue {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), ms)
    return () => window.clearTimeout(id)
  }, [value, ms])
  return debounced
}

export type Notice = { id: number; tone: 'success' | 'error'; message: string }

export function useNotice() {
  const [notice, setNotice] = useState<Notice | null>(null)
  const notify = useCallback((tone: Notice['tone'], message: string) => {
    setNotice({ id: Date.now(), tone, message })
  }, [])

  useEffect(() => {
    if (!notice) return
    const id = window.setTimeout(() => setNotice(null), 3500)
    return () => window.clearTimeout(id)
  }, [notice])

  return { notice, notify }
}

export function NoticeToast({ notice }: { notice: Notice | null }) {
  return (
    <AnimatePresence>
      {notice && (
        <motion.div
          key={notice.id}
          role="status"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          className={cn(
            'fixed right-5 bottom-5 z-[80] flex max-w-sm items-center gap-2.5 rounded-xl px-4 py-3 text-[13px] font-medium shadow-[0_24px_50px_-20px_rgb(11_37_89/0.6)]',
            notice.tone === 'success' ? 'bg-lpo-navy text-white' : 'bg-rose-600 text-white',
          )}
        >
          {notice.tone === 'success' ? (
            <CircleCheck className="size-4 shrink-0 text-lpo-yellow" />
          ) : (
            <AlertTriangle className="size-4 shrink-0" />
          )}
          {notice.message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function PageHeader({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        <h1 className="text-xl font-semibold tracking-tight text-lpo-ink">{title}</h1>
        <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p>
      </motion.div>
      <motion.button
        type="button"
        onClick={onAction}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        className="lpo-shine group inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-lpo-yellow px-3.5 text-[13px] font-semibold text-lpo-ink shadow-[0_8px_20px_-12px_rgb(255_199_0/1)] transition-colors hover:bg-[#ffcf24]"
      >
        <Plus className="size-3.5 transition-transform duration-300 group-hover:rotate-90" strokeWidth={2.75} />
        {actionLabel}
      </motion.button>
    </div>
  )
}

export function StatCard({
  icon: Icon,
  label,
  caption,
  count,
  total,
  selected,
  accent,
  bar,
  index,
  badge = true,
  onClick,
}: {
  icon: LucideIcon
  label: string
  caption: string
  count: number
  total: number
  selected: boolean
  accent: string
  bar: string
  index: number
  badge?: boolean
  onClick: () => void
}) {
  const share = total > 0 ? Math.round((count / total) * 100) : 0

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.05 + index * 0.06 }}
      whileHover={{ y: -2 }}
      className={cn(
        'relative overflow-hidden rounded-xl bg-white p-4 text-left transition-shadow duration-300',
        selected
          ? 'shadow-[0_16px_36px_-24px_rgb(11_37_89/0.5)] ring-[1.5px] ring-lpo-navy'
          : 'shadow-[0_10px_30px_-26px_rgb(11_37_89/0.45)] ring-1 ring-lpo-navy/[0.07] hover:shadow-[0_16px_36px_-26px_rgb(11_37_89/0.5)]',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2.5">
          <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-md', accent)}>
            <Icon className="size-3.5" />
          </span>
          <span className="truncate text-[13px] font-medium text-lpo-ink">{label}</span>
        </span>
        <AnimatePresence>
          {selected && badge && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="shrink-0 rounded bg-lpo-navy px-1.5 py-0.5 text-[9.5px] font-semibold tracking-wide text-white uppercase"
            >
              Filtered
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-lpo-ink tabular-nums">{count}</p>
      <p className="text-[11.5px] text-muted-foreground">{caption}</p>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-lpo-navy/[0.06]">
        <motion.span
          className={cn('block h-full rounded-full', bar)}
          initial={{ width: 0 }}
          animate={{ width: `${share}%` }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.2 }}
        />
      </div>
    </motion.button>
  )
}

/** Toolbar above a list: search, active status filter chip, total, refresh. */
export function ListToolbar({
  search,
  onSearch,
  searching,
  placeholder,
  filterLabel,
  onClearFilter,
  total,
  noun,
  fetching,
  onRefresh,
}: {
  search: string
  onSearch: (value: string) => void
  searching: boolean
  placeholder: string
  filterLabel: string | null
  onClearFilter: () => void
  total: number | undefined
  noun: [singular: string, plural: string]
  fetching: boolean
  onRefresh: () => void
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-lpo-navy/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <label className="group flex h-9 w-full items-center gap-2 rounded-lg border border-border bg-lpo-surface/60 px-3 transition-all focus-within:border-lpo-blue focus-within:bg-white focus-within:ring-[3px] focus-within:ring-lpo-blue/10 sm:w-72">
          <Search className="size-3.5 text-muted-foreground group-focus-within:text-lpo-blue" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={placeholder}
            className="h-full w-full bg-transparent text-[13px] text-lpo-ink outline-none placeholder:text-muted-foreground/70"
          />
          {searching ? (
            <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
          ) : search ? (
            <button type="button" onClick={() => onSearch('')} aria-label="Clear search">
              <X className="size-4 text-muted-foreground hover:text-lpo-ink" />
            </button>
          ) : null}
        </label>
        <AnimatePresence>
          {filterLabel && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={onClearFilter}
              className="inline-flex items-center gap-1.5 rounded-md bg-lpo-navy px-2.5 py-1 text-[12px] font-medium text-white"
            >
              Status: {filterLabel}
              <X className="size-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
        {total !== undefined && (
          <span>
            <span className="font-semibold text-lpo-ink">{total}</span> {total === 1 ? noun[0] : noun[1]}
          </span>
        )}
        <button
          type="button"
          onClick={onRefresh}
          aria-label="Refresh"
          className="flex size-8 items-center justify-center rounded-md border border-border text-lpo-navy transition-colors hover:bg-lpo-surface"
        >
          <RefreshCw className={cn('size-3.5', fetching && 'animate-spin')} />
        </button>
      </div>
    </div>
  )
}

export function SkeletonRows({ widths }: { widths: Array<number> }) {
  return (
    <>
      {Array.from({ length: 6 }, (_, i) => (
        <tr key={i} className="border-t border-lpo-navy/[0.05]">
          {widths.map((w, j) => (
            <td key={j} className="px-4 py-3.5">
              <div className="flex items-center gap-3">
                {j === 0 && <span className="size-8 animate-pulse rounded-lg bg-lpo-navy/[0.06]" />}
                <span
                  className="h-3 animate-pulse rounded-full bg-lpo-navy/[0.06]"
                  style={{ width: `${w * 4}px` }}
                />
              </div>
            </td>
          ))}
          <td />
        </tr>
      ))}
    </>
  )
}

export function ListError({ title, message, onRetry }: { title: string; message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
        <AlertTriangle className="size-6" />
      </span>
      <p className="mt-4 text-sm font-semibold text-lpo-ink">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg bg-lpo-navy px-3.5 py-2 text-[13px] font-semibold text-white"
      >
        Try again
      </button>
    </div>
  )
}

export function ListEmpty({
  filtered,
  icon: Icon,
  title,
  filteredTitle,
  description,
  actionLabel,
  onAction,
}: {
  filtered: boolean
  icon: LucideIcon
  title: string
  filteredTitle: string
  description: ReactNode
  actionLabel: string
  onAction: () => void
}) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-lpo-surface text-lpo-navy/60">
        {filtered ? <SearchX className="size-7" /> : <Icon className="size-7" />}
      </span>
      <p className="mt-4 text-[15px] font-semibold text-lpo-ink">{filtered ? filteredTitle : title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {filtered ? 'Try a different search term or clear the status filter.' : description}
      </p>
      {!filtered && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-lpo-yellow px-3.5 py-2 text-[13px] font-semibold text-lpo-ink"
        >
          <Plus className="size-4" strokeWidth={3} />
          {actionLabel}
        </button>
      )}
    </div>
  )
}

function Pagination({
  page,
  lastPage,
  onChange,
}: {
  page: number
  lastPage: number
  onChange: (page: number) => void
}) {
  if (lastPage <= 1) return null
  const start = Math.max(1, Math.min(page - 2, lastPage - 4))
  const pages = Array.from({ length: Math.min(5, lastPage) }, (_, i) => start + i)

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="flex size-8 items-center justify-center rounded-md text-lpo-navy transition-colors hover:bg-lpo-surface disabled:opacity-30"
      >
        <ChevronLeft className="size-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          className={cn(
            'size-8 rounded-md text-[13px] font-medium transition-colors',
            p === page ? 'bg-lpo-navy text-white' : 'text-lpo-navy hover:bg-lpo-surface',
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= lastPage}
        aria-label="Next page"
        className="flex size-8 items-center justify-center rounded-md text-lpo-navy transition-colors hover:bg-lpo-surface disabled:opacity-30"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}

export function ListFooter({ meta, onPage }: { meta: ListMeta | undefined; onPage: (page: number) => void }) {
  if (!meta || meta.total === 0) return null
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-lpo-navy/[0.06] px-4 py-3 sm:flex-row">
      <p className="text-[12.5px] text-muted-foreground">
        Showing <span className="font-medium text-lpo-ink">{meta.from}</span>–
        <span className="font-medium text-lpo-ink">{meta.to}</span> of{' '}
        <span className="font-medium text-lpo-ink">{meta.total}</span>
      </p>
      <Pagination page={meta.current_page} lastPage={meta.last_page} onChange={onPage} />
    </div>
  )
}

export const LIST_CARD =
  'mt-4 overflow-hidden rounded-xl bg-white shadow-[0_10px_30px_-26px_rgb(11_37_89/0.45)] ring-1 ring-lpo-navy/[0.07]'

export const TH = 'px-4 py-2.5'
export const THEAD_ROW =
  'bg-lpo-surface/70 text-[11px] font-medium tracking-wider whitespace-nowrap text-muted-foreground uppercase'
