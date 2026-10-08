import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { MotionConfig, motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowLeft,
  CalendarCheck,
  CircleCheck,
  ClipboardList,
  FileText,
  FileUp,
  LoaderCircle,
  LogOut,
  Mail,
  Rocket,
} from 'lucide-react'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { AccountSession, AccountType, BusinessProfile, CandidateProfile } from '@/types/auth'
import type { ClientStatus } from '@/types/client'
import { ENGAGEMENT_TYPES } from '@/lib/clientOptions'
import { CONTACT } from '@/components/home/content'
import { EASE_OUT } from '@/components/home/ui'
import {
  EXPERIENCE_LEVELS,
  SERVICE_OPTIONS,
  WORK_SETUPS,
  labelFor,
} from '@/lib/accountOptions'
import { parseApiError } from '@/lib/apiErrors'
import {
  CV_ACCEPT,
  TALENT_STATUSES,
  cvFileError,
  formatDate,
  formatFileSize,
  talentStatusIndex,
  talentStatusMeta,
} from '@/lib/talentStatus'
import { cn } from '@/lib/utils'
import { ACCOUNT_LOGIN, authService } from '@/services/authService'

type StepState = 'done' | 'current' | 'upcoming'
type Step = { icon: LucideIcon; title: string; text: string; state: StepState }

const CLIENT_STEPS: Array<{ status: ClientStatus; icon: LucideIcon; title: string; text: string }> = [
  { status: 'new_inquiry', icon: CircleCheck, title: 'Request received', text: 'Your service request is now with our solutions team.' },
  { status: 'discovery', icon: ClipboardList, title: 'Discovery call', text: 'We will contact you to understand your goals and workflow.' },
  { status: 'proposal', icon: CalendarCheck, title: 'Proposal', text: 'You receive a scoped proposal, usually within 48 hours.' },
  { status: 'active', icon: Rocket, title: 'Team launch', text: 'We onboard your dedicated team and start delivering.' },
]

const CLIENT_BADGE: Record<ClientStatus, string> = {
  new_inquiry: 'Request received',
  discovery: 'In discovery',
  proposal: 'Proposal ready',
  active: 'Active client',
  inactive: 'Inactive',
}

function clientSteps(profile: BusinessProfile | null): Array<Step> {
  const status = profile?.status ?? 'new_inquiry'
  const reached = CLIENT_STEPS.findIndex((step) => step.status === status)

  return CLIENT_STEPS.map(({ icon, title, text }, i): Step => {
    let state: StepState = 'upcoming'
    if (i === 0 || i < reached) state = 'done'
    if (i === reached && i > 0) state = i === CLIENT_STEPS.length - 1 ? 'done' : 'current'
    return { icon, title, text, state }
  })
}

function clientIntro(profile: BusinessProfile | null): string {
  const company = profile?.company_name ?? 'your company'
  switch (profile?.status) {
    case 'discovery':
      return `We are in discovery with you. Our solutions team is mapping ${company}'s goals and workflow.`
    case 'proposal':
      return `Your proposal for ${company} is ready. Reach out if you have questions before we kick off.`
    case 'active':
      return `Welcome aboard! Your LPO team is onboarded and delivering for ${company}.`
    case 'inactive':
      return `Your engagement with LPO is currently inactive. Contact us anytime to pick things back up.`
    default:
      return `Thank you for your interest in LPO. Our team is reviewing ${company}'s request and will contact you shortly.`
  }
}

const TALENT_STEP_TEXT: Record<string, string> = {
  for_assessment: 'Our recruitment team is assessing your CV and profile.',
  for_evaluation: 'You passed the assessment and are being evaluated for placement.',
  active: 'You are an active LPO talent, ready to be matched to roles.',
}

