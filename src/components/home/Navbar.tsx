import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS  } from './content'
import { CtaLink, EASE_OUT, scrollToHash } from './ui'
import type {NavId} from './content';
import { cn } from '@/lib/utils'

const NAV_IDS = NAV_LINKS.map((l) => l.id)

function useActiveSection(): NavId {
  const [active, setActive] = useState<NavId>('home')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as NavId)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const id of NAV_IDS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      if (atBottom) setActive('contact')
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return active
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn('group/brand flex items-center gap-3', className)}>
      <img
        src="/brand/lpo-mark.png"
        alt="LPO logo"
        width={44}
        height={44}
        className="size-11 rounded-xl shadow-[0_6px_16px_-6px_rgb(255_199_0/0.9)] transition-transform duration-500 group-hover/brand:rotate-[-8deg] group-hover/brand:scale-105"
      />
      <span className="leading-none">
        <span className="block text-lg font-extrabold tracking-tight text-lpo-navy">
          LPO
        </span>
        <span className="mt-1 block text-[9.5px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          Laguna Personnel Outsourcing
        </span>
      </span>
    </span>
  )
}

export function Navbar() {
  const active = useActiveSection()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id: string) => {
    setOpen(false)
    scrollToHash(id)
  }

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-border/70 bg-white/80 shadow-[0_8px_30px_-20px_rgb(11_37_89/0.35)] backdrop-blur-xl'
          : 'bg-transparent',
      )}
    >
      <nav
        className={cn(
          'mx-auto flex w-full max-w-7xl items-center justify-between px-5 transition-all duration-500 sm:px-8',
          scrolled ? 'h-[68px]' : 'h-20',
        )}
      >
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            go('home')
          }}
        >
          <BrandMark />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    go(link.id)
                  }}
                  className={cn(
                    'relative block px-3.5 py-2 text-sm font-semibold transition-colors',
                    isActive
                      ? 'text-lpo-ink'
                      : 'text-lpo-navy/70 hover:text-lpo-ink',
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3.5 -bottom-0.5 h-[3px] rounded-full bg-lpo-yellow"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-3">
          <CtaLink to="/get-started" size="sm" arrow={false} className="hidden sm:inline-flex">
            Get Started
          </CtaLink>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-11 items-center justify-center rounded-xl border bg-white text-lpo-navy lg:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'close' : 'menu'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="overflow-hidden border-t bg-white lg:hidden"
          >
            <motion.ul
              className="space-y-1 px-5 py-4"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05 } } }}
            >
              {NAV_LINKS.map((link) => (
                <motion.li
                  key={link.id}
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    show: { opacity: 1, x: 0 },
                  }}
                >
                  <button
                    type="button"
                    onClick={() => go(link.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl px-4 py-3 text-left font-semibold',
                      active === link.id
                        ? 'bg-lpo-yellow-soft text-lpo-ink'
                        : 'text-lpo-navy/80 hover:bg-lpo-surface',
                    )}
                  >
                    {link.label}
                    {active === link.id && (
                      <span className="size-2 rounded-full bg-lpo-yellow" />
                    )}
                  </button>
                </motion.li>
              ))}
              <motion.li
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                className="pt-2"
              >
                <CtaLink
                  to="/get-started"
                  className="w-full"
                  arrow={false}
                  onClick={() => setOpen(false)}
                >
                  Get Started
                </CtaLink>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
