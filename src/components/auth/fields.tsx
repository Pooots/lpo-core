import {  useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  FileText,
  Info,
  LoaderCircle,
  UploadCloud,
  X,
} from 'lucide-react'
import type {ReactNode} from 'react';
import type {LucideIcon} from 'lucide-react';
import { cn } from '@/lib/utils'

export type Tone = 'careers' | 'business'

const TONES: Record<
  Tone,
  {
    control: string
    focus: string
    selected: string
    check: string
    button: string
    link: string
  }
> = {
  careers: {
    control: 'rounded-2xl bg-white',
    focus:
      'focus-within:border-lpo-yellow focus-within:ring-4 focus-within:ring-lpo-yellow/25',
    selected:
      'border-lpo-yellow bg-lpo-yellow-soft text-lpo-ink shadow-[0_10px_24px_-16px_rgb(255_199_0/1)]',
    check: 'bg-lpo-yellow text-lpo-ink',
    button:
      'rounded-2xl bg-lpo-yellow text-lpo-ink shadow-[0_16px_34px_-16px_rgb(255_199_0/1)] hover:bg-[#ffcf24]',
    link: 'text-lpo-navy decoration-lpo-yellow decoration-2 underline-offset-4 hover:underline',
  },
  business: {
    control: 'rounded-xl bg-white',
    focus:
      'focus-within:border-lpo-blue focus-within:ring-4 focus-within:ring-lpo-blue/15',
    selected:
      'border-lpo-blue bg-lpo-blue-soft text-lpo-blue shadow-[0_10px_24px_-16px_rgb(20_99_255/0.8)]',
    check: 'bg-lpo-blue text-white',
    button:
      'rounded-xl bg-lpo-blue text-white shadow-[0_16px_34px_-16px_rgb(20_99_255/0.9)] hover:bg-[#0f57ec]',
    link: 'text-lpo-blue underline-offset-4 hover:underline',
  },
}

export function toneClasses(tone: Tone) {
  return TONES[tone]
}