function talentSteps(profile: CandidateProfile | null): Array<Step> {
  const hasCv = Boolean(profile?.cv)
  const reached = talentStatusIndex(profile?.status ?? 'for_assessment')

  return [
    {
      icon: FileUp,
      title: 'CV submitted',
      text: hasCv ? 'We have received your CV.' : 'Upload your CV to start your application.',
      state: hasCv ? 'done' : 'current',
    },
    ...TALENT_STATUSES.map((status, i): Step => {
      let state: StepState = 'upcoming'
      if (hasCv && i < reached) state = 'done'
      if (hasCv && i === reached) state = status.value === 'active' ? 'done' : 'current'
      return { icon: status.icon, title: status.label, text: TALENT_STEP_TEXT[status.value], state }
    }),
  ]
}

function talentIntro(profile: CandidateProfile | null): string {
  if (!profile?.cv) return 'Your account is ready. Upload your CV so our recruitment team can start assessing your application.'
  if (profile.status === 'for_evaluation') return 'Good news: you passed the assessment. Our team is now evaluating your profile for placement.'
  if (profile.status === 'active') return 'You are an active LPO talent. Our team will reach out with roles that match your skills.'
  return 'Thank you for applying to LPO. Your CV is with our recruitment team for assessment.'
}

function TalentCvCard({
  profile,
  onUploaded,
}: {
  profile: CandidateProfile | null
  onUploaded: (session: AccountSession) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cv = profile?.cv ?? null

  const upload = async (file: File | null) => {
    const invalid = cvFileError(file)
    if (invalid || !file) {
      setError(invalid ?? null)
      return
    }
    setError(null)
    setUploading(true)
    try {
      onUploaded(await authService.uploadCv(file))
    } catch (err) {
      const info = parseApiError(err, 'We could not upload your CV. Please try again.')
      setError('cv' in info.fieldErrors ? info.fieldErrors.cv : info.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.3 }}
      className={cn(
        'rounded-3xl p-6 shadow-[0_30px_60px_-34px_rgb(11_37_89/0.4)] ring-1 sm:p-7',
        cv ? 'bg-white ring-lpo-navy/[0.06]' : 'bg-amber-50 ring-amber-200',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={CV_ACCEPT}
        className="sr-only"
        onChange={(e) => {
          void upload(e.target.files?.item(0) ?? null)
          e.target.value = ''
        }}
      />
      {cv ? (
        <>
          <h2 className="text-lg font-extrabold text-lpo-ink">Your CV</h2>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-lpo-yellow/40 bg-lpo-yellow-soft/60 p-3.5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-lpo-yellow text-lpo-navy">
              <FileText className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-extrabold text-lpo-ink">{cv.name}</span>
              <span className="block text-xs font-semibold text-muted-foreground">
                {formatFileSize(cv.size)} · Uploaded {formatDate(cv.uploaded_at)}
              </span>
            </span>
          </div>
        </>
      ) : (
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
            <AlertTriangle className="size-5" />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-amber-900">Your CV is required</h2>
            <p className="mt-1 text-sm leading-relaxed text-amber-800/80">
              Upload your CV so our team can start assessing your application.
            </p>
          </div>
        </div>
      )}
      {error && <p className="mt-3 text-xs font-semibold text-rose-600">{error}</p>}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={cn(
          'mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-extrabold transition-all hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70',
          cv ? 'border border-border bg-white text-lpo-navy hover:border-lpo-navy/30' : 'bg-lpo-navy text-white',
        )}
      >
        {uploading ? <LoaderCircle className="size-4 animate-spin" /> : <FileUp className="size-4" />}
        {uploading ? 'Uploading…' : cv ? 'Replace CV' : 'Upload your CV'}
      </button>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">PDF, DOC, or DOCX up to 5 MB</p>
    </motion.section>
  )
}

const THEME = {
  talent: {
    page: 'bg-[#fffcf3]',
    hero: 'bg-lpo-navy',
    accentText: 'text-lpo-yellow',
    badge: 'bg-lpo-yellow text-lpo-navy',
    chip: 'bg-lpo-yellow-soft text-lpo-navy border-lpo-yellow/40',
    stepOn: 'bg-lpo-yellow text-lpo-navy',
    line: 'bg-lpo-yellow',
    radius: 'rounded-3xl',
    portal: 'LPO Careers',
  },
  client: {
    page: 'bg-[#f6f8fc]',
    hero: 'bg-gradient-to-br from-[#1463ff] via-[#0d46c9] to-lpo-navy',
    accentText: 'text-white',
    badge: 'bg-white text-lpo-blue',
    chip: 'bg-lpo-blue-soft text-lpo-blue border-lpo-blue/20',
    stepOn: 'bg-lpo-blue text-white',
    line: 'bg-lpo-blue',
    radius: 'rounded-2xl',
    portal: 'LPO for Business',
  },
} as const

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-b border-border/70 py-3.5 last:border-0">
      <dt className="text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-[15px] font-semibold break-words text-lpo-ink">{children}</dd>
    </div>
  )
}

function Chips({ items, className }: { items: Array<string>; className: string }) {
  if (items.length === 0) return <span className="text-muted-foreground">—</span>
  return (
    <span className="mt-1 flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className={cn('rounded-full border px-2.5 py-1 text-xs font-bold', className)}>
          {item}
        </span>
      ))}
    </span>
  )
}

