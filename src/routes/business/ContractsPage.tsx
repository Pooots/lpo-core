import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Plus, ShieldCheck } from 'lucide-react'
import { EASE_OUT } from '@/components/home/ui'
import { useServiceCatalog } from '@/hooks/useServiceCatalog'
import { cn } from '@/lib/utils'
import { useBusinessSession } from '@/routes/business/BusinessSession'
import {
  nextReference,
  profileContract,
  readExtraContracts,
  writeExtraContracts,
} from '@/routes/business/contracts'
import type { ClientContract } from '@/routes/business/contracts'

function formatWhen(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ContractsPage() {
  const { session } = useBusinessSession()
  const { options, labelFor } = useServiceCatalog()
  const profile = session.profile
  const [extras, setExtras] = useState<Array<ClientContract>>(() => readExtraContracts(session.user.id))
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Array<string>>([])
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)

  const contracts = useMemo(() => {
    const intake = profileContract(profile)
    return intake ? [intake, ...extras] : extras
  }, [extras, profile])

  const toggle = (value: string) => {
    setSelected((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    )
  }

  const submit = () => {
    if (selected.length === 0) {
      setError('Select at least one service. A contract can include several.')
      return
    }
    const next: ClientContract = {
      id: `request-${Date.now()}`,
      reference: nextReference(contracts.length),
      services: selected,
      note: note.trim() || 'Additional service request awaiting LPO admin approval.',
      createdAt: new Date().toISOString(),
      status: 'pending_admin',
      source: 'request',
    }
    const stored = [next, ...extras]
    writeExtraContracts(session.user.id, stored)
    setExtras(stored)
    setSelected([])
    setNote('')
    setError(null)
    setOpen(false)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[1.9rem] font-extrabold tracking-[-0.03em] text-lpo-ink">Contract</h1>
          <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Each contract is an agreement between your company and LPO, based on the services you request.
            Add as many services as you need to one request. LPO admin reviews and approves every contract.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex items-center gap-2 rounded-full bg-[#07101f] px-4 py-2.5 text-sm font-extrabold text-white"
        >
          <Plus className="size-4" />
          New contract request
        </button>
      </div>

      {open && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="mt-6 rounded-[28px] bg-white p-6 ring-1 ring-[#07101f]/[0.06] sm:p-8"
        >
          <h2 className="text-lg font-extrabold tracking-[-0.02em]">Services for this agreement</h2>
          <p className="mt-1 text-sm text-muted-foreground">Select one or more. This request stays pending until an admin approves it.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {options.map((service) => {
              const on = selected.includes(service.value)
              return (
                <button
                  key={service.value}
                  type="button"
                  onClick={() => toggle(service.value)}
                  className={cn(
                    'flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-colors',
                    on ? 'border-[#07101f] bg-[#07101f] text-white' : 'border-border bg-[#f7f8fb] hover:border-[#07101f]/30',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md',
                      on ? 'bg-lpo-yellow text-lpo-ink' : 'bg-white ring-1 ring-border',
                    )}
                  >
                    {on && <Check className="size-3.5" strokeWidth={3} />}
                  </span>
                  <span>
                    <span className="block text-sm font-extrabold">{service.label}</span>
                    <span className={cn('mt-0.5 block text-xs leading-relaxed', on ? 'text-white/65' : 'text-muted-foreground')}>
                      {service.description}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
          <label className="mt-5 block text-sm font-bold text-lpo-ink">
            Note for LPO admin
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="Scope, timing, or how these services should work together."
              className="mt-2 w-full resize-none rounded-2xl border border-border bg-[#f7f8fb] px-4 py-3 text-sm font-medium outline-none focus:border-[#07101f]/40"
            />
          </label>
          {error && <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p>}
          <div className="mt-5 flex gap-3">
            <button type="button" onClick={submit} className="rounded-full bg-lpo-yellow px-5 py-2.5 text-sm font-extrabold text-lpo-ink">
              Submit for approval
            </button>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full px-4 py-2.5 text-sm font-bold text-muted-foreground">
              Cancel
            </button>
          </div>
        </motion.section>
      )}

      <div className="mt-6 space-y-4">
        {contracts.length === 0 && (
          <section className="rounded-[28px] bg-white px-6 py-16 text-center ring-1 ring-[#07101f]/[0.06]">
            <p className="text-lg font-extrabold">No contracts yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Request the services you need. LPO will turn them into an agreement and approve it before work begins.
            </p>
          </section>
        )}
        {contracts.map((contract, index) => {
          const approved = contract.status === 'approved'
          return (
            <motion.article
              key={contract.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT, delay: index * 0.04 }}
              className="overflow-hidden rounded-[28px] bg-white ring-1 ring-[#07101f]/[0.06]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.16em] text-muted-foreground uppercase">{contract.reference}</p>
                  <p className="mt-1 text-sm font-semibold text-lpo-ink">{formatWhen(contract.createdAt)}</p>
                </div>
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold tracking-[0.08em] uppercase',
                    approved ? 'bg-emerald-50 text-emerald-700' : 'bg-lpo-yellow-soft text-[#8a6a00]',
                  )}
                >
                  <ShieldCheck className="size-3.5" />
                  {approved ? 'Approved by admin' : 'Pending admin approval'}
                </span>
              </div>
              <div className="grid gap-6 px-6 py-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">Services in this agreement</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {contract.services.map((service) => (
                      <li key={service} className="rounded-full bg-[#f3f5f9] px-3 py-1.5 text-xs font-bold text-[#07101f]">
                        {labelFor(service)}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{contract.note}</p>
              </div>
            </motion.article>
          )
        })}
      </div>
    </div>
  )
}
