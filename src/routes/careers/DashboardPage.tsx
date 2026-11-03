import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  ClipboardCheck,
  FileSignature,
  FileUp,
  Mail,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { CandidateProfile } from '@/types/auth'
import { CONTACT } from '@/components/home/content'
import { EASE_OUT } from '@/components/home/ui'
import { CAREERS_MODULES } from '@/components/careers/modules'
import {
  TALENT_STATUSES,
  talentStatusIndex,
  talentStatusMeta,
} from '@/lib/talentStatus'
import { cn } from '@/lib/utils'
import { useCareersSession } from '@/routes/careers/CareersSession'

type StepState = 'done' | 'current' | 'upcoming'
type Step = { icon: LucideIcon; title: string; text: string; state: StepState }

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
  if (!profile?.cv) {
    return 'Your account is ready. Upload your CV in Profile so our recruitment team can start assessing your application.'
  }
  if (profile.status === 'for_evaluation') {
    return 'Good news: you passed the assessment. Our team is now evaluating your profile for placement.'
  }
  if (profile.status === 'active') {
    return 'You are an active LPO talent. Use the modules on the left once your placement begins.'
  }
  return 'Thank you for applying to LPO. Your CV is with our recruitment team for assessment.'
}

const QUICK_LINKS = [
  { id: 'contract', icon: FileSignature },
  { id: 'work-diary', icon: BookOpenCheck },
  { id: 'payout', icon: Wallet },
  { id: 'attendance', icon: ClipboardCheck },
] as const

export default function DashboardPage() {
  const { session } = useCareersSession()
  const profile = session.profile
  const firstName = session.user.name.split(' ')[0]
  const steps = talentSteps(profile)
  const badge = profile?.cv ? talentStatusMeta(profile.status) : null
  const joined = session.user.created_at
    ? new Date(session.user.created_at).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <div className="mx-auto max-w-6xl">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="relative overflow-hidden rounded-3xl bg-lpo-navy px-6 py-8 text-white sm:px-8 sm:py-10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-28 -right-24 size-[360px] rounded-full border-[36px] border-lpo-yellow/[0.08]"
        />
        <div
          aria-hidden
          className="lpo-drift pointer-events-none absolute -bottom-28 -left-20 size-[280px] rounded-full bg-lpo-yellow/15 blur-[100px]"
        />

        <div className="relative">
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-extrabold tracking-[0.16em] uppercase',
              badge ? 'bg-lpo-yellow text-lpo-navy' : 'bg-amber-400 text-amber-950',
            )}
          >
            {badge ? (
              <>
                <badge.icon className="size-3.5" />
                Status: {badge.label}
              </>
            ) : (
              <>
                <AlertTriangle className="size-3.5" />
                CV required
              </>
            )}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
            Welcome, <span className="text-lpo-yellow">{firstName}</span>.
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">
            {talentIntro(profile)}
          </p>
          {joined && (
            <p className="mt-3 text-xs font-semibold text-white/45">Member since {joined}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/careers/account/profile"
              className="inline-flex items-center gap-2 rounded-full bg-lpo-yellow px-4 py-2.5 text-sm font-extrabold text-lpo-navy transition-transform hover:-translate-y-0.5"
            >
              View profile
              <ArrowRight className="size-4" />
            </Link>
            {!profile?.cv && (
              <Link
                to="/careers/account/profile"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                Upload CV
              </Link>
            )}
          </div>
        </div>
      </motion.section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE_OUT, delay: 0.08 }}
          className="rounded-3xl bg-white p-6 shadow-[0_24px_50px_-34px_rgb(11_37_89/0.35)] ring-1 ring-lpo-navy/[0.06] sm:p-7"
        >
          <h2 className="text-base font-extrabold text-lpo-ink">Application status</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Where you are in the LPO recruitment pipeline.
          </p>
          <ol className="relative mt-6 space-y-5">
            <span aria-hidden className="absolute top-4 bottom-4 left-[17px] w-px bg-border" />
            {steps.map(({ icon: Icon, title, text, state }, i) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.2 + i * 0.08 }}
                className="relative flex gap-4"
              >
                <span
                  className={cn(
                    'relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full ring-4 ring-white',
                    state === 'done' && 'bg-lpo-yellow text-lpo-navy',
                    state === 'current' &&
                      'bg-white text-lpo-navy shadow-[inset_0_0_0_2px_var(--lpo-yellow)]',
                    state === 'upcoming' && 'bg-lpo-surface text-lpo-navy/50',
                  )}
                >
                  {state === 'current' && (
                    <span
                      aria-hidden
                      className="lpo-ping absolute inset-0 rounded-full bg-lpo-yellow/30"
                    />
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
                  <span className="block text-[13px] leading-relaxed text-muted-foreground">
                    {text}
                  </span>
                </span>
              </motion.li>
            ))}
          </ol>
        </motion.section>

        <div className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_OUT, delay: 0.14 }}
            className="rounded-3xl bg-white p-6 shadow-[0_24px_50px_-34px_rgb(11_37_89/0.35)] ring-1 ring-lpo-navy/[0.06] sm:p-7"
          >
            <h2 className="text-base font-extrabold text-lpo-ink">Quick modules</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Placement tools unlock as your engagement starts.
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {QUICK_LINKS.map(({ id, icon: Icon }, i) => {
                const mod = CAREERS_MODULES.find((m) => m.id === id)!
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.06 }}
                  >
                    <Link
                      to={mod.path}
                      className="group flex items-center gap-3 rounded-2xl border border-lpo-navy/[0.06] bg-[#faf8f3] px-3.5 py-3 transition-colors hover:border-lpo-yellow/50 hover:bg-lpo-yellow-soft/50"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-lpo-navy text-white">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-extrabold text-lpo-ink">
                          {mod.label}
                        </span>
                        <span className="block truncate text-[11px] font-semibold text-muted-foreground">
                          On going
                        </span>
                      </span>
                      <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-lpo-navy" />
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_OUT, delay: 0.2 }}
            className="rounded-3xl bg-lpo-yellow p-6 sm:p-7"
          >
            <h2 className="text-base font-extrabold text-lpo-ink">Questions in the meantime?</h2>
            <p className="mt-1 text-sm text-lpo-navy/75">Our recruitment team is happy to help.</p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-lpo-navy px-4 py-2 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              <Mail className="size-4" />
              {CONTACT.email}
            </a>
          </motion.section>
        </div>
      </div>
    </div>
  )
}
