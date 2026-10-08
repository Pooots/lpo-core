import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BriefcaseBusiness,
  KeyRound,
  Link2,
  Lock,
  Mail,
  MapPin,
  Phone,
  UserPlus,
  UserRound,
  X,
} from 'lucide-react'
import type { FormEvent, ReactNode } from 'react'
import type { AdminTalent, TalentStatus } from '@/types/talent'
import type { FieldErrors } from '@/lib/formValidation'
import {
  ChipMultiSelect,
  ChoiceGroup,
  FileDropField,
  FormAlert,
  PasswordField,
  SubmitButton,
  TextField,
} from '@/components/auth/fields'
import { CANDIDATE_SKILLS, EXPERIENCE_LEVELS, WORK_SETUPS } from '@/lib/accountOptions'
import { parseApiError } from '@/lib/apiErrors'
import { generatePassword, isEmail, isUrl, normalizeUrl, passwordError } from '@/lib/formValidation'
import { CV_ACCEPT, TALENT_STATUSES, cvFileError } from '@/lib/talentStatus'
import { adminTalentService } from '@/services/adminTalentService'

type Form = {
  name: string
  email: string
  phone: string
  password: string
  location: string
  desired_position: string
  experience_level: string
  work_setup: string
  linkedin_url: string
  skills: Array<string>
  status: TalentStatus
  cv: File | null
}

const EMPTY: Form = {
  name: '',
  email: '',
  phone: '',
  password: '',
  location: '',
  desired_position: '',
  experience_level: '',
  work_setup: '',
  linkedin_url: '',
  skills: [],
  status: 'for_assessment',
  cv: null,
}

const STATUS_OPTIONS = TALENT_STATUSES.map((s) => ({ value: s.value, label: s.label }))

function validate(f: Form): FieldErrors {
  const e: FieldErrors = {}
  if (!f.name.trim()) e.name = 'Enter the full name.'
  if (!isEmail(f.email)) e.email = 'Enter a valid email address.'
  if (!f.phone.trim()) e.phone = 'Enter a phone number.'
  const pw = passwordError(f.password)
  if (pw) e.password = pw
  if (!f.location.trim()) e.location = 'Enter the location.'
  if (!f.desired_position.trim()) e.desired_position = 'Enter the desired position.'
  if (!f.experience_level) e.experience_level = 'Select the experience level.'
  if (!f.work_setup) e.work_setup = 'Select the work setup.'
  if (f.linkedin_url.trim() && !isUrl(f.linkedin_url)) e.linkedin_url = 'Enter a valid URL.'
  const cv = cvFileError(f.cv, false)
  if (cv) e.cv = cv
  return e
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-5">
      <legend className="mb-4 flex w-full items-center gap-3 text-[11px] font-extrabold tracking-[0.18em] text-muted-foreground uppercase">
        {title}
        <span className="h-px flex-1 bg-lpo-navy/[0.08]" />
      </legend>
      {children}
    </fieldset>
  )
}

