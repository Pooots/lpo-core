import { motion } from 'framer-motion'
import { Hammer } from 'lucide-react'
import { findAdminModule } from '@/components/admin/modules'
import { EASE_OUT } from '@/components/home/ui'

export default function AdminModulePage({ moduleId }: { moduleId: string }) {
  const current = findAdminModule(moduleId)
  const Icon = current.icon

  return (
    <div key={current.id} className="mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        <h1 className="text-[1.9rem] font-extrabold tracking-[-0.03em] text-lpo-ink">
          {current.label}
        </h1>
        <p className="mt-1.5 text-[15px] text-muted-foreground">{current.description}</p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 24, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
        className="relative mt-8 overflow-hidden rounded-3xl bg-white px-6 py-16 text-center shadow-[0_30px_70px_-40px_rgb(11_37_89/0.45)] ring-1 ring-lpo-navy/[0.06] sm:py-20"
      >
        <div aria-hidden className="lpo-grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div
          aria-hidden
          className="lpo-drift pointer-events-none absolute -top-32 left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-lpo-yellow/20 blur-[110px]"
        />

        <div className="relative mx-auto flex size-32 items-center justify-center">
          <span
            aria-hidden
            className="absolute inset-0 animate-[spin_14s_linear_infinite] rounded-full border-2 border-dashed border-lpo-blue/25"
          />
          <span
            aria-hidden
            className="absolute inset-4 animate-[spin_9s_linear_infinite_reverse] rounded-full border border-lpo-yellow/60"
          />
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.25 }}
            className="lpo-float relative flex size-16 items-center justify-center rounded-2xl bg-lpo-navy text-white shadow-[0_18px_40px_-14px_rgb(11_37_89/0.8)]"
          >
            <Icon className="size-7" />
            <span className="absolute -right-2 -bottom-2 flex size-7 items-center justify-center rounded-lg bg-lpo-yellow text-lpo-ink ring-4 ring-white">
              <Hammer className="size-3.5" strokeWidth={2.5} />
            </span>
          </motion.span>
        </div>

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="relative mt-8 inline-flex items-center gap-2 rounded-full border border-lpo-yellow/50 bg-lpo-yellow-soft px-4 py-1.5 text-xs font-extrabold tracking-[0.2em] text-[#8a6a00] uppercase"
        >
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-lpo-yellow" />
            <span className="relative size-2 rounded-full bg-[#e0a800]" />
          </span>
          On going
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.42 }}
          className="relative mt-5 text-2xl font-extrabold tracking-[-0.02em] text-lpo-ink sm:text-[1.75rem]"
        >
          {current.label} is on going
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.5 }}
          className="relative mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground"
        >
          We are currently building this module. It will be available here as soon as it is
          ready.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative mx-auto mt-8 h-1.5 w-56 overflow-hidden rounded-full bg-lpo-navy/[0.07]"
        >
          <motion.span
            className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-lpo-blue to-lpo-yellow"
            animate={{ x: ['-110%', '330%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.section>
    </div>
  )
}
