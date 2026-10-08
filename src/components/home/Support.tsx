import { Fragment, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
} from 'framer-motion'
import { ArrowRight, CircleCheck, LoaderCircle } from 'lucide-react'
import { IT_CAPABILITIES, SUPPORT_WORKFLOW, VA_AREAS } from './content'
import {
  Container,
  CtaLink,
  EASE_OUT,
  Reveal,
  SectionLabel,
  SectionTitle,
  Stagger,
  StaggerItem,
  popItem,
  useCycleIndex,
} from './ui'
import { cn } from '@/lib/utils'

function ParallaxPhoto({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1])
  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, clipPath: 'inset(12% 12% 12% 12% round 28px)' }}
      whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1.1, ease: EASE_OUT }}
      className={cn(
        'relative overflow-hidden rounded-[28px] shadow-[0_40px_80px_-40px_rgb(11_37_89/0.55)]',
        className,
      )}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ scale, y }}
        className="h-full w-full object-cover"
      />
    </motion.div>
  )
}

export function VirtualAssistance() {
  return (
    <section id="virtual-assistance" className="relative overflow-hidden py-24 sm:py-28">
      <Container className="grid items-center gap-16 lg:grid-cols-2">
        <div className="relative">
          <div
            aria-hidden
            className="lpo-drift pointer-events-none absolute -top-16 -left-16 size-72 rounded-full bg-lpo-yellow/30 blur-[80px]"
          />
          <ParallaxPhoto
            src="/images/virtual-assistant.jpg"
            alt="LPO virtual assistant working at a laptop"
            className="aspect-[4/3]"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.6 }}
            className="absolute right-5 -bottom-6 sm:right-8"
          >
            <div className="lpo-float rounded-2xl border border-border/80 bg-white px-4 py-3 shadow-[0_22px_50px_-20px_rgb(11_37_89/0.5)]">
              <p className="text-sm font-extrabold text-lpo-ink">6 support areas</p>
              <p className="text-[11px] font-medium text-muted-foreground">One flexible team</p>
            </div>
          </motion.div>
        </div>

        <div>
          <Reveal>
            <SectionLabel>Virtual Assistance</SectionLabel>
            <SectionTitle className="mt-4">Need Additional Hands?</SectionTitle>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Extend your team with reliable virtual assistance for research,
              administrative work, CRM management, data management, executive assistance,
              and day-to-day business operations.
            </p>
          </Reveal>

          <Stagger className="mt-8 grid gap-4 sm:grid-cols-2" stagger={0.08} delay={0.1}>
            {VA_AREAS.map((area) => (
              <StaggerItem key={area.title}>
                <div className="group h-full rounded-2xl border border-border bg-white p-4 transition-all duration-400 hover:-translate-y-1 hover:border-lpo-yellow hover:shadow-[0_18px_40px_-24px_rgb(255_199_0/0.9)]">
                  <p className="flex items-center gap-2.5 text-sm font-extrabold text-lpo-ink">
                    <span className="size-2 rounded-full bg-lpo-yellow transition-transform duration-300 group-hover:scale-150" />
                    {area.title}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    {area.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.3} className="mt-8">
            <CtaLink href="#contact">Build My Support Team</CtaLink>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

const TICKETS = [4821, 4822, 4823]

function TicketBadge() {
  const [ticket, setTicket] = useState(0)
  const [resolved, setResolved] = useState(true)

  useEffect(() => {
    const id = window.setTimeout(
      () => {
        if (resolved) {
          setTicket((t) => (t + 1) % TICKETS.length)
          setResolved(false)
        } else {
          setResolved(true)
        }
      },
      resolved ? 3200 : 1800,
    )
    return () => window.clearTimeout(id)
  }, [resolved])

  return (
    <div className="lpo-float min-w-44 rounded-2xl border border-border/80 bg-white px-4 py-3 shadow-[0_22px_50px_-20px_rgb(11_37_89/0.5)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${ticket}-${resolved}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm font-extrabold text-lpo-ink">Ticket #{TICKETS[ticket]}</p>
          {resolved ? (
            <p className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <CircleCheck className="size-3" /> Resolved in 42 min
            </p>
          ) : (
            <p className="flex items-center gap-1 text-[11px] font-bold text-lpo-blue">
              <LoaderCircle className="size-3 animate-spin" /> Troubleshooting…
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function SupportWorkflow() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-100px' })
  const active = useCycleIndex(SUPPORT_WORKFLOW.length, 1000, inView)

  return (
    <Reveal className="mt-16">
      <div ref={ref} className="rounded-[24px] border border-border bg-white p-6 sm:p-7">
        <p className="text-[11px] font-extrabold tracking-[0.2em] text-muted-foreground uppercase">
          Support Workflow
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-3">
          {SUPPORT_WORKFLOW.map((stage, i) => {
            const current = i === active
            const done = i < active
            return (
              <Fragment key={stage}>
                <motion.span
                  animate={current ? { scale: 1.06, y: -2 } : { scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 20 }}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-colors duration-300',
                    current
                      ? 'border-lpo-blue bg-lpo-blue text-white shadow-[0_10px_24px_-10px_rgb(20_99_255/0.8)]'
                      : done
                        ? 'border-lpo-blue/40 bg-lpo-blue-soft text-lpo-navy'
                        : 'border-border bg-lpo-surface text-lpo-navy',
                  )}
                >
                  <span
                    className={cn(
                      'size-1.5 rounded-full',
                      current ? 'bg-white' : 'bg-lpo-blue',
                    )}
                  />
                  {stage}
                </motion.span>
                {i < SUPPORT_WORKFLOW.length - 1 && (
                  <ArrowRight
                    className={cn(
                      'size-3.5 transition-colors duration-300',
                      done || current ? 'text-lpo-blue' : 'text-border',
                    )}
                  />
                )}
              </Fragment>
            )
          })}
        </div>
      </div>
    </Reveal>
  )
}

export function ItServiceDesk() {
  return (
    <section id="it-service-desk" className="relative overflow-hidden bg-lpo-surface py-24 sm:py-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
          <Reveal x={-30} y={0}>
            <SectionLabel>IT Service Desk</SectionLabel>
            <SectionTitle className="mt-4">
              Remote IT Support When Your Team Needs It.
            </SectionTitle>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              LPO is expanding into remote IT Service Desk support for businesses that need
              structured technical and user support operations.
            </p>
            <div className="mt-8">
              <CtaLink href="#contact" variant="blue">
                Discuss IT Support
              </CtaLink>
            </div>
          </Reveal>

          <div className="relative">
            <ParallaxPhoto
              src="/images/it-service-desk.jpg"
              alt="LPO IT service desk agent wearing a headset"
              className="aspect-[16/10]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: -20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.6 }}
              className="absolute -top-6 left-2 sm:-left-6"
            >
              <TicketBadge />
            </motion.div>
          </div>
        </div>

        <SupportWorkflow />

        <Stagger className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {IT_CAPABILITIES.map((cap) => (
            <StaggerItem key={cap.title} variants={popItem}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-white p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_44px_-26px_rgb(11_37_89/0.45)]">
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-lpo-blue transition-transform duration-500 group-hover:scale-y-100"
                />
                <p className="text-sm font-extrabold text-lpo-ink">{cap.title}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {cap.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}