function FieldShell({
  id,
  label,
  optional,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  optional?: boolean
  error?: string
  hint?: ReactNode
  children: ReactNode
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[13px] font-bold text-lpo-ink">
          {label}
        </label>
        {optional && (
          <span className="text-[11px] font-semibold text-muted-foreground">Optional</span>
        )}
      </div>
      {children}
      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 pt-1.5 text-xs font-semibold text-rose-600"
          >
            <AlertCircle className="size-3.5 shrink-0" />
            {error}
          </motion.p>
        ) : hint ? (
          <p className="pt-1.5 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

type InputProps = {
  tone: Tone
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: ReactNode
  icon?: LucideIcon
  type?: string
  placeholder?: string
  autoComplete?: string
  optional?: boolean
  autoFocus?: boolean
}

export function TextField({
  tone,
  label,
  value,
  onChange,
  error,
  hint,
  icon: Icon,
  type = 'text',
  placeholder,
  autoComplete,
  optional,
  autoFocus,
}: InputProps) {
  const id = useId()
  const t = TONES[tone]

  return (
    <FieldShell id={id} label={label} optional={optional} error={error} hint={hint}>
      <div
        className={cn(
          'group flex h-12 items-center gap-3 border px-4 transition-all duration-300',
          t.control,
          t.focus,
          error ? 'border-rose-300 ring-4 ring-rose-100' : 'border-border',
        )}
      >
        {Icon && (
          <Icon className="size-[18px] shrink-0 text-muted-foreground transition-colors group-focus-within:text-lpo-navy" />
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-invalid={Boolean(error)}
          className="h-full w-full min-w-0 bg-transparent text-[15px] text-lpo-ink outline-none placeholder:text-muted-foreground/60"
        />
      </div>
    </FieldShell>
  )
}

function passwordScore(value: string): number {
  let score = 0
  if (value.length >= 8) score++
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++
  if (/\d/.test(value)) score++
  if (/[^A-Za-z0-9]/.test(value) || value.length >= 12) score++
  return score
}

const STRENGTH = [
  { label: 'Too short', color: 'bg-rose-400' },
  { label: 'Weak', color: 'bg-rose-400' },
  { label: 'Fair', color: 'bg-amber-400' },
  { label: 'Good', color: 'bg-emerald-400' },
  { label: 'Strong', color: 'bg-emerald-500' },
]

export function PasswordField({
  showStrength = false,
  ...props
}: Omit<InputProps, 'type'> & { showStrength?: boolean }) {
  const id = useId()
  const [visible, setVisible] = useState(false)
  const t = TONES[props.tone]
  const Icon = props.icon
  const score = passwordScore(props.value)

  return (
    <FieldShell id={id} label={props.label} error={props.error} hint={props.hint}>
      <div
        className={cn(
          'group flex h-12 items-center gap-3 border px-4 transition-all duration-300',
          t.control,
          t.focus,
          props.error ? 'border-rose-300 ring-4 ring-rose-100' : 'border-border',
        )}
      >
        {Icon && (
          <Icon className="size-[18px] shrink-0 text-muted-foreground transition-colors group-focus-within:text-lpo-navy" />
        )}
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          autoComplete={props.autoComplete}
          aria-invalid={Boolean(props.error)}
          className="h-full w-full min-w-0 bg-transparent text-[15px] text-lpo-ink outline-none placeholder:text-muted-foreground/60"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="text-muted-foreground transition-colors hover:text-lpo-ink"
        >
          {visible ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
        </button>
      </div>
      {showStrength && props.value.length > 0 && (
        <div className="mt-2.5 flex items-center gap-3">
          <div className="grid flex-1 grid-cols-4 gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-1.5 overflow-hidden rounded-full bg-border">
                <motion.span
                  className={cn('block h-full rounded-full', STRENGTH[score].color)}
                  initial={false}
                  animate={{ width: i < score ? '100%' : '0%' }}
                  transition={{ duration: 0.35 }}
                />
              </span>
            ))}
          </div>
          <span className="w-16 text-right text-[11px] font-bold text-muted-foreground">
            {STRENGTH[score].label}
          </span>
        </div>
      )}
    </FieldShell>
  )
}

export function SelectField({
  tone,
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  icon: Icon,
}: {
  tone: Tone
  label: string
  value: string
  onChange: (value: string) => void
  options: ReadonlyArray<string>
  placeholder: string
  error?: string
  icon?: LucideIcon
}) {
  const id = useId()
  const t = TONES[tone]

  return (
    <FieldShell id={id} label={label} error={error}>
      <div
        className={cn(
          'group relative flex h-12 items-center gap-3 border px-4 transition-all duration-300',
          t.control,
          t.focus,
          error ? 'border-rose-300 ring-4 ring-rose-100' : 'border-border',
        )}
      >
        {Icon && <Icon className="size-[18px] shrink-0 text-muted-foreground" />}
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className={cn(
            'h-full w-full min-w-0 cursor-pointer appearance-none bg-transparent pr-6 text-[15px] outline-none',
            value ? 'text-lpo-ink' : 'text-muted-foreground/70',
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 size-4 text-muted-foreground" />
      </div>
    </FieldShell>
  )
}

export function TextAreaField({
  tone,
  label,
  value,
  onChange,
  placeholder,
  error,
  optional,
  maxLength = 2000,
}: {
  tone: Tone
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  optional?: boolean
  maxLength?: number
}) {
  const id = useId()
  const t = TONES[tone]

  return (
    <FieldShell
      id={id}
      label={label}
      optional={optional}
      error={error}
      hint={`${value.length}/${maxLength}`}
    >
      <div
        className={cn(
          'border px-4 py-3 transition-all duration-300',
          t.control,
          t.focus,
          error ? 'border-rose-300 ring-4 ring-rose-100' : 'border-border',
        )}
      >
        <textarea
          id={id}
          rows={4}
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full resize-none bg-transparent text-[15px] text-lpo-ink outline-none placeholder:text-muted-foreground/60"
        />
      </div>
    </FieldShell>
  )
}

export function ChoiceGroup({
  tone,
  label,
  options,
  value,
  onChange,
  error,
  columns = 3,
}: {
  tone: Tone
  label: string
  options: ReadonlyArray<{ value: string; label: string; hint?: string }>
  value: string
  onChange: (value: string) => void
  error?: string
  columns?: 2 | 3 | 5
}) {
  const t = TONES[tone]

  return (
    <div role="radiogroup" aria-label={label}>
      <p className="mb-2 text-[13px] font-bold text-lpo-ink">{label}</p>
      <div
        className={cn(
          'grid gap-2.5',
          columns === 2 && 'grid-cols-2',
          columns === 3 && 'grid-cols-3',
          columns === 5 && 'grid-cols-2 sm:grid-cols-5',
        )}
      >
        {options.map((o) => {
          const active = o.value === value
          return (
            <motion.button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              whileTap={{ scale: 0.96 }}
              onClick={() => onChange(o.value)}
              className={cn(
                'relative border px-3 py-3 text-left transition-all duration-300',
                tone === 'careers' ? 'rounded-2xl' : 'rounded-xl',
                active
                  ? t.selected
                  : 'border-border bg-white text-lpo-navy hover:border-lpo-navy/30',
              )}
            >
              <span className="block text-[13px] font-extrabold">{o.label}</span>
              {o.hint && (
                <span className="mt-0.5 block text-[11px] font-medium text-muted-foreground">
                  {o.hint}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 pt-1.5 text-xs font-semibold text-rose-600">
          <AlertCircle className="size-3.5" />
          {error}
        </p>
      )}
    </div>
  )
}

export function ChipMultiSelect({
  tone,
  label,
  hint,
  options,
  value,
  onChange,
  error,
}: {
  tone: Tone
  label: string
  hint?: string
  options: ReadonlyArray<string>
  value: Array<string>
  onChange: (value: Array<string>) => void
  error?: string
}) {
  const t = TONES[tone]
  const toggle = (option: string) =>
    onChange(
      value.includes(option) ? value.filter((v) => v !== option) : [...value, option],
    )

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-[13px] font-bold text-lpo-ink">{label}</p>
        {hint && <span className="text-[11px] font-semibold text-muted-foreground">{hint}</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value.includes(option)
          return (
            <motion.button
              key={option}
              type="button"
              aria-pressed={active}
              whileTap={{ scale: 0.94 }}
              onClick={() => toggle(option)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-bold transition-all duration-300',
                active
                  ? t.selected
                  : 'border-border bg-white text-lpo-navy hover:border-lpo-navy/30',
              )}
            >
              <AnimatePresence initial={false}>
                {active && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </motion.span>
                )}
              </AnimatePresence>
              {option}
            </motion.button>
          )
        })}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 pt-1.5 text-xs font-semibold text-rose-600">
          <AlertCircle className="size-3.5" />
          {error}
        </p>
      )}
    </div>
  )
}

export function CheckboxField({
  tone,
  checked,
  onChange,
  error,
  children,
}: {
  tone: Tone
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string
  children: ReactNode
}) {
  const t = TONES[tone]

  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-muted-foreground">
        <span
          className={cn(
            'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-all duration-300',
            checked ? cn(t.check, 'border-transparent') : 'border-border bg-white',
          )}
        >
          <motion.span initial={false} animate={{ scale: checked ? 1 : 0 }}>
            <Check className="size-3.5" strokeWidth={3.5} />
          </motion.span>
        </span>
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>{children}</span>
      </label>
      {error && (
        <p className="flex items-center gap-1.5 pt-1.5 pl-8 text-xs font-semibold text-rose-600">
          <AlertCircle className="size-3.5" />
          {error}
        </p>
      )}
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileDropField({
  tone,
  label,
  file,
  onChange,
  accept,
  error,
  hint,
  optional,
}: {
  tone: Tone
  label: string
  file: File | null
  onChange: (file: File | null) => void
  accept: string
  error?: string
  hint?: string
  optional?: boolean
}) {
  const id = useId()
  const [dragging, setDragging] = useState(false)
  const t = TONES[tone]
  const radius = tone === 'careers' ? 'rounded-2xl' : 'rounded-xl'

  return (
    <FieldShell id={id} label={label} optional={optional} error={error}>
      <AnimatePresence mode="wait" initial={false}>
        {file ? (
          <motion.div
            key="file"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={cn('flex items-center gap-3 border p-3.5', radius, t.selected)}
          >
            <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', t.check)}>
              <FileText className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-extrabold text-lpo-ink">{file.name}</span>
              <span className="block text-xs font-semibold text-muted-foreground">
                {formatBytes(file.size)} · Ready to upload
              </span>
            </span>
            <label
              htmlFor={id}
              className="cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-bold text-lpo-navy transition-colors hover:bg-white"
            >
              Replace
            </label>
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label="Remove file"
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white hover:text-rose-600"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        ) : (
          <motion.label
            key="drop"
            htmlFor={id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              const dropped = e.dataTransfer.files.item(0)
              if (dropped) onChange(dropped)
            }}
            className={cn(
              'group flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed bg-white px-4 py-6 text-center transition-all duration-300',
              radius,
              dragging
                ? tone === 'careers'
                  ? 'border-lpo-yellow bg-lpo-yellow-soft'
                  : 'border-lpo-blue bg-lpo-blue-soft'
                : error
                  ? 'border-rose-300'
                  : 'border-border hover:border-lpo-navy/30',
            )}
          >
            <span
              className={cn(
                'flex size-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-0.5',
                tone === 'careers' ? 'bg-lpo-yellow-soft text-lpo-navy' : 'bg-lpo-blue-soft text-lpo-blue',
              )}
            >
              <UploadCloud className="size-5" />
            </span>
            <span className="text-sm font-bold text-lpo-ink">
              <span className={tone === 'careers' ? 'underline decoration-lpo-yellow decoration-2 underline-offset-4' : 'text-lpo-blue'}>
                Click to upload
              </span>{' '}
              or drag and drop
            </span>
            <span className="text-xs text-muted-foreground">{hint ?? 'PDF, DOC, or DOCX up to 5 MB'}</span>
          </motion.label>
        )}
      </AnimatePresence>
      <input
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          onChange(e.target.files?.item(0) ?? null)
          e.target.value = ''
        }}
      />
    </FieldShell>
  )
}

