import {  useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Handshake,
  
  ShieldCheck,
  Sparkles
} from 'lucide-react'
import type {KeyboardEvent} from 'react';
import type {LucideIcon} from 'lucide-react';
import type { AccountType } from '@/types/auth'
import { cn } from '@/lib/utils'
import { EASE_OUT } from '@/components/home/ui'

type Option = {
  type: AccountType
  eyebrow: string
  title: string
  description: string
  cta: string
  icon: LucideIcon
  iconClass: string
  perks: Array<string>
  register: '/careers/register' | '/business/register'
  login: '/careers/login' | '/business/login'
}

const OPTIONS: Array<Option> = [
  {
    type: 'talent',
    eyebrow: 'For Job Seekers',
    title: 'Are you looking for Work?',
    description:
      'Send us your details and our recruitment team will keep your profile on file for upcoming roles.',
    cta: 'Apply as a candidate',
    icon: BriefcaseBusiness,
    iconClass: 'bg-[#f4ecdc] text-lpo-navy',
    perks: ['Remote-first roles', 'Training & coaching', 'Career growth'],
    register: '/careers/register',
    login: '/careers/login',
  },
  {
    type: 'client',
    eyebrow: 'For Businesses',
    title: 'Are you looking for our services?',
    description:
      'Tell us what your business needs and we will scope the right service, workflow, or support team.',
    cta: 'Request our services',
    icon: Handshake,
    iconClass: 'bg-lpo-yellow text-lpo-navy',
    perks: ['Dedicated specialists', 'Custom workflows', 'Proposal in 48h'],
    register: '/business/register',
    login: '/business/login',
  },
]

