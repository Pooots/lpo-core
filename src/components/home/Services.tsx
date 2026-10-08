import { motion } from 'framer-motion'
import { SERVICES, TRUST_ITEMS, WHY_LPO } from './content'
import {
  Container,
  Reveal,
  SectionHeading,
  Spotlight,
  Stagger,
  StaggerItem,
  TextLink,
  popItem,
  trackPointer,
} from './ui'

export function TrustStrip() {
  return (
    <section className="border-y border-border/70 bg-white py-10">
      <Container>
        <Reveal y={12}>
          <p className="text-center text-sm font-medium text-muted-foreground">
            Helping businesses build better sales and support operations.
          </p>
        </Reveal>
        <Stagger
          className="mt-7 grid grid-cols-2 gap-y-6 lg:grid-cols-4 lg:divide-x lg:divide-border/80"
          stagger={0.1}
        >
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <StaggerItem key={label}>
              <div className="group flex items-center justify-center gap-3">
                <motion.span
                  whileHover={{ rotate: -10, scale: 1.12 }}
                  className="flex size-10 items-center justify-center rounded-xl bg-lpo-blue-soft text-lpo-blue transition-colors duration-300 group-hover:bg-lpo-blue group-hover:text-white"
                >
                  <Icon className="size-[18px]" />
                </motion.span>
                <span className="text-sm font-bold text-lpo-ink">{label}</span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}

export function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-28">
      <Container>
        <SectionHeading
          label="Our Services"
          title={
            <>
              Everything You Need to Build
              <br className="hidden sm:block" /> and Support Your Growth
            </>
          }
          description="From finding the right prospects to supporting your day-to-day operations, LPO provides flexible outsourced services built around your business."
        />

        <Stagger
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.07}
        >
          {SERVICES.map(({ icon: Icon, title, description, cta, href }) => (
            <StaggerItem key={title} className="h-full">
              <article
                onMouseMove={trackPointer}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-lpo-blue/60 hover:shadow-[0_28px_60px_-28px_rgb(20_99_255/0.45)]"
              >
                <Spotlight />
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-lpo-yellow transition-transform duration-500 group-hover:scale-x-100"
                />
                <span className="relative flex size-11 items-center justify-center rounded-xl border border-border/70 bg-lpo-surface text-lpo-navy transition-all duration-500 group-hover:rotate-[-6deg] group-hover:border-lpo-blue group-hover:bg-lpo-blue group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <h3 className="relative mt-5 text-[17px] leading-snug font-extrabold text-lpo-ink">
                  {title}
                </h3>
                <p className="relative mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
                <div className="relative mt-auto pt-6">
                  <TextLink href={href}>{cta}</TextLink>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}

export function WhyLpo() {
  return (
    <section className="relative overflow-hidden bg-lpo-surface py-24 sm:py-28">
      <div
        aria-hidden
        className="lpo-drift pointer-events-none absolute -right-40 top-10 size-[420px] rounded-full bg-lpo-yellow/10 blur-[100px]"
      />
      <Container className="relative">
        <SectionHeading
          label="Why LPO"
          title={
            <>
              Not Just Another
              <br className="hidden sm:block" /> Outsourcing Provider
            </>
          }
          description="We focus on quality, accuracy, and execution—not simply volume."
        />

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {WHY_LPO.map(({ icon: Icon, title, description }, i) => (
            <StaggerItem key={title} variants={popItem} className="h-full">
              <article className="group relative h-full overflow-hidden rounded-2xl border border-border/80 bg-white p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-30px_rgb(11_37_89/0.4)]">
                <span
                  aria-hidden
                  className="absolute -top-4 right-3 text-[5.5rem] leading-none font-extrabold text-lpo-surface transition-all duration-500 select-none group-hover:-translate-y-1 group-hover:text-lpo-yellow/25"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="relative flex size-11 items-center justify-center rounded-xl bg-lpo-navy text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-lpo-blue">
                  <Icon className="size-5" />
                </span>
                <h3 className="relative mt-6 text-base font-extrabold text-lpo-ink">{title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  )
}
