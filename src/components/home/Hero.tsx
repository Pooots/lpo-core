import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { CircleCheck, Search, ShieldCheck, Users } from 'lucide-react'
import { Container, CountUp, CtaLink, EASE_OUT, useIntroDelay } from './ui'
import type { MouseEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

const HEADLINE = ['Your Business', 'Growth.']
const HIGHLIGHT = 'Our Team Behind It.'

const BARS: Array<{ height: number; tone: 'yellow' | 'blue' }> = [
  { height: 42, tone: 'yellow' },
  { height: 68, tone: 'blue' },
  { height: 50, tone: 'yellow' },
  { height: 82, tone: 'yellow' },
  { height: 62, tone: 'blue' },
  { height: 100, tone: 'yellow' },
  { height: 76, tone: 'yellow' },
]

const PIPELINE_STATS = [
  { value: 2500, suffix: '+', label: 'Researched' },
  { value: 1840, label: 'ICP Qualified' },
  { value: 1120, label: 'Outreach Ready' },
]

function enter(delay: number) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE_OUT, delay },
  }
}

function HeadlineLine({
  text,
  delay,
  highlight = false,
}: {
  text: string
  delay: number
  highlight?: boolean
}) {
  delay += useIntroDelay()

  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className="relative inline-block"
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay }}
      >
        {highlight && (
          <motion.span
            aria-hidden
            className="absolute inset-x-0 bottom-[0.04em] -z-10 h-[0.24em] origin-left rounded-sm bg-lpo-yellow/85"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: delay + 0.6 }}
          />
        )}
        {text}
      </motion.span>
    </span>
  )
}

function FloatingCard({
  children,
  className,
  delay,
  floatClass = 'lpo-float',
}: {
  children: ReactNode
  className?: string
  delay: number
  floatClass?: string
}) {
  delay += useIntroDelay()

  return (
    <motion.div
      className={cn('absolute z-20', className)}
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, delay }}
    >
      <div className={floatClass}>{children}</div>
    </motion.div>
  )
}