function ChoiceCard({
  option,
  selected,
  index,
  onSelect,
  onContinue,
}: {
  option: Option
  selected: boolean
  index: number
  onSelect: () => void
  onContinue: () => void
}) {
  const Icon = option.icon

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') onContinue()
    if (e.key === ' ') {
      e.preventDefault()
      onSelect()
    }
  }

  return (
    <motion.div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onSelect}
      onDoubleClick={onContinue}
      onKeyDown={onKeyDown}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.35 + index * 0.12 }}
      whileHover={{ y: -6 }}
      className={cn(
        'group relative flex cursor-pointer flex-col overflow-hidden rounded-[28px] border-2 bg-white p-7 text-left outline-none transition-[border-color,box-shadow] duration-500 focus-visible:ring-4 focus-visible:ring-lpo-blue/20 sm:p-9 short:p-7 shorter:rounded-3xl shorter:p-6',
        selected
          ? 'border-lpo-blue shadow-[0_30px_70px_-30px_rgb(255_199_0/0.9),0_0_0_6px_rgb(255_199_0/0.12)]'
          : 'border-transparent shadow-[0_24px_60px_-34px_rgb(11_37_89/0.35)] ring-1 ring-lpo-navy/[0.06] hover:shadow-[0_30px_70px_-30px_rgb(11_37_89/0.45)]',
      )}
    >
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1.5 origin-left bg-gradient-to-r from-lpo-blue via-[#6a8dff] to-lpo-yellow"
        initial={false}
        animate={{ scaleX: selected ? 1 : 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      />
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute -top-24 -right-24 size-64 rounded-full blur-3xl transition-opacity duration-700',
          option.type === 'talent' ? 'bg-lpo-yellow/25' : 'bg-lpo-blue/15',
          selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-60',
        )}
      />

      <AnimatePresence>
        {selected && (
          <motion.span
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ type: 'spring', stiffness: 380, damping: 20 }}
            className="absolute top-6 right-6 flex size-9 shorter:top-5 shorter:right-5 shorter:size-8 items-center justify-center rounded-full bg-lpo-blue text-white shadow-[0_10px_20px_-8px_rgb(20_99_255/0.9)]"
          >
            <Check className="size-[18px]" strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>

      <motion.span
        className={cn(
          'relative flex size-16 items-center justify-center rounded-2xl short:size-14 shorter:size-12 shorter:rounded-xl',
          option.iconClass,
        )}
        animate={selected ? { rotate: [0, -8, 6, 0], scale: [1, 1.08, 1] } : {}}
        transition={{ duration: 0.7 }}
      >
        <Icon className="size-7 shorter:size-6" strokeWidth={2.2} />
      </motion.span>

      <p className="relative mt-8 text-xs font-extrabold tracking-[0.2em] text-muted-foreground uppercase short:mt-6 shorter:mt-4">
        {option.eyebrow}
      </p>
      <h2 className="relative mt-3 text-[1.75rem] leading-[1.15] font-extrabold tracking-[-0.02em] text-lpo-ink sm:text-[2rem] short:text-[1.7rem] shorter:mt-2 shorter:text-[1.45rem]">
        {option.title}
      </h2>
      <p className="relative mt-4 text-[15px] leading-relaxed text-muted-foreground short:mt-3 shorter:mt-2 shorter:text-sm">
        {option.description}
      </p>

      <ul className="relative mt-6 flex flex-wrap gap-2 short:mt-4 shorter:hidden">
        {option.perks.map((perk) => (
          <li
            key={perk}
            className={cn(
              'rounded-full px-3 py-1 text-[11px] font-bold transition-colors duration-500',
              selected ? 'bg-lpo-blue-soft text-lpo-blue' : 'bg-lpo-surface text-lpo-navy/70',
            )}
          >
            {perk}
          </li>
        ))}
      </ul>

      <div className="flex-1" />
      <div className="relative mt-8 flex items-center justify-between border-t pt-6 short:mt-6 short:pt-5 shorter:mt-4 shorter:pt-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={selected ? 'selected' : 'idle'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className={cn(
              'text-xs font-extrabold tracking-[0.18em] uppercase',
              selected ? 'text-lpo-blue' : 'text-lpo-navy',
            )}
          >
            {selected ? 'Selected' : option.cta}
          </motion.span>
        </AnimatePresence>
        <button
          type="button"
          aria-label={`Continue: ${option.cta}`}
          onClick={(e) => {
            e.stopPropagation()
            onContinue()
          }}
          className={cn(
            'flex size-11 items-center justify-center rounded-full transition-all duration-500',
            selected
              ? 'bg-lpo-blue text-white shadow-[0_12px_24px_-10px_rgb(20_99_255/0.9)]'
              : 'bg-[#f4ecdc] text-lpo-navy group-hover:bg-lpo-yellow',
          )}
        >
          <ArrowRight className="size-[18px] transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>
    </motion.div>
  )
}

