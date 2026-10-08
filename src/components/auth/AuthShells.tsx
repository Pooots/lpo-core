import {  useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Clock3,
  Rocket,
  Sparkles,
  UserPlus,
} from 'lucide-react'
import type {ReactNode} from 'react';
import type { Tone } from './fields'
import { cn } from '@/lib/utils'
import { CountUp, EASE_OUT } from '@/components/home/ui'

const CAREER_ROLES = [
  'Virtual Assistant',
  'Lead Researcher',
  'Appointment Setter',
  'Cold Caller',
  'CRM Specialist',
  'IT Support',
  'Data Analyst',
  'Executive Assistant',
]

const JOURNEY = [
  { icon: UserPlus, title: 'Create your profile', text: 'Tell us your skills and goals.' },
  { icon: Sparkles, title: 'Get matched', text: 'We pair you with the right roles.' },
  { icon: Rocket, title: 'Start working', text: 'Join a team that supports you.' },
]

const BUSINESS_POINTS = [
  'Dedicated, trained specialists',
  'Workflows built around your process',
  'Quality checks on every deliverable',
  'Flexible, month-to-month engagement',
]

const BUSINESS_BARS = [38, 54, 46, 70, 62, 84, 76, 96]

function useCycle(length: number, ms: number) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setI((p) => (p + 1) % length), ms)
    return () => window.clearInterval(id)
  }, [length, ms])
  return i
}

function Brand({ label, light = false }: { label: string; light?: boolean }) {
  return (
    <Link to="/" className="group/brand inline-flex items-center gap-3">
      <img
        src="/brand/lpo-mark.png"
        alt="LPO"
        className="size-10 rounded-xl transition-transform duration-500 group-hover/brand:rotate-[-8deg]"
      />
      <span className="leading-none">
        <span
          className={cn(
            'block text-base font-extrabold tracking-tight',
            light ? 'text-white' : 'text-lpo-navy',
          )}
        >
          LPO
        </span>
        <span
          className={cn(
            'mt-1 block text-[9px] font-bold tracking-[0.2em] uppercase',
            light ? 'text-white/60' : 'text-muted-foreground',
          )}
        >
          {label}
        </span>
      </span>
    </Link>
  )
}

