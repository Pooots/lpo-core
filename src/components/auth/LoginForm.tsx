import {   useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Lock, Mail } from 'lucide-react'
import { FormAlert, PasswordField, SubmitButton, TextField,  toneClasses } from './fields'
import type {Tone} from './fields';
import type {FormEvent, ReactNode} from 'react';
import type { AccountType } from '@/types/auth'
import type {FieldErrors} from '@/lib/formValidation';
import { CONTACT } from '@/components/home/content'
import { parseApiError } from '@/lib/apiErrors'
import {  isEmail } from '@/lib/formValidation'
import { ACCOUNT_HOME, ACCOUNT_LOGIN, authService } from '@/services/authService'
import { EASE_OUT } from '@/components/home/ui'

const PORTAL_NAME: Record<AccountType, string> = {
  talent: 'LPO Careers',
  client: 'LPO for Business',
}

export function LoginForm({
  tone,
  accountType,
  footer,
}: {
  tone: Tone
  accountType: AccountType
  footer: ReactNode
}) {
  const navigate = useNavigate()
  const t = toneClasses(tone)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [otherPortal, setOtherPortal] = useState<AccountType | null>(null)
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
    setOtherPortal(null)
    try {
      await authService.login({ email: email.trim(), password, type: accountType })
      navigate({ to: ACCOUNT_HOME[accountType] })
    } catch (error) {
      const info = parseApiError(error, 'We could not sign you in. Please try again.')
      setErrors(info.fieldErrors)
      setServerError(info.message)
      if (info.status === 409 && (info.data.type === 'talent' || info.data.type === 'client')) {
        setOtherPortal(info.data.type)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="mt-9 space-y-5">
      <FormAlert
        message={serverError}
        variant={otherPortal ? 'info' : 'error'}
        action={
          otherPortal ? (
            <Link to={ACCOUNT_LOGIN[otherPortal]} className="font-bold underline">
              Continue to {PORTAL_NAME[otherPortal]} sign in
            </Link>
          ) : undefined
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
        className="space-y-5"
      >
        <TextField
          tone={tone}
          label={tone === 'business' ? 'Work email' : 'Email address'}
          type="email"
          icon={Mail}
          value={email}
          onChange={(v) => {
            setEmail(v)
            setErrors((e) => ({ ...e, email: '' }))
          }}
          error={errors.email || undefined}
          placeholder={tone === 'business' ? 'you@company.com' : 'you@email.com'}
          autoComplete="email"
          autoFocus
        />
        <PasswordField
          tone={tone}
          label="Password"
          icon={Lock}
          value={password}
          onChange={(v) => {
            setPassword(v)
            setErrors((e) => ({ ...e, password: '' }))
          }}
          error={errors.password || undefined}
          placeholder="Your password"
          autoComplete="current-password"
          hint={
            <a
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`${PORTAL_NAME[accountType]} sign-in help`)}`}
              className={`font-bold ${t.link}`}
            >
              Need help signing in?
            </a>
          }
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.2 }}
        className="space-y-6 pt-2"
      >
        <SubmitButton tone={tone} loading={loading} className="w-full">
          Sign in to {PORTAL_NAME[accountType]}
          {!loading && (
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          )}
        </SubmitButton>
        {footer}
      </motion.div>
    </form>
  )
}
