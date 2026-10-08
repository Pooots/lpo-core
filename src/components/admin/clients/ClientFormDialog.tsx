import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  Coins,
  Flag,
  Globe,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Receipt,
  UserCog,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import type { FormEvent, ReactNode } from 'react'
import type { AdminClient, ClientStatus, EngagementType, LeadSource, SaveClientPayload } from '@/types/client'
import type { FieldErrors } from '@/lib/formValidation'
import {
  ChoiceGroup,
  FormAlert,
  PasswordField,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
} from '@/components/auth/fields'
import { COMPANY_SIZES, INDUSTRY_OPTIONS, SERVICE_OPTIONS } from '@/lib/accountOptions'
import { parseApiError } from '@/lib/apiErrors'
import { CLIENT_STATUSES, CURRENCIES, ENGAGEMENT_TYPES, LEAD_SOURCES } from '@/lib/clientOptions'
import { generatePassword, isEmail, isUrl, normalizeUrl, passwordError } from '@/lib/formValidation'
import { cn } from '@/lib/utils'
import { adminClientService } from '@/services/adminClientService'

type Form = {
  company_name: string
  company_website: string
  industry: string
  company_size: string
  country: string
  city: string
  name: string
  job_title: string
  email: string
  phone: string
  billing_email: string
  password: string
  services: Array<string>
  message: string
  lead_source: string
  engagement_type: string
  team_size: string
  monthly_value: string
  currency: string
  contract_start: string
  contract_end: string
  account_manager: string
  notes: string
  status: ClientStatus
}

const EMPTY: Form = {
  company_name: '',
  company_website: '',
  industry: '',
  company_size: '',
  country: '',
  city: '',
  name: '',
  job_title: '',
  email: '',
  phone: '',
  billing_email: '',
  password: '',
  services: [],
  message: '',
  lead_source: 'referral',
  engagement_type: '',
  team_size: '',
  monthly_value: '',
  currency: 'USD',
  contract_start: '',
  contract_end: '',
  account_manager: '',
  notes: '',
  status: 'new_inquiry',
}

function fromClient(c: AdminClient): Form {
  return {
    company_name: c.company_name,
    company_website: c.company_website ?? '',
    industry: c.industry ?? '',
    company_size: c.company_size ?? '',
    country: c.country ?? '',
    city: c.city ?? '',
    name: c.name,
    job_title: c.job_title ?? '',
    email: c.email,
    phone: c.phone ?? '',
    billing_email: c.billing_email ?? '',
    password: '',
    services: c.services,
    message: c.message ?? '',
    lead_source: c.lead_source ?? '',
    engagement_type: c.engagement_type ?? '',
    team_size: c.team_size === null ? '' : String(c.team_size),
    monthly_value: c.monthly_value === null ? '' : String(c.monthly_value),
    currency: c.currency,
    contract_start: c.contract_start ?? '',
    contract_end: c.contract_end ?? '',
    account_manager: c.account_manager ?? '',
    notes: c.notes ?? '',
    status: c.status,
  }
}

const SIZE_OPTIONS = COMPANY_SIZES.map((size) => ({ value: size, label: size, hint: 'employees' }))
const STATUS_OPTIONS = CLIENT_STATUSES.map((s) => ({ value: s.value, label: s.label }))
const ENGAGEMENT_OPTIONS = ENGAGEMENT_TYPES.map((e) => ({ value: e.value, label: e.label, hint: e.hint }))
const SOURCE_OPTIONS = LEAD_SOURCES.map((s) => ({ value: s.value, label: s.label }))

function validate(f: Form, creating: boolean): FieldErrors {
  const e: FieldErrors = {}
  if (!f.company_name.trim()) e.company_name = 'Enter the company name.'
  if (f.company_website.trim() && !isUrl(f.company_website)) e.company_website = 'Enter a valid website.'
  if (!f.industry) e.industry = 'Select the industry.'
  if (!f.company_size) e.company_size = 'Select the company size.'
  if (!f.name.trim()) e.name = 'Enter the contact name.'
  if (!f.job_title.trim()) e.job_title = 'Enter the job title.'
  if (!isEmail(f.email)) e.email = 'Enter a valid email address.'
  if (f.billing_email.trim() && !isEmail(f.billing_email)) e.billing_email = 'Enter a valid email address.'
  if (creating) {
    const pw = passwordError(f.password)
    if (pw) e.password = pw
  }
  if (f.services.length === 0) e.services = 'Select at least one service.'
  if (f.team_size && !(Number.isInteger(Number(f.team_size)) && Number(f.team_size) >= 1 && Number(f.team_size) <= 1000)) {
    e.team_size = 'Enter a whole number from 1 to 1000.'
  }
  if (f.monthly_value && !(Number(f.monthly_value) >= 0)) e.monthly_value = 'Enter a valid amount.'
  if (f.contract_start && f.contract_end && f.contract_end < f.contract_start) {
    e.contract_end = 'The end date must be on or after the start date.'
  }
  return e
}

