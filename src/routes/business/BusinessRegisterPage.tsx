import {  useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Factory,
  Globe,
  IdCard,
  Lock,
  Mail,
  Phone,
  UserRound,
} from 'lucide-react'
import type {FormEvent} from 'react';
import type {FieldErrors} from '@/lib/formValidation';
import { BusinessShell, FormHeader, StepPanel, Stepper } from '@/components/auth/AuthShells'
import {
  CheckboxField,
  ChoiceGroup,
  FormAlert,
  PasswordField,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
  toneClasses,
} from '@/components/auth/fields'
import { COMPANY_SIZES, INDUSTRY_OPTIONS, SERVICE_OPTIONS } from '@/lib/accountOptions'
import { parseApiError } from '@/lib/apiErrors'
import {
  
  firstStepWithError,
  isEmail,
  isUrl,
  normalizeUrl,
  passwordError
} from '@/lib/formValidation'
import { cn } from '@/lib/utils'
import { ACCOUNT_HOME, authService } from '@/services/authService'

const STEPS = ['Company', 'Needs', 'Account'] as const

const STEP_FIELDS = [
  ['company_name', 'company_website', 'industry', 'company_size'],
  ['services', 'message'],
  ['name', 'job_title', 'email', 'phone', 'password', 'password_confirmation', 'terms'],
] as const

const STEP_COPY = [
  {
    title: 'Tell us about your company',
    description: 'A few details help us match the right team and workflow to your business.',
  },
  {
    title: 'What can we help you with?',
    description: 'Select every service you are interested in. We will scope the details together.',
  },
  {
    title: 'Set up your business account',
    description: 'Your account lets you track your request and proposal in one place.',
  },
]

const SIZE_OPTIONS = COMPANY_SIZES.map((size) => ({
  value: size,
  label: size,
  hint: 'employees',
}))

type Form = {
  company_name: string
  company_website: string
  industry: string
  company_size: string
  services: Array<string>
  message: string
  name: string
  job_title: string
  email: string
  phone: string
  password: string
  password_confirmation: string
  terms: boolean
}

const EMPTY: Form = {
  company_name: '',
  company_website: '',
  industry: '',
  company_size: '',
  services: [],
  message: '',
  name: '',
  job_title: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  terms: false,
}

function validateStep(step: number, f: Form): FieldErrors {
  const e: FieldErrors = {}
  if (step === 0) {
    if (!f.company_name.trim()) e.company_name = 'Enter your company name.'
    if (f.company_website.trim() && !isUrl(f.company_website))
      e.company_website = 'Enter a valid website.'
    if (!f.industry) e.industry = 'Select your industry.'
    if (!f.company_size) e.company_size = 'Select your company size.'
  }
  if (step === 1) {
    if (f.services.length === 0) e.services = 'Select at least one service you are interested in.'
  }
  if (step === 2) {
    if (!f.name.trim()) e.name = 'Enter your full name.'
    if (!f.job_title.trim()) e.job_title = 'Enter your job title.'
    if (!isEmail(f.email)) e.email = 'Enter a valid work email.'
    const pw = passwordError(f.password)
    if (pw) e.password = pw
    if (f.password_confirmation !== f.password) e.password_confirmation = 'Passwords do not match.'
    if (!f.terms) e.terms = 'Please agree to the terms to continue.'
  }
  return e
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
    onChange(
      value.includes(service) ? value.filter((v) => v !== service) : [...value, service],
    )

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-[13px] font-bold text-lpo-ink">Services you are interested in</p>
        <span className="text-[11px] font-semibold text-muted-foreground">
          {value.length} selected
        </span>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {SERVICE_OPTIONS.map(({ value: service, label, description, icon: Icon }, i) => {
          const active = value.includes(service)
          return (
            <motion.button
              key={service}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(service)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                'relative flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-300',
                active
                  ? 'border-lpo-blue bg-lpo-blue-soft shadow-[0_12px_28px_-18px_rgb(20_99_255/0.9)]'
                  : 'border-border bg-white hover:border-lpo-blue/30',
              )}
            >
              <span
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-300',
                  active ? 'bg-lpo-blue text-white' : 'bg-lpo-surface text-lpo-navy',
                )}
              >
                <Icon className="size-[18px]" />
              </span>
              <span className="min-w-0 flex-1 pr-5">
                <span
                  className={cn(
                    'block text-[13px] font-extrabold',
                    active ? 'text-lpo-blue' : 'text-lpo-ink',
                  )}
                >
                  {label}
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                  {description}
                </span>
              </span>
              <AnimatePresence>
                {active && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-lpo-blue text-white"
                  >
                    <Check className="size-3" strokeWidth={3.5} />
                  </motion.span>
                )}
              </AnimatePresence>
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