function HeroDashboard() {
  const d = useIntroDelay()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), {
    stiffness: 150,
    damping: 18,
  })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), {
    stiffness: 150,
    damping: 18,
  })

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div
      className="relative mx-auto w-full max-w-[560px] px-3 py-10 [perspective:1400px] sm:px-8"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: EASE_OUT, delay: d + 0.5 }}
        className="relative rounded-[28px] border border-border/80 bg-white p-5 shadow-[0_40px_90px_-40px_rgb(11_37_89/0.35)] sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.2em] text-muted-foreground uppercase">
              Prospect Pipeline
            </p>
            <p className="mt-1.5 text-lg font-extrabold text-lpo-ink">
              This Week&apos;s Output
            </p>
          </div>
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-lpo-blue-soft px-2.5 py-1 text-[11px] font-bold text-lpo-blue">
            <span className="relative flex size-1.5">
              <span className="lpo-ping absolute inline-flex size-full rounded-full bg-lpo-blue" />
              <span className="relative inline-flex size-1.5 rounded-full bg-lpo-blue" />
            </span>
            Live
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {PIPELINE_STATS.map((stat) => (
            <div key={stat.label} className="rounded-xl bg-lpo-surface px-3 py-3">
              <CountUp
                to={stat.value}
                suffix={stat.suffix}
                duration={2.2}
                delay={d + 0.8}
                className="block text-lg font-extrabold text-lpo-navy sm:text-xl"
              />
              <span className="mt-0.5 block text-[10px] font-bold tracking-[0.12em] text-muted-foreground uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex h-40 items-end gap-2.5 sm:h-44 sm:gap-3">
          {BARS.map((bar, i) => (
            <motion.div
              key={i}
              className="h-full flex-1 origin-bottom"
              style={{ height: `${bar.height}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: d + 0.9 + i * 0.08 }}
            >
              <motion.div
                className={cn(
                  'h-full w-full origin-bottom rounded-t-lg rounded-b-sm transition-[filter] hover:brightness-110',
                  bar.tone === 'yellow' ? 'bg-lpo-yellow' : 'bg-lpo-blue',
                )}
                animate={{ scaleY: [1, 0.86, 1] }}
                transition={{
                  duration: 3.2 + i * 0.35,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: d + 2 + i * 0.2,
                }}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-5 border-t pt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-muted-foreground">Verification rate</span>
            <CountUp
              to={94}
              suffix="%"
              delay={d + 1.3}
              className="font-extrabold text-lpo-navy"
            />
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-lpo-surface">
            <motion.div
              className="relative h-full overflow-hidden rounded-full bg-lpo-blue"
              initial={{ width: '0%' }}
              animate={{ width: '94%' }}
              transition={{ duration: 1.6, ease: EASE_OUT, delay: d + 1.3 }}
            >
              <motion.span
                aria-hidden
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                initial={{ x: '-120%' }}
                animate={{ x: '320%' }}
                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut', delay: d + 3 }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <FloatingCard className="-top-0 right-0 sm:-right-2" delay={1.4}>
        <span className="flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3.5 py-2 text-xs font-bold text-lpo-ink shadow-[0_12px_30px_-14px_rgb(11_37_89/0.45)]">
          <CircleCheck className="size-4 text-emerald-500" />
          ICP Qualified
        </span>
      </FloatingCard>

      <FloatingCard
        className="top-14 -left-1 sm:-left-6"
        delay={1.2}
        floatClass="lpo-float-slow"
      >
        <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-white px-3.5 py-3 shadow-[0_18px_40px_-18px_rgb(11_37_89/0.45)]">
          <span className="flex size-9 items-center justify-center rounded-xl bg-lpo-yellow text-lpo-ink">
            <Search className="size-4" strokeWidth={2.5} />
          </span>
          <span>
            <CountUp
              to={2500}
              suffix="+"
              delay={d + 1.2}
              className="block text-sm font-extrabold text-lpo-ink"
            />
            <span className="block text-[11px] font-medium text-muted-foreground">
              Prospects Researched
            </span>
          </span>
        </div>
      </FloatingCard>

      <FloatingCard className="bottom-2 -left-1 sm:-left-4" delay={1.6} floatClass="lpo-float-slow">
        <span className="flex items-center gap-2 rounded-full border border-border/80 bg-white px-3.5 py-2 text-xs font-bold text-lpo-ink shadow-[0_12px_30px_-14px_rgb(11_37_89/0.45)]">
          <span className="relative flex size-2">
            <span className="lpo-ping absolute inline-flex size-full rounded-full bg-lpo-yellow" />
            <span className="relative inline-flex size-2 rounded-full bg-lpo-yellow" />
          </span>
          Outreach Ready
        </span>
      </FloatingCard>

      <FloatingCard className="-bottom-3 right-0 sm:-right-6" delay={1.8}>
        <div className="w-52 rounded-2xl border border-border/80 bg-white p-3.5 shadow-[0_22px_50px_-20px_rgb(11_37_89/0.5)]">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-lpo-blue text-white">
              <Users className="size-4" />
            </span>
            <span>
              <span className="block text-sm font-extrabold text-lpo-ink">Remote Support</span>
              <span className="block text-[11px] text-muted-foreground">Team assigned</span>
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex -space-x-2">
              {['AR', 'JM', 'KC'].map((initials, i) => (
                <motion.span
                  key={initials}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: d + 2.1 + i * 0.12 }}
                  className="flex size-7 items-center justify-center rounded-full bg-lpo-navy text-[9px] font-bold text-white ring-2 ring-white"
                >
                  {initials}
                </motion.span>
              ))}
            </div>
            <span className="text-[11px] font-semibold text-muted-foreground">
              +6 specialists
            </span>
          </div>
        </div>
      </FloatingCard>
    </div>
  )
}

export function Hero() {
  const d = useIntroDelay()

  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24">
      <div aria-hidden className="lpo-grid-bg pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="lpo-drift pointer-events-none absolute -top-40 right-[-10%] size-[620px] rounded-full bg-lpo-yellow/20 blur-[110px]"
      />
      <div
        aria-hidden
        className="lpo-drift pointer-events-none absolute bottom-[-20%] left-[-10%] size-[520px] rounded-full bg-lpo-blue/10 blur-[120px]"
        style={{ animationDelay: '-6s' }}
      />

      <Container className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div>
          <motion.span
            {...enter(d + 0.25)}
            className="inline-flex items-center gap-2.5 rounded-full border bg-white/90 px-4 py-2 text-[11px] font-extrabold tracking-[0.18em] text-lpo-navy uppercase shadow-sm"
          >
            <span className="relative flex size-2">
              <span className="lpo-ping absolute inline-flex size-full rounded-full bg-lpo-yellow" />
              <span className="relative inline-flex size-2 rounded-full bg-lpo-yellow" />
            </span>
            B2B Outsourcing &amp; Business Support
          </motion.span>

          <h1 className="relative z-0 mt-7 text-[2.6rem] leading-[1.04] font-extrabold tracking-[-0.035em] text-lpo-ink sm:text-6xl lg:text-[4.1rem]">
            {HEADLINE.map((line, i) => (
              <HeadlineLine key={line} text={line} delay={0.35 + i * 0.12} />
            ))}
            <HeadlineLine text={HIGHLIGHT} delay={0.6} highlight />
          </h1>

          <motion.p
            {...enter(d + 0.9)}
            className="mt-7 max-w-xl text-lg leading-snug font-bold text-lpo-navy sm:text-xl"
          >
            Reliable people, research, outreach, and support to help your business grow.
          </motion.p>

          <motion.p
            {...enter(d + 1)}
            className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground"
          >
            LPO helps businesses generate qualified B2B leads, conduct targeted outreach,
            manage day-to-day operations, and build reliable remote support teams.
          </motion.p>

          <motion.div {...enter(d + 1.1)} className="mt-8 flex flex-wrap gap-3">
            <CtaLink href="#contact">Let&apos;s Talk</CtaLink>
            <CtaLink href="#services" variant="outline" arrow={false}>
              Explore Our Services
            </CtaLink>
          </motion.div>

          <motion.p
            {...enter(d + 1.25)}
            className="mt-6 flex items-center gap-2 text-sm font-medium text-muted-foreground"
          >
            <ShieldCheck className="size-4 text-lpo-blue" />
            Built for businesses that need reliable execution.
          </motion.p>
        </div>

        <HeroDashboard />
      </Container>
    </section>
  )
}
