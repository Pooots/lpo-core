import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Link2,
  Lock,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from 'lucide-react'
import type {FormEvent} from 'react';
import type {FieldErrors} from '@/lib/formValidation';
import { CareersShell, FormHeader, StepPanel, Stepper } from '@/components/auth/AuthShells'
import {
  CheckboxField,
  ChipMultiSelect,
  ChoiceGroup,
  FileDropField,
  FormAlert,
  PasswordField,
  SubmitButton,
  TextField,
  toneClasses,
} from '@/components/auth/fields'
import { CANDIDATE_SKILLS, EXPERIENCE_LEVELS, WORK_SETUPS } from '@/lib/accountOptions'
import { parseApiError } from '@/lib/apiErrors'
import {
  firstStepWithError,
  isEmail,
  isUrl,
  normalizeUrl,
  passwordError,
} from '@/lib/formValidation'
import { CV_ACCEPT, cvFileError } from '@/lib/talentStatus'
import { ACCOUNT_HOME, authService } from '@/services/authService'

const STEPS = ['Account', 'Profile', 'Skills & CV'] as const

const STEP_FIELDS = [
  ['name', 'email', 'phone', 'password', 'password_confirmation'],
  ['location', 'desired_position', 'experience_level', 'work_setup', 'linkedin_url'],
  ['skills', 'cv', 'terms'],
] as const

const STEP_COPY = [
  {
    title: 'Create your candidate account',
    description: 'Start with the basics so our recruitment team can reach you.',
  },
  {
    title: 'Tell us about your goals',
    description: 'Help us understand the kind of role you are looking for.',
  },
  {
    title: 'Skills & CV',
    description: 'Pick the skills you are confident in and upload your CV to complete your application.',
  },
]

type Form = {
  name: string
  email: string
  phone: string
  password: string
  password_confirmation: string
  location: string
  desired_position: string
  experience_level: string
  work_setup: string
  linkedin_url: string
  skills: Array<string>
  cv: File | null
  terms: boolean
}

const EMPTY: Form = {
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  location: '',
  desired_position: '',
  experience_level: '',
  work_setup: '',
  linkedin_url: '',
  skills: [],
  cv: null,
  terms: false,
}

function validateStep(step: number, f: Form): FieldErrors {
  const e: FieldErrors = {}
  if (step === 0) {
    if (!f.name.trim()) e.name = 'Enter your full name.'
    if (!isEmail(f.email)) e.email = 'Enter a valid email address.'
    if (!f.phone.trim()) e.phone = 'Enter a phone number we can reach you on.'
    const pw = passwordError(f.password)
    if (pw) e.password = pw
    if (f.password_confirmation !== f.password) e.password_confirmation = 'Passwords do not match.'
  }
  if (step === 1) {
    if (!f.location.trim()) e.location = 'Enter your city or province.'
    if (!f.desired_position.trim()) e.desired_position = 'Tell us the role you are aiming for.'
    if (!f.experience_level) e.experience_level = 'Select your experience level.'
    if (!f.work_setup) e.work_setup = 'Select your preferred work setup.'
    if (f.linkedin_url.trim() && !isUrl(f.linkedin_url)) e.linkedin_url = 'Enter a valid URL.'
  }
  if (step === 2) {
    const cv = cvFileError(f.cv)
    if (cv) e.cv = cv
    if (!f.terms) e.terms = 'Please agree to the terms to continue.'
  }
  return e
}