export default function BusinessRegisterPage() {
  const navigate = useNavigate()
  const t = toneClasses('business')
  const [form, setForm] = useState<Form>(EMPTY)
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const set = <TKey extends keyof Form>(key: TKey) => (value: Form[TKey]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => {
        const nextErrors = { ...prev }
        delete nextErrors[key]
        return nextErrors
      })
    }
  }

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }

  const next = () => {
    const stepErrors = validateStep(step, form)
    setErrors(stepErrors)
    if (Object.keys(stepErrors).length === 0) goTo(step + 1)
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (step < STEPS.length - 1) return next()

    const stepErrors = validateStep(step, form)
    setErrors(stepErrors)
    if (Object.keys(stepErrors).length > 0) return

    setLoading(true)
    setServerError(null)
    try {
      await authService.registerBusiness({
        ...form,
        email: form.email.trim(),
        company_website: form.company_website.trim()
          ? normalizeUrl(form.company_website)
          : undefined,
        phone: form.phone.trim() || undefined,
        message: form.message.trim() || undefined,
      })
      navigate({ to: ACCOUNT_HOME.client })
    } catch (error) {
      const info = parseApiError(error)
      setErrors(info.fieldErrors)
      setServerError(info.message)
      if (Object.keys(info.fieldErrors).length > 0) {
        goTo(firstStepWithError(STEP_FIELDS, info.fieldErrors))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <BusinessShell
      switchPrompt={
        <>
          <span className="hidden sm:inline">Already a client? </span>
          <Link to="/business/login" className={`font-extrabold ${t.link}`}>
            Sign in
          </Link>
        </>
      }
    >
      <FormHeader
        tone="business"
        eyebrow={`Step ${step + 1} of ${STEPS.length} · LPO for Business`}
        title={STEP_COPY[step].title}
        description={STEP_COPY[step].description}
      />
      <Stepper tone="business" steps={STEPS} current={step} />

      <form onSubmit={submit} noValidate className="mt-8 space-y-5">
        <FormAlert
          message={serverError}
          action={
            errors.email?.includes('already exists') ? (
              <Link to="/business/login" className="font-bold underline">
                Go to sign in
              </Link>
            ) : undefined
          }
        />

        <StepPanel stepKey={step} direction={direction}>
          {step === 0 && (
            <>
              <TextField
                tone="business"
                label="Company name"
                icon={Building2}
                value={form.company_name}
                onChange={set('company_name')}
                error={errors.company_name}
                placeholder="Acme Corporation"
                autoComplete="organization"
                autoFocus
              />
              <TextField
                tone="business"
                label="Company website"
                icon={Globe}
                value={form.company_website}
                onChange={set('company_website')}
                error={errors.company_website}
                placeholder="acme.com"
                autoComplete="url"
                optional
              />
              <SelectField
                tone="business"
                label="Industry"
                icon={Factory}
                options={INDUSTRY_OPTIONS}
                placeholder="Select your industry"
                value={form.industry}
                onChange={set('industry')}
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
            </>
          )}

          {step === 1 && (
            <>
              <ServicePicker
                value={form.services}
                onChange={set('services')}
                error={errors.services}
              />
              <TextAreaField
                tone="business"
                label="Project details"
                value={form.message}
                onChange={set('message')}
                error={errors.message}
                placeholder="Share your goals, target market, timeline, or anything else we should know."
                optional
              />
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  tone="business"
                  label="Full name"
                  icon={UserRound}
                  value={form.name}
                  onChange={set('name')}
                  error={errors.name}
                  placeholder="Jane Smith"
                  autoComplete="name"
                  autoFocus
                />
                <TextField
                  tone="business"
                  label="Job title"
                  icon={IdCard}
                  value={form.job_title}
                  onChange={set('job_title')}
                  error={errors.job_title}
                  placeholder="Head of Sales"
                  autoComplete="organization-title"
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  tone="business"
                  label="Work email"
                  type="email"
                  icon={Mail}
                  value={form.email}
                  onChange={set('email')}
                  error={errors.email}
                  placeholder="you@company.com"
                  autoComplete="email"
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
                  autoComplete="tel"
                  optional
                />
              </div>
              <PasswordField
                tone="business"
                label="Password"
                icon={Lock}
                value={form.password}
                onChange={set('password')}
                error={errors.password}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                showStrength
              />
              <PasswordField
                tone="business"
                label="Confirm password"
                icon={Lock}
                value={form.password_confirmation}
                onChange={set('password_confirmation')}
                error={errors.password_confirmation}
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
              <CheckboxField
                tone="business"
                checked={form.terms}
                onChange={set('terms')}
                error={errors.terms}
              >
                I agree to LPO&apos;s terms and privacy policy, and I&apos;m happy to be contacted
                about this request.
              </CheckboxField>
            </>
          )}
        </StepPanel>

        <div className="flex items-center gap-3 pt-2">
          {step > 0 && (
            <motion.button
              type="button"
              onClick={() => goTo(step - 1)}
              whileTap={{ scale: 0.97 }}
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-white px-5 text-[15px] font-bold text-lpo-navy transition-colors hover:border-lpo-blue/30"
            >
              <ArrowLeft className="size-4" />
              Back
            </motion.button>
          )}
          <SubmitButton tone="business" loading={loading} className="flex-1">
            {step < STEPS.length - 1 ? 'Continue' : 'Submit request & create account'}
            {!loading && (
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            )}
          </SubmitButton>
        </div>
      </form>
    </BusinessShell>
  )
}
