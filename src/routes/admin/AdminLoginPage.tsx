import { useId, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import type { FormEvent } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { FieldErrors } from '@/lib/formValidation'
import { EASE_OUT } from '@/components/home/ui'
import { parseApiError } from '@/lib/apiErrors'
import { isEmail } from '@/lib/formValidation'
import { cn } from '@/lib/utils'
import { ACCOUNT_HOME, authService } from '@/services/authService'

function DarkField({
  label,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  autoFocus,
}: {
  label: string
  icon: LucideIcon
  type?: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  autoComplete?: string
  autoFocus?: boolean
}) {
  const id = useId()
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] font-bold text-white/80">
        {label}
      </label>
      <div
        className={cn(
          'group flex h-12 items-center gap-3 rounded-xl border bg-white/[0.04] px-4 transition-all duration-300 focus-within:border-lpo-yellow/70 focus-within:bg-white/[0.07] focus-within:ring-4 focus-within:ring-lpo-yellow/15',
          error ? 'border-rose-400/70' : 'border-white/10',
        )}
      >
        <Icon className="size-[18px] shrink-0 text-white/40 transition-colors group-focus-within:text-lpo-yellow" />
        <input
          id={id}
          type={isPassword && visible ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-invalid={Boolean(error)}
          className="h-full w-full min-w-0 bg-transparent text-[15px] text-white outline-none placeholder:text-white/30"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="text-white/40 transition-colors hover:text-white"
          >
            {visible ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
          </button>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 pt-1.5 text-xs font-semibold text-rose-300">
          <AlertCircle className="size-3.5" />
          {error}
        </p>
      )}
    </div>
  )
}

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors: FieldErrors = {}
    if (!isEmail(email)) nextErrors.email = 'Enter a valid email address.'
    if (!password) nextErrors.password = 'Enter your password.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    setServerError(null)
    try {
      await authService.login({ email: email.trim(), password, type: 'admin' })
      navigate({ to: ACCOUNT_HOME.admin })
    } catch (error) {
      const info = parseApiError(error, 'We could not sign you in. Please try again.')
      setErrors(info.fieldErrors)
      setServerError(info.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[#060a14] text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgb(255 255 255 / 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.12) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)',
          }}
        />
        <div
          aria-hidden
          className="lpo-drift pointer-events-none absolute -top-56 left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-lpo-blue/30 blur-[140px]"
        />
        <div
          aria-hidden
          className="lpo-drift pointer-events-none absolute -right-40 -bottom-56 size-[520px] rounded-full bg-lpo-yellow/15 blur-[140px]"
          style={{ animationDelay: '-8s' }}
        />

        <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
          <Link to="/" className="group inline-flex items-center gap-3">
            <img
              src="/brand/lpo-mark.png"
              alt="LPO"
              className="size-10 rounded-xl transition-transform duration-500 group-hover:rotate-[-8deg]"
            />
            <span className="leading-none">
              <span className="block text-base font-extrabold">LPO</span>
              <span className="mt-1 block text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase">
                Admin Console
              </span>
            </span>
          </Link>
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-bold text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Back to website
          </Link>
        </header>

        <main className="relative flex flex-1 items-center justify-center px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
            className="relative w-full max-w-md"
          >
            <div
              aria-hidden
              className="absolute -inset-px rounded-[28px] bg-gradient-to-b from-white/20 via-white/5 to-lpo-yellow/30"
            />
            <div className="relative rounded-[27px] bg-[#0b1120]/90 p-8 shadow-[0_40px_120px_-40px_rgb(20_99_255/0.6)] backdrop-blur-xl sm:p-10">
              <div className="flex items-center justify-between">
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.2 }}
                  className="relative flex size-14 items-center justify-center rounded-2xl bg-lpo-yellow text-lpo-ink shadow-[0_16px_40px_-14px_rgb(255_199_0/0.9)]"
                >
                  <ShieldCheck className="size-7" strokeWidth={2.2} />
                  <span className="lpo-ping absolute -top-1 -right-1 size-3 rounded-full bg-emerald-400 ring-4 ring-[#0b1120]" />
                </motion.span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-extrabold tracking-[0.2em] text-white/60 uppercase">
                  Restricted access
                </span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.15 }}
                className="mt-7 text-[1.9rem] leading-tight font-extrabold tracking-[-0.03em]"
              >
                Admin sign in
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.22 }}
                className="mt-2 text-sm leading-relaxed text-white/55"
              >
                Manage talents, clients, projects, and operations from one place.
              </motion.p>

              <form onSubmit={submit} noValidate className="mt-8 space-y-5">
                <AnimatePresence initial={false}>
                  {serverError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div
                        role="alert"
                        className="flex items-start gap-3 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200"
                      >
                        <AlertCircle className="mt-0.5 size-4 shrink-0" />
                        {serverError}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <DarkField
                  label="Email address"
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={(v) => {
                    setEmail(v)
                    setErrors((e) => ({ ...e, email: undefined }))
                  }}
                  error={errors.email}
                  placeholder="you@lpoph.com"
                  autoComplete="username"
                  autoFocus
                />
                <DarkField
                  label="Password"
                  icon={Lock}
                  type="password"
                  value={password}
                  onChange={(v) => {
                    setPassword(v)
                    setErrors((e) => ({ ...e, password: undefined }))
                  }}
                  error={errors.password}
                  placeholder="Your password"
                  autoComplete="current-password"
                />

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="lpo-shine group mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-lpo-yellow text-[15px] font-extrabold text-lpo-ink shadow-[0_18px_40px_-16px_rgb(255_199_0/0.9)] transition-colors hover:bg-[#ffcf24] disabled:cursor-wait disabled:opacity-80"
                >
                  {loading && <LoaderCircle className="size-4 animate-spin" />}
                  {loading ? 'Signing in…' : 'Sign in to console'}
                  {!loading && (
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  )}
                </motion.button>
              </form>

              <p className="mt-8 border-t border-white/10 pt-5 text-center text-xs text-white/40">
                Authorized LPO personnel only.
              </p>
            </div>
          </motion.div>
        </main>
      </div>
    </MotionConfig>
  )
}
