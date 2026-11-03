import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LoaderCircle, X } from 'lucide-react'
import type { FormEvent, ReactNode } from 'react'
import type { AdminService, SaveServicePayload, ServiceIcon } from '@/types/service'
import { EASE_OUT } from '@/components/home/ui'
import { parseApiError } from '@/lib/apiErrors'
import { SERVICE_ICON_OPTIONS } from '@/lib/serviceIcons'
import { cn } from '@/lib/utils'
import { adminServiceService } from '@/services/adminServiceService'

type FormState = {
  name: string
  slug: string
  description: string
  icon: ServiceIcon
  is_active: boolean
  sort_order: string
}

type FieldErrors = Partial<Record<keyof FormState | 'form', string>>

const EMPTY: FormState = {
  name: '',
  slug: '',
  description: '',
  icon: 'briefcase',
  is_active: true,
  sort_order: '',
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80)
}

function fromService(service: AdminService): FormState {
  return {
    name: service.name,
    slug: service.slug,
    description: service.description,
    icon: (SERVICE_ICON_OPTIONS.some((o) => o.value === service.icon)
      ? service.icon
      : 'briefcase') as ServiceIcon,
    is_active: service.is_active,
    sort_order: String(service.sort_order),
  }
}

function validate(form: FormState, creating: boolean): FieldErrors {
  const errors: FieldErrors = {}
  if (!form.name.trim()) errors.name = 'Name is required.'
  if (creating) {
    const slug = form.slug.trim() || slugify(form.name)
    if (!slug) errors.slug = 'Key is required.'
    else if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(slug)) {
      errors.slug = 'Use lowercase letters, numbers, and underscores.'
    }
  }
  if (!form.description.trim()) errors.description = 'Description is required.'
  if (form.sort_order.trim() && Number.isNaN(Number(form.sort_order))) {
    errors.sort_order = 'Enter a whole number.'
  }
  return errors
}

function toPayload(form: FormState, creating: boolean): SaveServicePayload {
  const payload: SaveServicePayload = {
    name: form.name.trim(),
    description: form.description.trim(),
    icon: form.icon,
    is_active: form.is_active,
    sort_order: form.sort_order.trim() ? Number(form.sort_order) : null,
  }
  if (creating) payload.slug = form.slug.trim() || slugify(form.name)
  return payload
}

