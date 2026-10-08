import { useEffect, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
} from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { EASE_OUT, INTRO_DURATION, INTRO_SEEN_KEY } from './ui'

/** Brand splash shown once per browser session. */
export function Preloader({ show }: { show: boolean }) {
  const [visible, setVisible] = useState(show)

  useEffect(() => {
    if (!visible) return
    document.documentElement.style.overflow = 'hidden'
    const id = window.setTimeout(() => {
      sessionStorage.setItem(INTRO_SEEN_KEY, '1')
      setVisible(false)
    }, (INTRO_DURATION - 0.3) * 1000)
    return () => {
      window.clearTimeout(id)
      document.documentElement.style.overflow = ''
    }
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#ffcb00]"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.img
            src="/2.png"
            alt="Laguna Personnel Outsourcing"
            className="w-[min(88vw,30rem)]"
            initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          />
          <div className="mt-2 h-1 w-48 overflow-hidden rounded-full bg-[#0000c8]/15">
            <motion.div
              className="h-full rounded-full bg-[#0000c8]"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28 })

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-lpo-yellow via-[#ffd84d] to-lpo-blue"
      style={{ scaleX }}
    />
  )
}

export function BackToTop() {
  const { scrollYProgress } = useScroll()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.92 }}
          className="fixed right-5 bottom-5 z-40 flex size-12 items-center justify-center rounded-full bg-lpo-navy text-white shadow-[0_14px_30px_-12px_rgb(11_37_89/0.8)]"
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden>
            <circle cx="24" cy="24" r="21" fill="none" stroke="rgb(255 255 255 / 0.15)" strokeWidth="2.5" />
            <motion.circle
              cx="24"
              cy="24"
              r="21"
              fill="none"
              stroke="#ffc700"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          <ArrowUp className="relative size-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
