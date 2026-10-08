import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Quote } from 'lucide-react'
import { ABOUT_STATS, CONTACT, FAQS, INDUSTRIES, TESTIMONIALS } from './content'
import {
  Container,
  CountUp,
  CtaLink,
  EASE_OUT,
  Reveal,
  SectionHeading,
  SectionLabel,
  SectionTitle,
  Spotlight,
  Stagger,
  StaggerItem,
  popItem,
  trackPointer,
} from './ui'
import { cn } from '@/lib/utils'

export function Industries() {
  return (
    <section id="industries" className="relative py-24 sm:py-28">
      <Container>
        <SectionHeading
          label="Industries"
          title="Built for Different Business Needs"
          description="We adapt our research, outreach, and support workflows to how your industry actually buys."
        />

        <Stagger
          className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.05}
        >
          {INDUSTRIES.map(({ icon: Icon, label }) => (
            <StaggerItem key={label} variants={popItem}>
              <div
                onMouseMove={trackPointer}
                className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-border bg-white px-4 py-4 transition-all duration-400 hover:-translate-y-1 hover:border-lpo-yellow/70 hover:shadow-[0_18px_40px_-26px_rgb(255_199_0/1)]"
              >
                <Spotlight color="rgb(255 199 0 / 0.14)" />
                <span className="relative flex size-10 items-center justify-center rounded-xl bg-lpo-surface text-lpo-blue transition-all duration-500 group-hover:scale-110 group-hover:rotate-[-8deg] group-hover:bg-lpo-navy group-hover:text-white">
                  <Icon className="size-[18px]" />
                </span>
                <span className="relative text-sm font-extrabold text-lpo-ink">{label}</span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-12 flex justify-center" delay={0.2}>
          <CtaLink href="#contact" variant="outline" size="sm">
            Explore Industries
          </CtaLink>
        </Reveal>
      </Container>
    </section>
  )
}

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-lpo-surface py-24 sm:py-28">
      <Container className="grid items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, clipPath: 'inset(0% 100% 0% 0% round 28px)' }}
          whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="group relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-[0_40px_80px_-40px_rgb(11_37_89/0.55)]"
        >
          <img
            src="/images/about-team.jpg"
            alt="LPO team members reviewing a client project"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          />
        </motion.div>

        <div>
          <Reveal>
            <SectionLabel>About LPO</SectionLabel>
            <SectionTitle className="mt-4">Your Team. Extended.</SectionTitle>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              LPO helps businesses extend their capabilities without the complexity of
              building every function internally.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Whether you need qualified prospects, research support, outreach execution,
              virtual assistance, or remote IT support, we provide flexible solutions
              designed around your business.
            </p>
          </Reveal>

          <Stagger className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-8" stagger={0.12}>
            {ABOUT_STATS.map((stat) => (
              <StaggerItem key={stat.label}>
                <CountUp
                  to={stat.value}
                  suffix={stat.suffix}
                  duration={2.2}
                  className="block text-3xl font-extrabold tracking-tight text-lpo-navy sm:text-4xl"
                />
                <span className="mt-1 block text-[10px] font-bold tracking-[0.14em] text-muted-foreground uppercase sm:text-[11px]">
                  {stat.label}
                </span>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.3} className="mt-9">
            <CtaLink href="#contact" variant="navy">
              Work With LPO
            </CtaLink>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

export function Testimonials() {
  return (
    <section className="relative py-24 sm:py-28">
      <Container>
        <SectionHeading
          label="Client Feedback"
          title="What Working With LPO Looks Like"
          description="Sample content — replace or edit these from the admin dashboard once real client feedback is ready."
        />

        <Stagger className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-3" stagger={0.12}>
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.role} className="h-full">
              <figure className="group flex h-full flex-col rounded-2xl border border-border bg-white p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-lpo-yellow/60 hover:shadow-[0_28px_60px_-30px_rgb(11_37_89/0.4)]">
                <Quote className="size-7 fill-lpo-yellow text-lpo-yellow transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12" />
                <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-5">
                  <p className="text-sm font-extrabold text-lpo-ink">{t.role}</p>
                  <p className="text-xs text-muted-foreground">{t.company}</p>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="relative bg-lpo-surface py-24 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal x={-30} y={0} className="lg:sticky lg:top-28 lg:self-start">
          <SectionLabel>FAQ</SectionLabel>
          <SectionTitle className="mt-4">
            Frequently
            <br /> Asked Questions
          </SectionTitle>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground sm:text-lg">
            Straight answers about how we work, what we deliver, and how to get started.
          </p>
          <div className="mt-8">
            <CtaLink href="#contact" size="sm">
              Ask us anything
            </CtaLink>
          </div>
        </Reveal>

        <Stagger className="space-y-3" stagger={0.06}>
          {FAQS.map((faq, i) => {
            const isOpen = open === i
            return (
              <StaggerItem key={faq.question}>
                <div
                  className={cn(
                    'overflow-hidden rounded-2xl border bg-white transition-all duration-400',
                    isOpen
                      ? 'border-lpo-blue/40 shadow-[0_18px_40px_-26px_rgb(20_99_255/0.6)]'
                      : 'border-border hover:border-lpo-navy/25',
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-extrabold text-lpo-ink"
                  >
                    {faq.question}
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.35, ease: EASE_OUT }}
                      className={cn(
                        'flex size-7 shrink-0 items-center justify-center rounded-full transition-colors',
                        isOpen ? 'bg-lpo-blue-soft text-lpo-blue' : 'text-muted-foreground',
                      )}
                    >
                      <ChevronDown className="size-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE_OUT }}
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </StaggerItem>
            )
          })}
        </Stagger>
      </Container>
    </section>
  )
}

const CTA_LINES = [
  'Need the leads? We can find them.',
  'Ready to reach them? We can help with that too.',
  'Need additional support? We can build the team for you.',
]

export function FinalCta() {
  return (
    <section id="contact" className="relative py-24 sm:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[30px] border border-border bg-white px-6 py-16 text-center shadow-[0_50px_100px_-50px_rgb(11_37_89/0.5)] sm:px-12 sm:py-20"
        >
          <motion.span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1.5 origin-left bg-lpo-yellow"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.3 }}
          />
          <div
            aria-hidden
            className="lpo-drift pointer-events-none absolute -top-24 -right-20 size-80 rounded-full bg-lpo-yellow/25 blur-[90px]"
          />
          <div
            aria-hidden
            className="lpo-drift pointer-events-none absolute -bottom-28 -left-20 size-80 rounded-full bg-lpo-blue/15 blur-[90px]"
            style={{ animationDelay: '-8s' }}
          />

          <div className="relative">
            <SectionTitle className="mx-auto max-w-3xl">
              Let&apos;s Build the Right Support Team for Your Business.
            </SectionTitle>
            <div className="mt-6 space-y-1.5">
              {CTA_LINES.map((line, i) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.4 + i * 0.18 }}
                  className="text-[15px] font-semibold text-lpo-navy sm:text-base"
                >
                  {line}
                </motion.p>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: 1 }}
              className="mt-9 flex flex-wrap justify-center gap-3"
            >
              <CtaLink href={`mailto:${CONTACT.email}?subject=Let%27s%20talk%20about%20support%20for%20my%20business`}>
                Let&apos;s Talk
              </CtaLink>
              <CtaLink href="#services" variant="outline" arrow={false}>
                Explore Services
              </CtaLink>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