export function FormAlert({
  message,
  variant = 'error',
  action,
}: {
  message: string | null
  variant?: 'error' | 'info'
  action?: ReactNode
}) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div
            role="alert"
            className={cn(
              'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm',
              variant === 'error'
                ? 'border-rose-200 bg-rose-50 text-rose-800'
                : 'border-lpo-blue/20 bg-lpo-blue-soft text-lpo-navy',
            )}
          >
            {variant === 'error' ? (
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
            ) : (
              <Info className="mt-0.5 size-4 shrink-0" />
            )}
            <div className="flex-1">
              <p className="font-semibold">{message}</p>
              {action && <div className="mt-1.5">{action}</div>}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function SubmitButton({
  tone,
  loading,
  children,
  className,
  type = 'submit',
  onClick,
}: {
  tone: Tone
  loading?: boolean
  children: ReactNode
  className?: string
  type?: 'submit' | 'button'
  onClick?: () => void
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={loading}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'lpo-shine group inline-flex h-12 items-center justify-center gap-2 px-6 text-[15px] font-extrabold transition-colors disabled:cursor-wait disabled:opacity-80',
        TONES[tone].button,
        className,
      )}
    >
      {loading && <LoaderCircle className="size-4 animate-spin" />}
      {children}
    </motion.button>
  )
}
