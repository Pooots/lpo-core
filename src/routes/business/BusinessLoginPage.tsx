import { Link } from '@tanstack/react-router'
import { ArrowRight, Building2 } from 'lucide-react'
import { BusinessShell, FormHeader } from '@/components/auth/AuthShells'
import { toneClasses } from '@/components/auth/fields'
import { LoginForm } from '@/components/auth/LoginForm'

export default function BusinessLoginPage() {
  const t = toneClasses('business')

  return (
    <BusinessShell
      switchPrompt={
        <>
          <span className="hidden sm:inline">New client? </span>
          <Link to="/business/register" className={`font-extrabold ${t.link}`}>
            Request services
          </Link>
        </>
      }
    >
      <FormHeader
        tone="business"
        eyebrow="LPO for Business"
        title="Sign in to your business account"
        description="Review your service request, proposal status, and team details."
      />
      <LoginForm
        tone="business"
        accountType="client"
        footer={
          <Link
            to="/business/register"
            className="group flex items-center gap-4 rounded-xl border bg-lpo-surface/80 p-4 transition-colors hover:border-lpo-blue/30 hover:bg-lpo-blue-soft"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-lpo-blue text-white">
              <Building2 className="size-[18px]" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-extrabold text-lpo-ink">
                Working with LPO for the first time?
              </span>
              <span className="block text-xs text-muted-foreground">
                Tell us what you need and get a proposal within 48 hours.
              </span>
            </span>
            <ArrowRight className="size-4 text-lpo-blue transition-transform group-hover:translate-x-1" />
          </Link>
        }
      />
    </BusinessShell>
  )
}