function BackHome({ light = false }: { light?: boolean }) {
  return (
    <Link
      to="/get-started"
      className={cn(
        'group inline-flex items-center gap-2 text-sm font-bold transition-colors',
        light ? 'text-white/70 hover:text-white' : 'text-muted-foreground hover:text-lpo-ink',
      )}
    >
      <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
      Back
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/* Careers portal: warm, navy + yellow, panel on the left               */
/* ------------------------------------------------------------------ */

function CareersPanel() {
  const active = useCycle(JOURNEY.length, 2200)

  return (
    <aside className="relative hidden overflow-hidden bg-lpo-navy text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:p-12 xl:p-14">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 -bottom-48 size-[620px] animate-[spin_60s_linear_infinite] rounded-full border-[46px] border-lpo-yellow/[0.08]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-24 size-[380px] animate-[spin_40s_linear_infinite_reverse] rounded-full border-[2px] border-dashed border-lpo-yellow/25"
      />
      <div
        aria-hidden
        className="lpo-drift pointer-events-none absolute -top-32 -left-24 size-[420px] rounded-full bg-lpo-yellow/15 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(rgb(255 255 255) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      <motion.div
        className="relative"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Brand label="LPO Careers" light />
      </motion.div>

      <div className="relative">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-lpo-yellow/30 bg-lpo-yellow/10 px-3.5 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-lpo-yellow uppercase"
        >
          <span className="size-1.5 rounded-full bg-lpo-yellow" />
          For Job Seekers
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.2 }}
          className="mt-6 max-w-md text-4xl leading-[1.08] font-extrabold tracking-[-0.03em] xl:text-[2.9rem]"
        >
          Build your career with a team that{' '}
          <span className="relative inline-block text-lpo-yellow">
            values your work.
            <motion.span
              aria-hidden
              className="absolute inset-x-0 -bottom-1 h-[3px] origin-left rounded-full bg-lpo-yellow"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.9 }}
            />
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.35 }}
          className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70"
        >
          Join LPO&apos;s talent pool for remote roles in research, outreach, virtual
          assistance, and IT support.
        </motion.p>

        <div className="relative mt-10 space-y-1">
          <div aria-hidden className="absolute top-5 bottom-5 left-5 w-px bg-white/10" />
          <motion.div
            aria-hidden
            className="absolute top-5 left-5 w-px origin-top bg-lpo-yellow"
            animate={{ height: `${(active / (JOURNEY.length - 1)) * 80}%` }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          />
          {JOURNEY.map(({ icon: Icon, title, text }, i) => {
            const on = i <= active
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.5 + i * 0.15 }}
                className="relative flex items-center gap-4 py-2.5"
              >
                <span
                  className={cn(
                    'relative z-10 flex size-10 items-center justify-center rounded-xl transition-all duration-500',
                    on
                      ? 'bg-lpo-yellow text-lpo-navy shadow-[0_0_0_6px_rgb(255_199_0/0.15)]'
                      : 'bg-white/10 text-white/60',
                  )}
                >
                  <Icon className="size-[18px]" />
                </span>
                <span>
                  <span
                    className={cn(
                      'block text-sm font-extrabold transition-colors duration-500',
                      on ? 'text-white' : 'text-white/60',
                    )}
                  >
                    {title}
                  </span>
                  <span className="block text-xs text-white/50">{text}</span>
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="relative space-y-6">
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <div className="lpo-marquee flex w-max gap-2.5">
            {[...CAREER_ROLES, ...CAREER_ROLES].map((role, i) => (
              <span
                key={i}
                className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-bold whitespace-nowrap text-white/80"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.9 }}
          className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur"
        >
          <blockquote className="text-sm leading-relaxed text-white/80">
            “LPO gave me structure, real training, and a team that actually checks in.
            It&apos;s the first remote role that felt like a career.”
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-lpo-yellow text-xs font-extrabold text-lpo-navy">
              MR
            </span>
            <span>
              <span className="block text-sm font-bold">Maria R.</span>
              <span className="block text-xs text-white/50">Virtual Assistant, LPO</span>
            </span>
          </figcaption>
        </motion.figure>
      </div>
    </aside>
  )
}

export function CareersShell({
  children,
  switchPrompt,
}: {
  children: ReactNode
  switchPrompt: ReactNode
}) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#fffcf3] lg:grid lg:grid-cols-[0.92fr_1.08fr]">
        <CareersPanel />
        <main className="relative flex min-h-screen flex-col overflow-hidden">
          <div
            aria-hidden
            className="lpo-drift pointer-events-none absolute -top-40 -right-40 size-[460px] rounded-full bg-lpo-yellow/20 blur-[120px]"
          />
          <header className="relative flex items-center justify-between gap-4 px-6 py-6 sm:px-10">
            <div className="flex items-center gap-5">
              <div className="lg:hidden">
                <Brand label="LPO Careers" />
              </div>
              <div className="hidden lg:block">
                <BackHome />
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">{switchPrompt}</div>
          </header>

          <div className="relative mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 pb-10 sm:px-10">
            {children}
          </div>

          <footer className="relative flex flex-col items-center justify-between gap-2 border-t border-lpo-yellow/20 px-6 py-5 text-xs text-muted-foreground sm:flex-row sm:px-10">
            <span>© {new Date().getFullYear()} Laguna Personnel Outsourcing</span>
            <Link
              to="/business/register"
              className="group inline-flex items-center gap-1.5 font-bold text-lpo-navy"
            >
              Looking for our services instead?
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </footer>
        </main>
      </div>
    </MotionConfig>
  )
}

/* ------------------------------------------------------------------ */
/* Business portal: crisp, royal blue gradient, panel on the right      */
/* ------------------------------------------------------------------ */

function BusinessPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#1463ff] via-[#0d46c9] to-lpo-navy text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:p-12 xl:p-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(255 255 255 / 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 70% 30%, black, transparent)',
        }}
      />
      <div
        aria-hidden
        className="lpo-drift pointer-events-none absolute -top-40 -right-32 size-[460px] rounded-full bg-[#5b9bff]/40 blur-[120px]"
      />
      <div
        aria-hidden
        className="lpo-drift pointer-events-none absolute -bottom-40 -left-20 size-[380px] rounded-full bg-lpo-yellow/20 blur-[120px]"
        style={{ animationDelay: '-7s' }}
      />

      <motion.div
        className="relative flex items-center justify-between"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Brand label="LPO for Business" light />
        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-extrabold tracking-[0.18em] uppercase backdrop-blur">
          Business Portal
        </span>
      </motion.div>

      <div className="relative">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.15 }}
          className="max-w-md text-4xl leading-[1.08] font-extrabold tracking-[-0.03em] xl:text-[2.9rem]"
        >
          Scale your operations with a dedicated team.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.3 }}
          className="mt-5 max-w-md text-[15px] leading-relaxed text-white/75"
        >
          Lead generation, outreach, virtual assistance, and IT support—scoped around
          your goals and run by people who care about quality.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.45 }}
          className="relative mt-9 max-w-md rounded-3xl border border-white/15 bg-white/10 p-5 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-extrabold tracking-[0.18em] text-white/60 uppercase">
              Engagement overview
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
              <span className="lpo-ping relative inline-flex size-1.5 rounded-full bg-emerald-300" />
              On track
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { to: 2500, suffix: '+', label: 'Prospects' },
              { to: 94, suffix: '%', label: 'Verified' },
              { to: 48, suffix: 'h', label: 'Proposal' },
            ].map((m) => (
              <div key={m.label} className="rounded-xl bg-white/10 px-3 py-2.5">
                <CountUp
                  to={m.to}
                  suffix={m.suffix}
                  delay={0.6}
                  className="block text-xl font-extrabold"
                />
                <span className="text-[10px] font-bold tracking-[0.12em] text-white/60 uppercase">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex h-16 items-end gap-1.5">
            {BUSINESS_BARS.map((h, i) => (
              <motion.span
                key={i}
                className={cn(
                  'flex-1 origin-bottom rounded-t-md',
                  i === BUSINESS_BARS.length - 1 ? 'bg-lpo-yellow' : 'bg-white/35',
                )}
                style={{ height: `${h}%` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: [0, 1, 0.85, 1] }}
                transition={{
                  duration: 1.4,
                  delay: 0.8 + i * 0.07,
                  ease: EASE_OUT,
                  times: [0, 0.6, 0.8, 1],
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 1.4 }}
            className="absolute -right-6 -bottom-7"
          >
            <div className="lpo-float flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 text-lpo-ink shadow-[0_20px_40px_-18px_rgb(0_0_0/0.6)]">
              <span className="flex size-8 items-center justify-center rounded-lg bg-lpo-yellow">
                <Clock3 className="size-4" />
              </span>
              <span>
                <span className="block text-xs font-extrabold">Proposal ready</span>
                <span className="block text-[10px] text-muted-foreground">within 48 hours</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <ul className="relative grid max-w-md grid-cols-2 gap-x-4 gap-y-3">
        {BUSINESS_POINTS.map((point, i) => (
          <motion.li
            key={point}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
            className="flex items-start gap-2.5 text-[13px] font-semibold text-white/85"
          >
            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-white text-lpo-blue">
              <Check className="size-2.5" strokeWidth={4} />
            </span>
            {point}
          </motion.li>
        ))}
      </ul>
    </aside>
  )
}

export function BusinessShell({
  children,
  switchPrompt,
}: {
  children: ReactNode
  switchPrompt: ReactNode
}) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white lg:grid lg:grid-cols-[1.08fr_0.92fr]">
        <main className="relative flex min-h-screen flex-col overflow-hidden">
          <div aria-hidden className="lpo-grid-bg pointer-events-none absolute inset-0" />
          <header className="relative flex items-center justify-between gap-4 px-6 py-6 sm:px-10">
            <div className="flex items-center gap-5">
              <div className="lg:hidden">
                <Brand label="LPO for Business" />
              </div>
              <div className="hidden lg:block">
                <BackHome />
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">{switchPrompt}</div>
          </header>

          <div className="relative mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 pb-10 sm:px-10">
            {children}
          </div>

          <footer className="relative flex flex-col items-center justify-between gap-2 border-t px-6 py-5 text-xs text-muted-foreground sm:flex-row sm:px-10">
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="size-3.5 text-lpo-blue" />
              Your information is kept private and secure.
            </span>
            <Link
              to="/careers/register"
              className="group inline-flex items-center gap-1.5 font-bold text-lpo-blue"
            >
              Looking for work instead?
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </footer>
        </main>
        <BusinessPanel />
      </div>
    </MotionConfig>
  )
}

/* ------------------------------------------------------------------ */
/* Shared form chrome                                                   */
/* ------------------------------------------------------------------ */

export function FormHeader({
  tone,
  eyebrow,
  title,
  description,
}: {
  tone: Tone
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
    >
      <p
        className={cn(
          'text-xs font-extrabold tracking-[0.2em] uppercase',
          tone === 'careers' ? 'text-[#b08600]' : 'text-lpo-blue',
        )}
      >
        {eyebrow}
      </p>
      <h1 className="mt-3 text-[2rem] leading-[1.1] font-extrabold tracking-[-0.03em] text-lpo-ink sm:text-[2.4rem]">
        {title}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{description}</p>
    </motion.div>
  )
}

export function Stepper({
  tone,
  steps,
  current,
}: {
  tone: Tone
  steps: ReadonlyArray<string>
  current: number
}) {
  const fill = tone === 'careers' ? 'bg-lpo-yellow' : 'bg-lpo-blue'
  const doneDot =
    tone === 'careers' ? 'bg-lpo-yellow text-lpo-ink' : 'bg-lpo-blue text-white'
  const activeRing =
    tone === 'careers'
      ? 'border-lpo-yellow text-lpo-ink ring-4 ring-lpo-yellow/25'
      : 'border-lpo-blue text-lpo-blue ring-4 ring-lpo-blue/15'

  return (
    <div className="mt-8">
      <div className="relative flex items-center justify-between">
        <div aria-hidden className="absolute inset-x-4 top-4 h-0.5 rounded-full bg-border" />
        <motion.div
          aria-hidden
          className={cn('absolute top-4 left-4 h-0.5 rounded-full', fill)}
          initial={false}
          animate={{ width: `calc(${(current / (steps.length - 1)) * 100}% - ${(current / (steps.length - 1)) * 2}rem)` }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        />
        {steps.map((step, i) => {
          const done = i < current
          const active = i === current
          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-2">
              <motion.span
                initial={false}
                animate={{ scale: active ? 1.08 : 1 }}
                className={cn(
                  'flex size-8 items-center justify-center rounded-full border-2 text-xs font-extrabold transition-colors duration-500',
                  done
                    ? cn(doneDot, 'border-transparent')
                    : active
                      ? cn('bg-white', activeRing)
                      : 'border-border bg-white text-muted-foreground',
                )}
              >
                {done ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </motion.span>
              <span
                className={cn(
                  'text-[11px] font-bold whitespace-nowrap transition-colors',
                  active || done ? 'text-lpo-ink' : 'text-muted-foreground',
                )}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function StepPanel({
  stepKey,
  direction,
  children,
}: {
  stepKey: number
  direction: 1 | -1
  children: ReactNode
}) {
  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div
        key={stepKey}
        custom={direction}
        variants={{
          enter: (d: number) => ({ opacity: 0, x: d * 40 }),
          center: { opacity: 1, x: 0 },
          exit: (d: number) => ({ opacity: 0, x: d * -40 }),
        }}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.35, ease: EASE_OUT }}
        className="space-y-5"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