export default function CandidateRegisterPage() {
  const navigate = useNavigate()
  const t = toneClasses('careers')
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
    if (Object.keys(stepErrors).length > 0 || !form.cv) return

    setLoading(true)
    setServerError(null)
    try {
      await authService.registerCandidate({
        ...form,
        cv: form.cv,
        email: form.email.trim(),
        linkedin_url: form.linkedin_url.trim() ? normalizeUrl(form.linkedin_url) : undefined,
      })
      navigate({ to: ACCOUNT_HOME.talent })
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
    <CareersShell
      switchPrompt={
        <>
          <span className="hidden sm:inline">Already registered? </span>
          <Link to="/careers/login" className={`font-extrabold ${t.link}`}>
            Sign in
          </Link>
        </>
      }
    >
      <FormHeader
        tone="careers"
        eyebrow={`Step ${step + 1} of ${STEPS.length} · LPO Careers`}
        title={STEP_COPY[step].title}
        description={STEP_COPY[step].description}
      />
      <Stepper tone="careers" steps={STEPS} current={step} />

      <form onSubmit={submit} noValidate className="mt-8 space-y-5">
        <FormAlert
          message={serverError}
          action={
            errors.email?.includes('already exists') ? (
              <Link to="/careers/login" className="font-bold underline">
                Go to sign in
              </Link>
            ) : undefined
          }
        />

        <StepPanel stepKey={step} direction={direction}>
          {step === 0 && (
            <>
              <TextField
                tone="careers"
                label="Full name"
                icon={UserRound}
                value={form.name}
                onChange={set('name')}
                error={errors.name}
                placeholder="Juan Dela Cruz"
                autoComplete="name"
                autoFocus
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  tone="careers"
                  label="Email address"
                  type="email"
                  icon={Mail}
                  value={form.email}
                  onChange={set('email')}
                  error={errors.email}
                  placeholder="you@email.com"
                  autoComplete="email"
                />
                <TextField
                  tone="careers"
                  label="Mobile number"
                  type="tel"
                  icon={Phone}
                  value={form.phone}
                  onChange={set('phone')}
                  error={errors.phone}
                  placeholder="+63 9XX XXX XXXX"
                  autoComplete="tel"
                />
              </div>
              <PasswordField
                tone="careers"
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
                tone="careers"
                label="Confirm password"
                icon={Lock}
                value={form.password_confirmation}
                onChange={set('password_confirmation')}
                error={errors.password_confirmation}
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
            </>
          )}

          {step === 1 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  tone="careers"
                  label="Location"
                  icon={MapPin}
                  value={form.location}
                  onChange={set('location')}
                  error={errors.location}
                  placeholder="Santa Rosa, Laguna"
                  autoComplete="address-level2"
                  autoFocus
                />
                <TextField
                  tone="careers"
                  label="Desired position"
                  icon={BriefcaseBusiness}
                  value={form.desired_position}
                  onChange={set('desired_position')}
                  error={errors.desired_position}
                  placeholder="e.g. Virtual Assistant"
                />
              </div>
              <ChoiceGroup
                tone="careers"
                label="Experience level"
                columns={5}
                options={EXPERIENCE_LEVELS}
                value={form.experience_level}
                onChange={set('experience_level')}
                error={errors.experience_level}
              />
              <ChoiceGroup
                tone="careers"
                label="Preferred work setup"
                columns={3}
                options={WORK_SETUPS}
                value={form.work_setup}
                onChange={set('work_setup')}
                error={errors.work_setup}
              />
              <TextField
                tone="careers"
                label="LinkedIn or portfolio link"
                icon={Link2}
                value={form.linkedin_url}
                onChange={set('linkedin_url')}
                error={errors.linkedin_url}
                placeholder="linkedin.com/in/your-name"
                optional
              />
            </>
          )}

          {step === 2 && (
            <>
              <ChipMultiSelect
                tone="careers"
                label="Your skills"
                hint={`${form.skills.length} selected`}
                options={CANDIDATE_SKILLS}
                value={form.skills}
                onChange={set('skills')}
                error={errors.skills}
              />
              <FileDropField
                tone="careers"
                label="Upload your CV"
                file={form.cv}
                onChange={set('cv')}
                accept={CV_ACCEPT}
                error={errors.cv}
              />
              <div className="rounded-2xl border border-lpo-yellow/40 bg-lpo-yellow-soft/60 p-4 text-[13px] leading-relaxed text-lpo-navy">
                <span className="font-extrabold">What happens next?</span> Your application
                starts as <span className="font-bold">For Assessment</span>. After our team
                reviews your CV it moves to <span className="font-bold">For Evaluation</span>,
                and once approved your status becomes <span className="font-bold">Active</span>.
              </div>
              <CheckboxField
                tone="careers"
                checked={form.terms}
                onChange={set('terms')}
                error={errors.terms}
              >
                I agree to LPO&apos;s terms and privacy policy, and I consent to being contacted
                about job opportunities.
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
              className="inline-flex h-12 items-center gap-2 rounded-2xl border border-border bg-white px-5 text-[15px] font-bold text-lpo-navy transition-colors hover:border-lpo-navy/30"
            >
              <ArrowLeft className="size-4" />
              Back
            </motion.button>
          )}
          <SubmitButton tone="careers" loading={loading} className="flex-1">
            {step < STEPS.length - 1 ? 'Continue' : 'Create my account'}
            {!loading && (
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            )}
          </SubmitButton>
        </div>
      </form>
    </CareersShell>
  )
}
