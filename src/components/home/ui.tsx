import {
  
  
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import {
  
  animate,
  motion,
  useInView,
  useReducedMotion
} from 'framer-motion'
import { Link  } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import type {Variants} from 'framer-motion';
import type {MouseEvent, ReactNode} from 'react';
import type {LinkProps} from '@tanstack/react-router';
import { cn } from '@/lib/utils'

export const EASE_OUT = [0.22, 1, 0.36, 1] as const

export const INTRO_SEEN_KEY = 'lpo-intro-seen'

/** Seconds the brand splash covers the page; above-the-fold animations wait for it. */
export const INTRO_DURATION = 1.9

export const IntroDelayContext = createContext(0)

export function useIntroDelay() {
  return useContext(IntroDelayContext)
}

export function scrollToHash(href: string) {
  const el = document.getElementById(href.replace(/^#/, ''))
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Container({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-5 sm:px-8', className)}>
      {children}
    </div>
  )
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  x = 0,
  scale = 1,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  x?: number
  scale?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.75, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  )
}

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
}

export const popItem: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 14 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
}

export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
  variants = fadeUpItem,
}: {
  children: ReactNode
  className?: string
  variants?: Variants
}) {
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  )
}

export function SectionLabel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        'text-xs font-extrabold tracking-[0.22em] text-lpo-blue uppercase',
        className,
      )}
    >
      {children}
    </p>
  )
}

export function SectionTitle({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        'text-[2rem] leading-[1.08] font-extrabold tracking-[-0.03em] text-lpo-ink sm:text-[2.75rem]',
        className,
      )}
    >
      {children}
    </h2>
  )
}

export function SectionHeading({
  label,
  title,
  description,
  className,
}: {
  label: string
  title: ReactNode
  description?: ReactNode
  className?: string
}) {
  return (
    <Reveal className={cn('mx-auto max-w-3xl text-center', className)}>
      <SectionLabel>{label}</SectionLabel>
      <SectionTitle className="mt-4">{title}</SectionTitle>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  )
}

type CtaVariant = 'yellow' | 'outline' | 'blue' | 'navy'

const CTA_VARIANTS: Record<CtaVariant, string> = {
  yellow:
    'bg-lpo-yellow text-lpo-ink shadow-[0_12px_28px_-12px_rgb(255_199_0/0.9)] hover:bg-[#ffcf24] hover:shadow-[0_18px_36px_-14px_rgb(255_199_0/1)]',
  outline:
    'border border-lpo-navy/15 bg-white text-lpo-navy hover:border-lpo-navy/35 hover:shadow-[0_14px_30px_-18px_rgb(11_37_89/0.4)]',
  blue: 'bg-lpo-blue text-white shadow-[0_12px_28px_-12px_rgb(20_99_255/0.8)] hover:bg-[#0f57ec]',
  navy: 'bg-lpo-navy text-white shadow-[0_12px_28px_-12px_rgb(11_37_89/0.8)] hover:bg-[#0f2f6f]',
}

export function CtaLink({
  href,
  to,
  children,
  variant = 'yellow',
  arrow = true,
  size = 'md',
  className,
  onClick,
}: {
  href?: string
  to?: LinkProps['to']
  children: ReactNode
  variant?: CtaVariant
  arrow?: boolean
  size?: 'sm' | 'md'
  className?: string
  onClick?: () => void
}) {
  const classes = cn(
    'group lpo-shine inline-flex items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
    size === 'md' ? 'h-12 px-7 text-[15px]' : 'h-11 px-6 text-sm',
    CTA_VARIANTS[variant],
    className,
  )
  const content = (
    <>
      {children}
      {arrow && (
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  )

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={classes}>
        {content}
      </Link>
    )
  }

  const target = href ?? '#'

  return (
    <a
      href={target}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.()
        if (!target.startsWith('#')) return
        e.preventDefault()
        scrollToHash(target)
      }}
      className={classes}
    >
      {content}
    </a>
  )
}

export function TextLink({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      onClick={(e) => {
        if (!href.startsWith('#')) return
        e.preventDefault()
        scrollToHash(href)
      }}
      className={cn(
        'group/link inline-flex items-center gap-1.5 text-sm font-bold text-lpo-blue',
        className,
      )}
    >
      {children}
      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
    </a>
  )
}

export function CountUp({
  to,
  suffix = '',
  duration = 1.8,
  delay = 0,
  className,
}: {
  to: number
  suffix?: string
  duration?: number
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduceMotion = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      setValue(to)
      return
    }
    const controls = animate(0, to, {
      duration,
      delay,
      ease: EASE_OUT,
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, reduceMotion, to, duration, delay])

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString('en-US')}
      {suffix}
    </span>
  )
}

/** Steps through 0..length-1 on an interval while `enabled`. */
export function useCycleIndex(length: number, intervalMs: number, enabled: boolean) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!enabled) return
    const id = window.setInterval(
      () => setIndex((prev) => (prev + 1) % length),
      intervalMs,
    )
    return () => window.clearInterval(id)
  }, [length, intervalMs, enabled])

  return index
}

/** Feeds the cursor position into --x / --y for spotlight hover effects. */
export function trackPointer(e: MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`)
}

export function Spotlight({ color = 'rgb(20 99 255 / 0.09)' }: { color?: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      style={{
        background: `radial-gradient(280px circle at var(--x, 50%) var(--y, 50%), ${color}, transparent 70%)`,
      }}
    />
  )
}
