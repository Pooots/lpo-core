import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { Check } from 'lucide-react'
import {
  LEAD_GEN_POINTS,
  PIPELINE_STEPS,
  PROSPECTS
  
} from './content'
import {
  Container,
  CountUp,
  CtaLink,
  EASE_OUT,
  Reveal,
  SectionLabel,
  SectionTitle,
  Stagger,
  StaggerItem,
  useCycleIndex,
} from './ui'
import type {ProspectRow} from './content';
import { cn } from '@/lib/utils'

const TABLE_COLUMNS = [
  'Company',
  'Industry',
  'Website',
  'Location',
  'Employee Size',
  'Decision Maker',
  'Job Title',
  'Email Status',
  'ICP',
]

function EmailStatus({ status }: { status: ProspectRow['emailStatus'] }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={status}
        initial={{ opacity: 0, scale: 0.6, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.6, y: -6 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        className={cn(
          'inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold',
          status === 'Verified'
            ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
            : 'border-border bg-lpo-surface text-muted-foreground',
        )}
      >
        {status}
      </motion.span>
    </AnimatePresence>
  )
}

function ProspectTable() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [rows, setRows] = useState(PROSPECTS)

  useEffect(() => {
    if (!inView) return
    const id = window.setTimeout(() => {
      setRows((prev) =>
        prev.map((row) =>
          row.emailStatus === 'Pending' ? { ...row, emailStatus: 'Verified' } : row,
        ),
      )
    }, 3200)
    return () => window.clearTimeout(id)
  }, [inView])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.9, ease: EASE_OUT }}
      className="mt-14 overflow-hidden rounded-2xl border border-border bg-white shadow-[0_40px_90px_-50px_rgb(11_37_89/0.45)]"
    >
      <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-lpo-yellow" />
            <span className="size-2.5 rounded-full bg-lpo-blue" />
            <span className="size-2.5 rounded-full bg-border" />
          </span>
          <span className="text-sm font-extrabold text-lpo-ink">
            Prospect Database — Batch 07
          </span>
        </div>
        <span className="rounded-full border bg-lpo-surface px-3 py-1 text-[10px] font-extrabold tracking-[0.14em] text-muted-foreground uppercase">
          5 of <CountUp to={1120} duration={2} /> records
        </span>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[1040px] text-left text-sm">
          <thead>
            <tr className="bg-lpo-surface/70">
              {TABLE_COLUMNS.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-[10px] font-extrabold tracking-[0.14em] whitespace-nowrap text-muted-foreground uppercase"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <motion.tbody
            className="relative"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } } }}
          >
            {rows.map((row) => (
              <motion.tr
                key={row.company}
                variants={{
                  hidden: { opacity: 0, x: -30 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_OUT } },
                }}
                className="border-t border-border/70 transition-colors hover:bg-lpo-blue-soft/50"
              >
                <td className="px-4 py-3.5 font-extrabold whitespace-nowrap text-lpo-ink">
                  {row.company}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground">
                  {row.industry}
                </td>
                <td className="px-4 py-3.5 font-medium whitespace-nowrap text-lpo-blue">
                  {row.website}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground">
                  {row.location}
                </td>
                <td className="px-4 py-3.5 text-muted-foreground">{row.size}</td>
                <td className="px-4 py-3.5 whitespace-nowrap text-lpo-ink">
                  {row.decisionMaker}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground">
                  {row.title}
                </td>
                <td className="px-4 py-3.5">
                  <EmailStatus status={row.emailStatus} />
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap',
                      row.icp === 'ICP Fit'
                        ? 'bg-lpo-blue-soft text-lpo-blue'
                        : 'bg-lpo-surface text-muted-foreground',
                    )}
                  >
                    {row.icp}
                  </span>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-10 bottom-0 overflow-hidden">
          <div className="lpo-scan h-12 w-full bg-gradient-to-b from-transparent via-lpo-blue/[0.07] to-transparent" />
        </div>
      </div>
    </motion.div>
  )
}