export default function GetStartedPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<AccountType | null>(null)
  const current = OPTIONS.find((o) => o.type === selected) ?? null

  const go = (option: Option) => navigate({ to: option.register })

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[#f6f8fc] md:h-dvh md:min-h-0">
        <div aria-hidden className="lpo-grid-bg pointer-events-none absolute inset-0 opacity-70" />
        <div
          aria-hidden
          className="lpo-drift pointer-events-none absolute -top-48 -left-40 size-[560px] rounded-full bg-lpo-yellow/25 blur-[130px]"
        />
        <div
          aria-hidden
          className="lpo-drift pointer-events-none absolute -right-40 -bottom-48 size-[560px] rounded-full bg-lpo-blue/15 blur-[130px]"
          style={{ animationDelay: '-9s' }}
        />

        <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-6 sm:px-10 short:py-4 shorter:py-3">
          <Link to="/" className="group inline-flex items-center gap-3">
            <img
              src="/brand/lpo-mark.png"
              alt="LPO"
              className="size-10 rounded-xl transition-transform duration-500 group-hover:rotate-[-8deg]"
            />
            <span className="leading-none">
              <span className="block text-base font-extrabold tracking-tight text-lpo-navy">LPO</span>
              <span className="mt-1 block text-[9px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                Laguna Personnel Outsourcing
              </span>
            </span>
          </Link>
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-full border bg-white/80 px-4 py-2 text-sm font-bold text-lpo-navy backdrop-blur transition-colors hover:border-lpo-navy/30"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Back to home</span>
            <span className="sm:hidden">Home</span>
          </Link>
        </header>

        <main className="relative mx-auto flex w-full max-w-6xl min-h-0 flex-1 flex-col justify-center px-6 pt-6 pb-16 sm:px-10 md:pb-10 short:pt-0 short:pb-6 shorter:pb-4">
          <div className="mx-auto max-w-2xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
              className="inline-flex items-center gap-2 rounded-full border border-lpo-yellow/40 bg-lpo-yellow-soft px-4 py-1.5 text-[11px] font-extrabold tracking-[0.2em] text-[#8a6a00] uppercase shorter:hidden"
            >
              <Sparkles className="size-3.5" />
              Get Started
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
              className="mt-5 text-[2.2rem] leading-[1.08] font-extrabold tracking-[-0.035em] text-lpo-ink sm:text-5xl short:mt-3 short:text-[2.6rem] shorter:mt-0 shorter:text-[2.2rem]"
            >
              How can we{' '}
              <span className="relative inline-block">
                <span className="relative z-10">help you</span>
                <motion.span
                  aria-hidden
                  className="absolute inset-x-[-4px] bottom-1 z-0 h-3 origin-left rounded-sm bg-lpo-yellow/70 sm:h-4"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.7 }}
                />
              </span>{' '}
              today?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
              className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg short:mt-3 short:text-base shorter:mt-2"
            >
              Choose the option that fits you best. We&apos;ll set up an account tailored to
              what you need.
            </motion.p>
          </div>

          <div
            role="radiogroup"
            aria-label="Account type"
            className="mx-auto mt-12 grid w-full max-w-5xl gap-6 md:grid-cols-2 md:gap-8 short:mt-7 shorter:mt-5"
          >
            {OPTIONS.map((option, i) => (
              <ChoiceCard
                key={option.type}
                option={option}
                index={i}
                selected={selected === option.type}
                onSelect={() => setSelected(option.type)}
                onContinue={() => go(option)}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.65 }}
            className="mx-auto mt-10 flex w-full max-w-md flex-col items-center gap-4 short:mt-7 short:gap-3 shorter:mt-5"
          >
            <motion.button
              type="button"
              disabled={!current}
              onClick={() => current && go(current)}
              whileHover={current ? { y: -2 } : undefined}
              whileTap={current ? { scale: 0.98 } : undefined}
              className={cn(
                'lpo-shine group inline-flex h-14 w-full short:h-12 items-center justify-center gap-2 rounded-full text-base font-extrabold transition-all duration-500',
                current
                  ? 'bg-lpo-blue text-white shadow-[0_20px_40px_-18px_rgb(20_99_255/1)]'
                  : 'cursor-not-allowed bg-lpo-navy/10 text-lpo-navy/40',
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={current?.type ?? 'none'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {current
                    ? current.type === 'talent'
                      ? 'Continue as a job seeker'
                      : 'Continue as a business'
                    : 'Select an option to continue'}
                </motion.span>
              </AnimatePresence>
              {current && (
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              )}
            </motion.button>

            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              {current ? (
                <Link to={current.login} className="font-bold text-lpo-blue hover:underline">
                  Sign in{current.type === 'talent' ? ' to LPO Careers' : ' to LPO for Business'}
                </Link>
              ) : (
                <>
                  <Link to="/careers/login" className="font-bold text-lpo-navy hover:underline">
                    Candidate sign in
                  </Link>
                  <span className="mx-2 text-border">|</span>
                  <Link to="/business/login" className="font-bold text-lpo-blue hover:underline">
                    Business sign in
                  </Link>
                </>
              )}
            </p>

            <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground shorter:hidden">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              Free to join. Your details stay private.
            </p>
          </motion.div>
        </main>
      </div>
    </MotionConfig>
  )
}