export function ServiceFormDialog({
  open,
  service,
  onClose,
  onSaved,
}: {
  open: boolean
  service: AdminService | null
  onClose: () => void
  onSaved: (service: AdminService, created: boolean) => void
}) {
  const creating = service === null
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm(service ? fromService(service) : EMPTY)
    setErrors({})
    setSlugTouched(false)
    setSaving(false)
  }, [open, service])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, saving, onClose])

  const set =
    <TKey extends keyof FormState>(key: TKey) =>
    (value: FormState[TKey]) => {
      setForm((current) => ({ ...current, [key]: value }))
      setErrors((current) => {
        if (!current[key] && !current.form) return current
        const next = { ...current }
        delete next[key]
        delete next.form
        return next
      })
    }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors = validate(form, creating)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    setSaving(true)
    try {
      const payload = toPayload(form, creating)
      const result = creating
        ? await adminServiceService.create(payload)
        : await adminServiceService.update(service.id, {
            name: payload.name,
            description: payload.description,
            icon: payload.icon,
            is_active: payload.is_active,
            sort_order: payload.sort_order,
          })
      onSaved(result.service, creating)
    } catch (err) {
      const info = parseApiError(err, 'Could not save the service.')
      const fieldErrors: FieldErrors = { form: info.message }
      for (const [key, message] of Object.entries(info.fieldErrors)) {
        if (key in EMPTY) fieldErrors[key as keyof FormState] = message
      }
      setErrors(fieldErrors)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[65] flex items-end justify-center p-4 sm:items-center">
          <motion.button
            type="button"
            aria-label="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !saving && onClose()}
            className="absolute inset-0 bg-lpo-ink/50 backdrop-blur-sm"
          />
          <motion.form
            role="dialog"
            aria-modal
            aria-label={creating ? 'Add service' : 'Edit service'}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            onSubmit={submit}
            className="relative z-10 flex max-h-[min(90vh,720px)] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_40px_80px_-30px_rgb(11_37_89/0.55)]"
          >
            <header className="flex items-start justify-between gap-4 border-b border-border/70 px-6 py-5">
              <div>
                <p className="text-[10px] font-extrabold tracking-[0.2em] text-muted-foreground uppercase">
                  Services
                </p>
                <h2 className="mt-1 text-lg font-extrabold text-lpo-ink">
                  {creating ? 'Add service' : 'Edit service'}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Offered to clients on registration and in the admin client form.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-lpo-surface hover:text-lpo-ink disabled:opacity-50"
              >
                <X className="size-5" />
              </button>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {errors.form && (
                <p className="rounded-xl bg-rose-50 px-3 py-2 text-[13px] font-semibold text-rose-700">
                  {errors.form}
                </p>
              )}

              <Field label="Service name" error={errors.name}>
                <input
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setForm((current) => ({
                      ...current,
                      name,
                      slug: creating && !slugTouched ? slugify(name) : current.slug,
                    }))
                    setErrors((current) => {
                      const next = { ...current }
                      delete next.name
                      delete next.slug
                      delete next.form
                      return next
                    })
                  }}
                  placeholder="e.g. Executive Assistance"
                  className={inputClass(errors.name)}
                />
              </Field>

              <Field
                label="Key"
                hint={creating ? 'Used in APIs and client records. Auto-filled from the name.' : 'Locked after create so existing client selections stay valid.'}
                error={errors.slug}
              >
                <input
                  value={form.slug}
                  disabled={!creating}
                  onChange={(e) => {
                    setSlugTouched(true)
                    set('slug')(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
                  }}
                  placeholder="executive_assistance"
                  className={cn(inputClass(errors.slug), !creating && 'bg-lpo-surface text-muted-foreground')}
                />
              </Field>

              <Field label="Description" error={errors.description}>
                <textarea
                  value={form.description}
                  onChange={(e) => set('description')(e.target.value)}
                  rows={3}
                  placeholder="Short summary shown on service cards."
                  className={cn(inputClass(errors.description), 'resize-none')}
                />
              </Field>

              <Field label="Icon" error={errors.icon}>
                <div className="grid grid-cols-7 gap-2">
                  {SERVICE_ICON_OPTIONS.map(({ value, label, icon: Icon }) => {
                    const selected = form.icon === value
                    return (
                      <button
                        key={value}
                        type="button"
                        title={label}
                        onClick={() => set('icon')(value)}
                        className={cn(
                          'flex size-10 items-center justify-center rounded-xl border transition-colors',
                          selected
                            ? 'border-lpo-navy bg-lpo-navy text-white'
                            : 'border-border bg-white text-lpo-navy hover:border-lpo-navy/30',
                        )}
                      >
                        <Icon className="size-4" />
                      </button>
                    )
                  })}
                </div>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Sort order" hint="Lower numbers appear first." error={errors.sort_order}>
                  <input
                    type="number"
                    min={0}
                    value={form.sort_order}
                    onChange={(e) => set('sort_order')(e.target.value)}
                    placeholder="Auto"
                    className={inputClass(errors.sort_order)}
                  />
                </Field>
                <Field label="Visibility">
                  <button
                    type="button"
                    onClick={() => set('is_active')(!form.is_active)}
                    className={cn(
                      'flex h-[42px] w-full items-center justify-between rounded-xl border px-3.5 text-sm font-bold transition-colors',
                      form.is_active
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'border-border bg-lpo-surface text-muted-foreground',
                    )}
                  >
                    {form.is_active ? 'Offered to clients' : 'Hidden from clients'}
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase',
                        form.is_active ? 'bg-emerald-600 text-white' : 'bg-slate-400 text-white',
                      )}
                    >
                      {form.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </button>
                </Field>
              </div>
            </div>

            <footer className="flex items-center justify-end gap-2 border-t border-border/70 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-muted-foreground hover:bg-lpo-surface hover:text-lpo-ink disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-lpo-yellow px-4 py-2.5 text-sm font-extrabold text-lpo-navy transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
              >
                {saving && <LoaderCircle className="size-4 animate-spin" />}
                {saving ? 'Saving…' : creating ? 'Add service' : 'Save changes'}
              </button>
            </footer>
          </motion.form>
        </div>
      )}
    </AnimatePresence>
  )
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </span>
      <span className="mt-1.5 block">{children}</span>
      {hint && !error && <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>}
      {error && <span className="mt-1 block text-[12px] font-semibold text-rose-600">{error}</span>}
    </label>
  )
}

function inputClass(error?: string) {
  return cn(
    'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-lpo-ink outline-none transition-shadow placeholder:text-muted-foreground/70 focus:ring-4',
    error
      ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
      : 'border-border focus:border-lpo-navy/30 focus:ring-lpo-blue/10',
  )
}