function toPayload(f: Form, creating: boolean): SaveClientPayload {
  const text = (value: string) => value.trim() || null
  return {
    company_name: f.company_name.trim(),
    company_website: f.company_website.trim() ? normalizeUrl(f.company_website) : null,
    industry: f.industry,
    company_size: f.company_size,
    country: text(f.country),
    city: text(f.city),
    name: f.name.trim(),
    job_title: f.job_title.trim(),
    email: f.email.trim(),
    phone: text(f.phone),
    billing_email: text(f.billing_email),
    ...(creating ? { password: f.password } : {}),
    services: f.services,
    message: text(f.message),
    lead_source: (f.lead_source || null) as LeadSource | null,
    engagement_type: (f.engagement_type || null) as EngagementType | null,
    team_size: f.team_size ? Number(f.team_size) : null,
    monthly_value: f.monthly_value ? Number(f.monthly_value) : null,
    currency: f.currency,
    contract_start: f.contract_start || null,
    contract_end: f.contract_end || null,
    account_manager: text(f.account_manager),
    notes: text(f.notes),
    status: f.status,
  }
}

function Group({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-5">
      <legend className="mb-4 flex w-full items-center gap-3 text-[10.5px] font-medium tracking-wider text-muted-foreground uppercase">
        {title}
        <span className="h-px flex-1 bg-lpo-navy/[0.08]" />
        {hint && <span className="tracking-normal normal-case">{hint}</span>}
      </legend>
      {children}
    </fieldset>
  )
}

function ServicePicker({
  value,
  onChange,
  error,
}: {
  value: Array<string>
  onChange: (value: Array<string>) => void
  error?: string
}) {
  const toggle = (service: string) =>
    onChange(value.includes(service) ? value.filter((v) => v !== service) : [...value, service])

  return (
    <div>
      <p className="mb-2 flex items-center justify-between text-[13px] font-bold text-lpo-ink">
        Services
        <span className="text-[11px] font-medium text-muted-foreground">{value.length} selected</span>
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {SERVICE_OPTIONS.map((service) => {
          const Icon = service.icon
          const active = value.includes(service.value)
          return (
            <button
              key={service.value}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(service.value)}
              className={cn(
                'flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors',
                active
                  ? 'border-lpo-blue bg-lpo-blue-soft/60 ring-1 ring-lpo-blue/30'
                  : 'border-border bg-white hover:border-lpo-navy/30',
              )}
            >
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-md',
                  active ? 'bg-lpo-blue text-white' : 'bg-lpo-surface text-lpo-navy/70',
                )}
              >
                <Icon className="size-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-medium text-lpo-ink">{service.label}</span>
                <span className="block truncate text-[11px] text-muted-foreground">{service.description}</span>
              </span>
              {active && <Check className="size-4 shrink-0 text-lpo-blue" strokeWidth={3} />}
            </button>
          )
        })}
      </div>
      {error && <p className="pt-1.5 text-xs font-semibold text-rose-600">{error}</p>}
    </div>
  )
}