function ProfileDetails({ session }: { session: AccountSession }) {
  if (session.type === 'admin') return null

  const theme = THEME[session.type]
  const { user } = session

  if (session.type === 'talent') {
    const p = session.profile
    return (
      <dl>
        <Detail label="Email">{user.email}</Detail>
        <Detail label="Mobile">{user.phone ?? '—'}</Detail>
        <Detail label="Location">{p?.location ?? '—'}</Detail>
        <Detail label="Desired position">{p?.desired_position ?? '—'}</Detail>
        <Detail label="Experience">{labelFor(EXPERIENCE_LEVELS, p?.experience_level)}</Detail>
        <Detail label="Work setup">{labelFor(WORK_SETUPS, p?.work_setup)}</Detail>
        <Detail label="Skills">
          <Chips items={p?.skills ?? []} className={theme.chip} />
        </Detail>
        {p?.linkedin_url && (
          <Detail label="LinkedIn / portfolio">
            <a href={p.linkedin_url} target="_blank" rel="noreferrer" className="text-lpo-navy underline decoration-lpo-yellow decoration-2 underline-offset-4">
              {p.linkedin_url}
            </a>
          </Detail>
        )}
      </dl>
    )
  }

  const p = session.profile
  return (
    <dl>
      <Detail label="Company">{p?.company_name ?? '—'}</Detail>
      {p?.company_website && (
        <Detail label="Website">
          <a href={p.company_website} target="_blank" rel="noreferrer" className="text-lpo-blue hover:underline">
            {p.company_website}
          </a>
        </Detail>
      )}
      <Detail label="Industry">{p?.industry ?? '—'}</Detail>
      <Detail label="Company size">{p?.company_size ? `${p.company_size} employees` : '—'}</Detail>
      <Detail label="Contact">
        {user.name}
        {p?.job_title && <span className="text-muted-foreground"> · {p.job_title}</span>}
      </Detail>
      <Detail label="Work email">{user.email}</Detail>
      {user.phone && <Detail label="Phone">{user.phone}</Detail>}
      <Detail label="Services requested">
        <Chips
          items={(p?.services ?? []).map((s) => labelFor(SERVICE_OPTIONS, s))}
          className={theme.chip}
        />
      </Detail>
      {p?.message && <Detail label="Project details">{p.message}</Detail>}
      {p?.engagement_type && (
        <Detail label="Engagement">
          {labelFor(ENGAGEMENT_TYPES, p.engagement_type)}
          {p.team_size ? (
            <span className="text-muted-foreground">
              {' '}
              · {p.team_size} {p.team_size === 1 ? 'seat' : 'seats'}
            </span>
          ) : null}
        </Detail>
      )}
      {p?.contract_start && (
        <Detail label="Contract">
          {formatDate(p.contract_start)} – {p.contract_end ? formatDate(p.contract_end) : 'Ongoing'}
        </Detail>
      )}
      {p?.account_manager && <Detail label="Account manager">{p.account_manager}</Detail>}
    </dl>
  )
}