export function LeadGeneration() {
  return (
    <section id="lead-generation" className="relative overflow-hidden bg-lpo-surface py-24 sm:py-28">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal x={-30} y={0}>
            <SectionLabel>Lead Generation</SectionLabel>
            <SectionTitle className="mt-4">
              Need the Leads?
              <br /> We Can Find Them.
            </SectionTitle>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Build a targeted prospect database based on the exact companies and
              decision-makers your business wants to reach.
            </p>
          </Reveal>

          <div className="lg:pt-10">
            <Stagger className="grid gap-x-6 gap-y-4 sm:grid-cols-2" stagger={0.1}>
              {LEAD_GEN_POINTS.map((point) => (
                <StaggerItem key={point}>
                  <div className="flex items-start gap-3">
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 0.3 }}
                      className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-lpo-yellow"
                    >
                      <Check className="size-3 text-lpo-ink" strokeWidth={3.5} />
                    </motion.span>
                    <span className="text-sm font-semibold text-lpo-navy">{point}</span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.4} className="mt-8">
              <CtaLink href="#contact" variant="blue">
                Build My Prospect List
              </CtaLink>
            </Reveal>
          </div>
        </div>

        <ProspectTable />
      </Container>
    </section>
  )
}

function PipelineConnector({ lit }: { lit: boolean }) {
  return (
    <div className="ml-[34px] h-6 w-4" aria-hidden>
      <svg viewBox="0 0 16 24" className="h-full w-full">
        <line
          x1="8"
          y1="0"
          x2="8"
          y2="24"
          strokeWidth="2"
          strokeLinecap="round"
          className={cn('lpo-dash transition-colors duration-500', lit ? 'stroke-lpo-blue' : 'stroke-border')}
        />
      </svg>
    </div>
  )
}

function SalesPipeline() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-120px' })
  const active = useCycleIndex(PIPELINE_STEPS.length + 1, 1100, inView)
  const lastIndex = PIPELINE_STEPS.length - 1

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.9, ease: EASE_OUT }}
      className="rounded-[28px] border border-border bg-lpo-surface p-5 sm:p-7"
    >
      <p className="text-[11px] font-extrabold tracking-[0.2em] text-muted-foreground uppercase">
        Sales Pipeline
      </p>
      <div className="mt-5">
        {PIPELINE_STEPS.map(({ icon: Icon, label }, i) => {
          const isGoal = i === lastIndex
          const reached = i <= active
          const current = i === active
          return (
            <div key={label}>
              <motion.div
                animate={current ? { scale: 1.02, x: 4 } : { scale: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className={cn(
                  'flex items-center gap-3.5 rounded-2xl border bg-white px-4 py-3.5 transition-all duration-500',
                  isGoal
                    ? 'border-lpo-yellow shadow-[0_14px_34px_-18px_rgb(255_199_0/0.9)]'
                    : current
                      ? 'border-lpo-blue shadow-[0_14px_34px_-18px_rgb(20_99_255/0.6)]'
                      : 'border-border',
                  isGoal && current && 'bg-lpo-yellow-soft',
                )}
              >
                <span
                  className={cn(
                    'flex size-9 items-center justify-center rounded-xl transition-colors duration-500',
                    isGoal
                      ? 'bg-lpo-yellow text-lpo-ink'
                      : current
                        ? 'bg-lpo-blue text-white'
                        : 'bg-lpo-navy text-white',
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-extrabold text-lpo-ink">{label}</span>
                  <span className="block text-[10px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                    Step {i + 1}
                  </span>
                </span>
                {isGoal ? (
                  <span className="rounded-full bg-lpo-blue-soft px-2.5 py-0.5 text-[11px] font-bold text-lpo-blue">
                    Goal
                  </span>
                ) : (
                  reached && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white"
                    >
                      <Check className="size-3" strokeWidth={3.5} />
                    </motion.span>
                  )
                )}
              </motion.div>
              {i < lastIndex && <PipelineConnector lit={i < active} />}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export function ColdOutreach() {
  return (
    <section id="cold-outreach" className="relative py-24 sm:py-28">
      <Container className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal x={-30} y={0}>
          <SectionLabel>Cold Outreach</SectionLabel>
          <SectionTitle className="mt-4">
            Ready to Reach Them? We Can Help With That Too.
          </SectionTitle>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            LPO can support the next step after lead generation—from campaign preparation
            and segmentation to cold email, cold calling, appointment setting, and
            follow-up workflows.
          </p>
          <p className="mt-6 text-xs font-extrabold tracking-[0.2em] text-muted-foreground uppercase">
            Prospect to meeting, managed end to end
          </p>
          <div className="mt-8">
            <CtaLink href="#contact">Discuss an Outreach Campaign</CtaLink>
          </div>
        </Reveal>

        <SalesPipeline />
      </Container>
    </section>
  )
}