/** Add a client (client = null) or edit an existing one. */
export function ClientFormDialog({
  open,
  client,
  onClose,
  onSaved,
}: {
  open: boolean
  client: AdminClient | null
  onClose: () => void
  onSaved: (client: AdminClient, created: boolean) => void
}) {
  const creating = client === null
  const [form, setForm] = useState<Form>(EMPTY)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm(client ? fromClient(client) : EMPTY)
    setErrors({})
    setServerError(null)
  }, [open, client])

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

  const set = <TKey extends keyof Form>(key: TKey) => (value: Form[TKey]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate(form, creating)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) {
      setServerError('Please review the highlighted fields.')
      return
    }

    setSaving(true)
    setServerError(null)
    try {
      const payload = toPayload(form, creating)
      const saved = creating
        ? await adminClientService.create(payload)
        : await adminClientService.update(client.id, payload)
      onSaved(saved, creating)
    } catch (error) {
      const info = parseApiError(error, 'We could not save this client. Please try again.')
      setErrors(info.fieldErrors)
      setServerError(info.message)
    } finally {
      setSaving(false)
    }
  }

  const HeaderIcon = creating ? Building2 : Pencil

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[65] flex items-start justify-center overflow-y-auto p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-lpo-ink/50 backdrop-blur-sm"
          />
          <motion.form
            onSubmit={submit}
            noValidate
            role="dialog"
            aria-modal="true"
            aria-labelledby="client-form-title"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-[0_40px_120px_-30px_rgb(11_37_89/0.6)]"
          >
            <div className="relative flex items-start justify-between gap-4 overflow-hidden bg-lpo-navy px-6 py-5 text-white sm:px-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-20 -right-16 size-56 rounded-full border-[28px] border-lpo-yellow/10"
              />
              <div className="relative flex items-center gap-3.5">
                <span className="flex size-11 items-center justify-center rounded-xl bg-lpo-yellow text-lpo-ink">
                  <HeaderIcon className="size-5" />
                </span>
                <div>
                  <h2 id="client-form-title" className="text-lg font-semibold">
                    {creating ? 'Add client' : `Edit ${client.company_name}`}
                  </h2>
                  <p className="text-[13px] text-white/60">
                    {creating
                      ? 'Create a client account and add the company to the client pipeline.'
                      : 'Update the company, contact, and engagement details.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="relative flex size-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="size-[18px]" />
              </button>
            </div>

            <div className="space-y-8 px-6 py-7 sm:px-8">
              <FormAlert message={serverError} />

              <Group title="Company">
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    tone="business"
                    label="Company name"
                    icon={Building2}
                    value={form.company_name}
                    onChange={set('company_name')}
                    error={errors.company_name}
                    placeholder="Acme Corporation"
                    autoFocus={creating}
                  />
                  <TextField
                    tone="business"
                    label="Website"
                    icon={Globe}
                    value={form.company_website}
                    onChange={set('company_website')}
                    error={errors.company_website}
                    placeholder="acme.com"
                    optional
                  />
                </div>
                <SelectField
                  tone="business"
                  label="Industry"
                  value={form.industry}
                  onChange={set('industry')}
                  options={INDUSTRY_OPTIONS}
                  placeholder="Select an industry"
                  error={errors.industry}
                />
                <ChoiceGroup
                  tone="business"
                  label="Company size"
                  columns={5}
                  options={SIZE_OPTIONS}
                  value={form.company_size}
                  onChange={set('company_size')}
                  error={errors.company_size}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    tone="business"
                    label="Country"
                    icon={Flag}
                    value={form.country}
                    onChange={set('country')}
                    error={errors.country}
                    placeholder="United States"
                    optional
                  />
                  <TextField
                    tone="business"
                    label="City"
                    icon={MapPin}
                    value={form.city}
                    onChange={set('city')}
                    error={errors.city}
                    placeholder="Austin"
                    optional
                  />
                </div>
              </Group>

              <Group title="Primary contact">
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    tone="business"
                    label="Full name"
                    icon={UserRound}
                    value={form.name}
                    onChange={set('name')}
                    error={errors.name}
                    placeholder="Jane Smith"
                  />
                  <TextField
                    tone="business"
                    label="Job title"
                    icon={BadgeCheck}
                    value={form.job_title}
                    onChange={set('job_title')}
                    error={errors.job_title}
                    placeholder="Head of Sales"
                  />
                  <TextField
                    tone="business"
                    label="Work email"
                    type="email"
                    icon={Mail}
                    value={form.email}
                    onChange={set('email')}
                    error={errors.email}
                    placeholder="jane@acme.com"
                    hint={creating ? 'Used to sign in to the LPO business portal.' : undefined}
                  />
                  <TextField
                    tone="business"
                    label="Phone"
                    type="tel"
                    icon={Phone}
                    value={form.phone}
                    onChange={set('phone')}
                    error={errors.phone}
                    placeholder="+1 555 000 0000"
                    optional
                  />
                </div>
                <TextField
                  tone="business"
                  label="Billing email"
                  type="email"
                  icon={Receipt}
                  value={form.billing_email}
                  onChange={set('billing_email')}
                  error={errors.billing_email}
                  placeholder="accounts@acme.com"
                  optional
                />
                {creating && (
                  <div>
                    <PasswordField
                      tone="business"
                      label="Temporary password"
                      icon={Lock}
                      value={form.password}
                      onChange={set('password')}
                      error={errors.password}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      hint="Share this password with the client so they can sign in."
                    />
                    <button
                      type="button"
                      onClick={() => set('password')(generatePassword())}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-lpo-blue hover:underline"
                    >
                      <KeyRound className="size-3.5" />
                      Generate a secure password
                    </button>
                  </div>
                )}
              </Group>

              <Group title="Service request">
                <ServicePicker value={form.services} onChange={set('services')} error={errors.services} />
                <TextAreaField
                  tone="business"
                  label="Requirements"
                  value={form.message}
                  onChange={set('message')}
                  error={errors.message}
                  placeholder="Goals, target market, timeline, tools, or anything the team should know."
                  optional
                />
                <ChoiceGroup
                  tone="business"
                  label="Lead source"
                  columns={3}
                  options={SOURCE_OPTIONS}
                  value={form.lead_source}
                  onChange={set('lead_source')}
                  error={errors.lead_source}
                />
              </Group>

              <Group title="Engagement" hint="Fill in once the deal is scoped">
                <ChoiceGroup
                  tone="business"
                  label="Engagement type"
                  columns={3}
                  options={ENGAGEMENT_OPTIONS}
                  value={form.engagement_type}
                  onChange={set('engagement_type')}
                  error={errors.engagement_type}
                />
                <div className="grid gap-5 sm:grid-cols-3">
                  <TextField
                    tone="business"
                    label="Team size (seats)"
                    type="number"
                    icon={Users}
                    value={form.team_size}
                    onChange={set('team_size')}
                    error={errors.team_size}
                    placeholder="e.g. 3"
                    optional
                  />
                  <TextField
                    tone="business"
                    label="Monthly value"
                    type="number"
                    icon={Coins}
                    value={form.monthly_value}
                    onChange={set('monthly_value')}
                    error={errors.monthly_value}
                    placeholder="e.g. 4500"
                    optional
                  />
                  <SelectField
                    tone="business"
                    label="Currency"
                    value={form.currency}
                    onChange={set('currency')}
                    options={CURRENCIES}
                    placeholder="Currency"
                    error={errors.currency}
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-3">
                  <TextField
                    tone="business"
                    label="Contract start"
                    type="date"
                    icon={CalendarDays}
                    value={form.contract_start}
                    onChange={set('contract_start')}
                    error={errors.contract_start}
                    optional
                  />
                  <TextField
                    tone="business"
                    label="Contract end"
                    type="date"
                    icon={CalendarDays}
                    value={form.contract_end}
                    onChange={set('contract_end')}
                    error={errors.contract_end}
                    optional
                  />
                  <TextField
                    tone="business"
                    label="Account manager"
                    icon={UserCog}
                    value={form.account_manager}
                    onChange={set('account_manager')}
                    error={errors.account_manager}
                    placeholder="Assigned LPO staff"
                    optional
                  />
                </div>
              </Group>

              <Group title="Status & notes">
                <ChoiceGroup
                  tone="business"
                  label="Pipeline status"
                  columns={5}
                  options={STATUS_OPTIONS}
                  value={form.status}
                  onChange={(value) => set('status')(value as ClientStatus)}
                  error={errors.status}
                />
                <TextAreaField
                  tone="business"
                  label="Internal notes (admins only)"
                  value={form.notes}
                  onChange={set('notes')}
                  error={errors.notes}
                  placeholder="Call summaries, preferences, risks, next steps…"
                  maxLength={5000}
                  optional
                />
              </Group>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-lpo-navy/[0.06] bg-lpo-surface/60 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 text-sm font-semibold text-lpo-navy transition-colors hover:border-lpo-navy/30"
              >
                Cancel
              </button>
              <SubmitButton tone="business" loading={saving} className="sm:min-w-44">
                {saving ? 'Saving…' : creating ? 'Add client' : 'Save changes'}
              </SubmitButton>
            </div>
          </motion.form>
        </div>
      )}
    </AnimatePresence>
  )
}