export function AddTalentDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  onCreated: (talent: AdminTalent) => void
}) {
  const [form, setForm] = useState<Form>(EMPTY)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm(EMPTY)
    setErrors({})
    setServerError(null)
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
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) {
      setServerError('Please review the highlighted fields.')
      return
    }

    setSaving(true)
    setServerError(null)
    try {
      const talent = await adminTalentService.create({
        ...form,
        email: form.email.trim(),
        linkedin_url: form.linkedin_url.trim() ? normalizeUrl(form.linkedin_url) : undefined,
      })
      onCreated(talent)
    } catch (error) {
      const info = parseApiError(error, 'We could not add this talent. Please try again.')
      setErrors(info.fieldErrors)
      setServerError(info.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 sm:p-8">
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
            aria-labelledby="add-talent-title"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-[0_40px_120px_-30px_rgb(11_37_89/0.6)]"
          >
            <div className="relative flex items-start justify-between gap-4 overflow-hidden bg-lpo-navy px-6 py-6 text-white sm:px-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-20 -right-16 size-56 rounded-full border-[28px] border-lpo-yellow/10"
              />
              <div className="relative flex items-center gap-4">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-lpo-yellow text-lpo-ink">
                  <UserPlus className="size-6" />
                </span>
                <div>
                  <h2 id="add-talent-title" className="text-xl font-extrabold">
                    Add talent
                  </h2>
                  <p className="text-sm text-white/60">
                    Create a talent account and add them to the pipeline.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="relative flex size-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-8 px-6 py-7 sm:px-8">
              <FormAlert message={serverError} />

              <Group title="Personal details">
                <TextField
                  tone="business"
                  label="Full name"
                  icon={UserRound}
                  value={form.name}
                  onChange={set('name')}
                  error={errors.name}
                  placeholder="Juan Dela Cruz"
                  autoFocus
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    tone="business"
                    label="Email address"
                    type="email"
                    icon={Mail}
                    value={form.email}
                    onChange={set('email')}
                    error={errors.email}
                    placeholder="talent@email.com"
                  />
                  <TextField
                    tone="business"
                    label="Mobile number"
                    type="tel"
                    icon={Phone}
                    value={form.phone}
                    onChange={set('phone')}
                    error={errors.phone}
                    placeholder="+63 9XX XXX XXXX"
                  />
                </div>
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
                    hint="Share this password with the talent so they can sign in to LPO Careers."
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
              </Group>

              <Group title="Profile">
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    tone="business"
                    label="Location"
                    icon={MapPin}
                    value={form.location}
                    onChange={set('location')}
                    error={errors.location}
                    placeholder="Santa Rosa, Laguna"
                  />
                  <TextField
                    tone="business"
                    label="Desired position"
                    icon={BriefcaseBusiness}
                    value={form.desired_position}
                    onChange={set('desired_position')}
                    error={errors.desired_position}
                    placeholder="e.g. Virtual Assistant"
                  />
                </div>
                <ChoiceGroup
                  tone="business"
                  label="Experience level"
                  columns={5}
                  options={EXPERIENCE_LEVELS}
                  value={form.experience_level}
                  onChange={set('experience_level')}
                  error={errors.experience_level}
                />
                <ChoiceGroup
                  tone="business"
                  label="Work setup"
                  columns={3}
                  options={WORK_SETUPS}
                  value={form.work_setup}
                  onChange={set('work_setup')}
                  error={errors.work_setup}
                />
                <TextField
                  tone="business"
                  label="LinkedIn or portfolio link"
                  icon={Link2}
                  value={form.linkedin_url}
                  onChange={set('linkedin_url')}
                  error={errors.linkedin_url}
                  placeholder="linkedin.com/in/name"
                  optional
                />
                <ChipMultiSelect
                  tone="business"
                  label="Skills"
                  hint={`${form.skills.length} selected`}
                  options={CANDIDATE_SKILLS}
                  value={form.skills}
                  onChange={set('skills')}
                  error={errors.skills}
                />
              </Group>

              <Group title="CV & status">
                <FileDropField
                  tone="business"
                  label="CV"
                  file={form.cv}
                  onChange={set('cv')}
                  accept={CV_ACCEPT}
                  error={errors.cv}
                  optional
                />
                <ChoiceGroup
                  tone="business"
                  label="Starting status"
                  columns={3}
                  options={STATUS_OPTIONS}
                  value={form.status}
                  onChange={(value) => set('status')(value as TalentStatus)}
                  error={errors.status}
                />
              </Group>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-lpo-navy/[0.06] bg-lpo-surface/60 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-5 text-sm font-bold text-lpo-navy transition-colors hover:border-lpo-navy/30"
              >
                Cancel
              </button>
              <SubmitButton tone="business" loading={saving} className="sm:min-w-44">
                {saving ? 'Adding…' : 'Add talent'}
              </SubmitButton>
            </div>
          </motion.form>
        </div>
      )}
    </AnimatePresence>
  )
}
