import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { STEPS } from './content'
import {
  Container,
  CtaLink,
  EASE_OUT,
  Reveal,
  SectionHeading,
  useCycleIndex,
} from './ui'
import { cn } from '@/lib/utils'

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-120px' })
  const active = useCycleIndex(STEPS.length, 1800, inView)

  return (
    <section id="how-it-works" className="relative py-24 sm:py-28">
      <Container>
        <SectionHeading
          label="How It Works"
          title="How It Works"
          description="A simple, structured way to get reliable support running inside your business."
        />

        <div ref={ref} className="relative mt-16">
          <div
            aria-hidden
            className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-px bg-border lg:block"
          />
          <motion.div
            aria-hidden
            className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-px origin-left bg-gradient-to-r from-lpo-blue via-lpo-blue to-lpo-yellow lg:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 1.8, ease: EASE_OUT, delay: 0.3 }}
          />

          <ol className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {STEPS.map((step, i) => {
              const isActive = active === i
              return (
                <motion.li
                  key={step.title}
                  className="relative flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.25 + i * 0.18 }}
                >
                  <motion.div
                    initial={{ scale: 0.4, rotate: -20 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.35 + i * 0.18 }}
                    className={cn(
                      'relative flex size-14 items-center justify-center rounded-2xl border bg-white text-base font-extrabold transition-all duration-500',
                      isActive
                        ? 'border-lpo-blue text-lpo-blue shadow-[0_14px_30px_-12px_rgb(20_99_255/0.55)]'
                        : 'border-border text-lpo-navy',
                    )}
                  >
                    {String(i + 1).padStart(2, '0')}
                    <span className="absolute -right-1 -bottom-1 flex size-3.5">
                      {isActive && (
                        <span className="lpo-ping absolute inline-flex size-full rounded-full bg-lpo-yellow" />
                      )}
                      <span className="relative inline-flex size-3.5 rounded-full bg-lpo-yellow ring-[3px] ring-white" />
                    </span>
                  </motion.div>
                  <h3
                    className={cn(
                      'mt-6 text-lg font-extrabold transition-colors duration-500',
                      isActive ? 'text-lpo-blue' : 'text-lpo-ink',
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[250px] text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </motion.li>
              )
            })}
          </ol>
        </div>

        <Reveal className="mt-14 flex justify-center" delay={0.2}>
          <CtaLink href="#contact" variant="outline">
            See the Full Process
          </CtaLink>
        </Reveal>
      </Container>
    </section>
  )
}