export default function AccountPage({ accountType }: { accountType: AccountType }) {
  const navigate = useNavigate()
  const [session, setSession] = useState<AccountSession | null>(() => authService.getSession())
  const [loggingOut, setLoggingOut] = useState(false)
  const theme = THEME[accountType]

  useEffect(() => {
    let active = true
    authService
      .me()
      .then((fresh) => active && setSession(fresh))
      .catch(() => {
        if (active && !authService.isAuthenticated()) {
          navigate({ to: ACCOUNT_LOGIN[accountType], replace: true })
        }
      })
    return () => {
      active = false
    }
  }, [accountType, navigate])

  const logout = async () => {
    setLoggingOut(true)
    await authService.logout()
    navigate({ to: ACCOUNT_LOGIN[accountType], replace: true })
  }

  if (!session || session.type !== accountType) return null

  const firstName = session.user.name.split(' ')[0]
  const talentProfile = session.type === 'talent' ? session.profile : null
  const clientProfile = session.type === 'client' ? session.profile : null
  const steps = session.type === 'talent' ? talentSteps(talentProfile) : clientSteps(clientProfile)
  const talentBadge = talentProfile?.cv ? talentStatusMeta(talentProfile.status) : null
  const joined = session.user.created_at
    ? new Date(session.user.created_at).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <MotionConfig reducedMotion="user">
      <div className={cn('min-h-screen', theme.page)}>
        <section className={cn('relative overflow-hidden pb-28 text-white', theme.hero)}>
          {accountType === 'talent' ? (
            <div
              aria-hidden
              className="pointer-events-none absolute -top-40 -right-40 size-[520px] animate-[spin_60s_linear_infinite] rounded-full border-[46px] border-lpo-yellow/[0.08]"
            />
          ) : (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgb(255 255 255 / 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.5) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
                maskImage: 'radial-gradient(ellipse 70% 80% at 80% 20%, black, transparent)',
              }}
            />
          )}
          <div className="lpo-drift pointer-events-none absolute -bottom-40 -left-32 size-[420px] rounded-full bg-lpo-yellow/15 blur-[120px]" />

          <header className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6 sm:px-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/brand/lpo-mark.png" alt="LPO" className="size-10 rounded-xl" />
              <span className="leading-none">
                <span className="block text-base font-extrabold">LPO</span>
                <span className="mt-1 block text-[9px] font-bold tracking-[0.2em] text-white/60 uppercase">
                  {theme.portal}
                </span>
              </span>
            </Link>
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur transition-colors hover:bg-white/20 disabled:opacity-60"
            >
              <LogOut className="size-4" />
              {loggingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </header>

          <div className="relative mx-auto max-w-6xl px-6 pt-8 sm:px-10">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-extrabold tracking-[0.16em] uppercase',
                theme.badge,
              )}
            >
              {accountType === 'talent' ? (
                talentBadge ? (
                  <>
                    <talentBadge.icon className="size-3.5" />
                    Status: {talentBadge.label}
                  </>
                ) : (
                  <>
                    <AlertTriangle className="size-3.5" />
                    CV required
                  </>
                )
              ) : (
                <>
                  <CircleCheck className="size-3.5" />
                  {CLIENT_BADGE[clientProfile?.status ?? 'new_inquiry']}
                </>
              )}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
              className="mt-5 text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl"
            >
              Welcome, <span className={theme.accentText}>{firstName}</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
              className="mt-4 max-w-xl text-base leading-relaxed text-white/75"
            >
              {accountType === 'talent'
                ? talentIntro(talentProfile)
                : clientIntro(clientProfile)}
            </motion.p>
            {joined && (
              <p className="mt-3 text-xs font-semibold text-white/50">Member since {joined}</p>
            )}
          </div>
        </section>

        <main className="relative mx-auto -mt-20 grid max-w-6xl gap-6 px-6 pb-16 sm:px-10 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.25 }}
            className={cn('bg-white p-6 shadow-[0_30px_60px_-34px_rgb(11_37_89/0.4)] ring-1 ring-lpo-navy/[0.06] sm:p-8', theme.radius)}
          >
            <h2 className="text-lg font-extrabold text-lpo-ink">
              {accountType === 'talent' ? 'Your candidate profile' : 'Your service request'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {accountType === 'talent'
                ? 'This is what our recruiters see.'
                : 'Summary of what you shared with us.'}
            </p>
            <div className="mt-4">
              <ProfileDetails session={session} />
            </div>
          </motion.section>

          <div className="space-y-6">
            {session.type === 'talent' && (
              <TalentCvCard profile={talentProfile} onUploaded={setSession} />
            )}

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.35 }}
              className={cn('bg-white p-6 shadow-[0_30px_60px_-34px_rgb(11_37_89/0.4)] ring-1 ring-lpo-navy/[0.06] sm:p-8', theme.radius)}
            >
              <h2 className="text-lg font-extrabold text-lpo-ink">
                {accountType === 'talent' ? 'Application status' : 'Engagement status'}
              </h2>
              <ol className="relative mt-6 space-y-6">
                <span aria-hidden className="absolute top-4 bottom-4 left-[17px] w-px bg-border" />
                {steps.map(({ icon: Icon, title, text, state }, i) => (
                  <motion.li
                    key={title}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.12 }}
                    className="relative flex gap-4"
                  >
                    <span
                      className={cn(
                        'relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full ring-4 ring-white',
                        state === 'done' && theme.stepOn,
                        state === 'current' && 'bg-white text-lpo-navy shadow-[inset_0_0_0_2px_var(--lpo-yellow)]',
                        state === 'upcoming' && 'bg-lpo-surface text-lpo-navy/50',
                      )}
                    >
                      {state === 'current' && (
                        <span aria-hidden className="lpo-ping absolute inset-0 rounded-full bg-lpo-yellow/30" />
                      )}
                      <Icon className="relative size-4" />
                    </span>
                    <span className={cn(state === 'upcoming' && 'opacity-60')}>
                      <span className="flex items-center gap-2 text-sm font-extrabold text-lpo-ink">
                        {title}
                        {state === 'current' && (
                          <span className="rounded-full bg-lpo-yellow-soft px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-[#8a6a00] uppercase">
                            Current
                          </span>
                        )}
                      </span>
                      <span className="block text-[13px] leading-relaxed text-muted-foreground">{text}</span>
                    </span>
                  </motion.li>
                ))}
              </ol>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.45 }}
              className={cn('p-6 sm:p-7', theme.radius, accountType === 'talent' ? 'bg-lpo-yellow' : 'bg-lpo-navy text-white')}
            >
              <h2 className="text-base font-extrabold">Questions in the meantime?</h2>
              <p className={cn('mt-1 text-sm', accountType === 'talent' ? 'text-lpo-navy/75' : 'text-white/70')}>
                Our team is happy to help.
              </p>
              <a
                href={`mailto:${CONTACT.email}`}
                className={cn(
                  'mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5',
                  accountType === 'talent' ? 'bg-lpo-navy text-white' : 'bg-white text-lpo-navy',
                )}
              >
                <Mail className="size-4" />
                {CONTACT.email}
              </a>
            </motion.section>

            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-lpo-ink"
            >
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              Back to homepage
            </Link>
          </div>
        </main>
      </div>
    </MotionConfig>
  )
}
