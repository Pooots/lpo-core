import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  FileText,
  FileUp,
  LoaderCircle,
} from 'lucide-react'
import type { ReactNode } from 'react'
import type { AccountSession, CandidateProfile } from '@/types/auth'
import { EASE_OUT } from '@/components/home/ui'
import { EXPERIENCE_LEVELS, WORK_SETUPS, labelFor } from '@/lib/accountOptions'
import { parseApiError } from '@/lib/apiErrors'
import {
  CV_ACCEPT,
  cvFileError,
  formatDate,
  formatFileSize,
  talentStatusMeta,
} from '@/lib/talentStatus'
import { cn } from '@/lib/utils'
import { authService } from '@/services/authService'
import { useCareersSession } from '@/routes/careers/CareersSession'

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-b border-border/70 py-3.5 last:border-0">
      <dt className="text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-[15px] font-semibold break-words text-lpo-ink">{children}</dd>
    </div>
  )
}

function Chips({ items }: { items: Array<string> }) {
  if (items.length === 0) return <span className="text-muted-foreground">—</span>
  return (
    <span className="mt-1 flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-lpo-yellow/40 bg-lpo-yellow-soft px-2.5 py-1 text-xs font-bold text-lpo-navy"
        >
          {item}
        </span>
      ))}
    </span>
  )
}

function CvCard({
  profile,
  onUploaded,
}: {
  profile: CandidateProfile | null
  onUploaded: (session: AccountSession) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cv = profile?.cv ?? null

  const upload = async (file: File | null) => {
    const invalid = cvFileError(file)
    if (invalid || !file) {
      setError(invalid ?? null)
      return
    }
    setError(null)
    setUploading(true)
    try {
      onUploaded(await authService.uploadCv(file))
    } catch (err) {
      const info = parseApiError(err, 'We could not upload your CV. Please try again.')
      setError('cv' in info.fieldErrors ? info.fieldErrors.cv : info.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <section
      className={cn(
        'rounded-3xl p-6 shadow-[0_24px_50px_-34px_rgb(11_37_89/0.35)] ring-1 sm:p-7',
        cv ? 'bg-white ring-lpo-navy/[0.06]' : 'bg-amber-50 ring-amber-200',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={CV_ACCEPT}
        className="sr-only"
        onChange={(e) => {
          void upload(e.target.files?.item(0) ?? null)
          e.target.value = ''
        }}
      />
      {cv ? (
        <>
          <h2 className="text-base font-extrabold text-lpo-ink">Your CV</h2>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-lpo-yellow/40 bg-lpo-yellow-soft/60 p-3.5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-lpo-yellow text-lpo-navy">
              <FileText className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-extrabold text-lpo-ink">{cv.name}</span>
              <span className="block text-xs font-semibold text-muted-foreground">
                {formatFileSize(cv.size)} · Uploaded {formatDate(cv.uploaded_at)}
              </span>
            </span>
          </div>
        </>
      ) : (
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
            <AlertTriangle className="size-5" />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-amber-900">Your CV is required</h2>
            <p className="mt-1 text-sm leading-relaxed text-amber-800/80">
              Upload your CV so our team can start assessing your application.
            </p>
          </div>
        </div>
      )}
      {error && <p className="mt-3 text-xs font-semibold text-rose-600">{error}</p>}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={cn(
          'mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-extrabold transition-all hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70',
          cv
            ? 'border border-border bg-white text-lpo-navy hover:border-lpo-navy/30'
            : 'bg-lpo-navy text-white',
        )}
      >
        {uploading ? <LoaderCircle className="size-4 animate-spin" /> : <FileUp className="size-4" />}
        {uploading ? 'Uploading…' : cv ? 'Replace CV' : 'Upload your CV'}
      </button>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        PDF, DOC, or DOCX up to 5 MB
      </p>
    </section>
  )
}

export default function ProfilePage() {
  const { session, setSession } = useCareersSession()
  const { user, profile } = session
  const badge = profile?.cv ? talentStatusMeta(profile.status) : null

  return (
    <div className="mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-[1.9rem] font-extrabold tracking-[-0.03em] text-lpo-ink">
            Profile
          </h1>
          <p className="mt-1.5 text-[15px] text-muted-foreground">
            This is what our recruiters see when reviewing your application.
          </p>
        </div>
        {badge && (
          <span className="inline-flex items-center gap-2 rounded-full bg-lpo-yellow px-3.5 py-1.5 text-[11px] font-extrabold tracking-[0.14em] text-lpo-navy uppercase">
            <badge.icon className="size-3.5" />
            {badge.label}
          </span>
        )}
      </motion.div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE_OUT, delay: 0.08 }}
          className="rounded-3xl bg-white p-6 shadow-[0_24px_50px_-34px_rgb(11_37_89/0.35)] ring-1 ring-lpo-navy/[0.06] sm:p-8"
        >
          <div className="flex items-center gap-4 border-b border-border/70 pb-5">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-lpo-navy text-lg font-extrabold text-white">
              {user.name
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((p) => p.charAt(0).toUpperCase())
                .join('')}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-extrabold text-lpo-ink">{user.name}</h2>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {profile?.desired_position ?? 'Candidate'}
                {profile?.location ? ` · ${profile.location}` : ''}
              </p>
            </div>
          </div>

          <dl className="mt-2">
            <Detail label="Email">{user.email}</Detail>
            <Detail label="Mobile">{user.phone ?? '—'}</Detail>
            <Detail label="Location">{profile?.location ?? '—'}</Detail>
            <Detail label="Desired position">{profile?.desired_position ?? '—'}</Detail>
            <Detail label="Experience">
              {labelFor(EXPERIENCE_LEVELS, profile?.experience_level)}
            </Detail>
            <Detail label="Work setup">{labelFor(WORK_SETUPS, profile?.work_setup)}</Detail>
            <Detail label="Skills">
              <Chips items={profile?.skills ?? []} />
            </Detail>
            {profile?.linkedin_url && (
              <Detail label="LinkedIn / portfolio">
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-lpo-navy underline decoration-lpo-yellow decoration-2 underline-offset-4"
                >
                  {profile.linkedin_url}
                </a>
              </Detail>
            )}
          </dl>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE_OUT, delay: 0.14 }}
        >
          <CvCard profile={profile} onUploaded={setSession} />
        </motion.div>
      </div>
    </div>
  )
}
