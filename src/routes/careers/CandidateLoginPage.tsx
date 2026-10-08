import { Link } from '@tanstack/react-router'
import { ArrowRight, Sparkles } from 'lucide-react'
import { CareersShell, FormHeader } from '@/components/auth/AuthShells'
import { toneClasses } from '@/components/auth/fields'
import { LoginForm } from '@/components/auth/LoginForm'

export default function CandidateLoginPage() {
  const t = toneClasses('careers')

  return (
    <CareersShell
      switchPrompt={
        <>
          <span className="hidden sm:inline">New to LPO? </span>
          <Link to="/careers/register" className={`font-extrabold ${t.link}`}>
            Create a profile
          </Link>
        </>
      }
    >
      <FormHeader
        tone="careers"
        eyebrow="LPO Careers"
        title="Welcome back"
        description="Sign in to update your profile and keep track of your application."
      />
      <LoginForm
        tone="careers"
        accountType="talent"
        footer={
          <Link
            to="/careers/register"
            className="group flex items-center gap-4 rounded-2xl border border-dashed border-lpo-yellow/60 bg-white/70 p-4 transition-colors hover:bg-lpo-yellow-soft"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lpo-yellow text-lpo-navy">
              <Sparkles className="size-[18px]" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-extrabold text-lpo-ink">
                Don&apos;t have a profile yet?
              </span>
              <span className="block text-xs text-muted-foreground">
                It takes about 3 minutes to apply as a candidate.
              </span>
            </span>
            <ArrowRight className="size-4 text-lpo-navy transition-transform group-hover:translate-x-1" />
          </Link>
        }
      />
    </CareersShell>
  )
}
