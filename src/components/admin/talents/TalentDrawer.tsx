import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarDays,
  Download,
  ExternalLink,
  FileText,
  Gauge,
  LoaderCircle,
  Mail,
  MapPin,
  Monitor,
  Phone,
  RefreshCw,
  UploadCloud,
} from 'lucide-react'
import { TalentStatusBadge } from './TalentStatus'
import type { AdminTalent, TalentStatus } from '@/types/talent'
import {
  DrawerHeader,
  DrawerInfo,
  DrawerSection,
  DrawerShell,
  PipelineStepper,
  initials,
} from '@/components/admin/drawer'
import { EXPERIENCE_LEVELS, WORK_SETUPS, labelFor } from '@/lib/accountOptions'
import { CV_ACCEPT, TALENT_STATUSES, cvFileError, formatDate, formatFileSize } from '@/lib/talentStatus'
import { cn } from '@/lib/utils'

export const talentInitials = initials

function CvPanel({
  talent,
  onOpen,
  opening,
  onUpload,
  uploading,
}: {
  talent: AdminTalent
  onOpen: () => void
  opening: boolean
  onUpload: (file: File) => void
  uploading: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isPdf = talent.cv?.name?.toLowerCase().endsWith('.pdf') ?? false

  useEffect(() => {
    setError(null)
  }, [talent.id])

  const pick = (file: File | undefined) => {
    if (!file) return
    const invalid = cvFileError(file)
    setError(invalid ?? null)
    if (!invalid) onUpload(file)
  }

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={CV_ACCEPT}
      className="sr-only"
      onChange={(e) => {
        pick(e.target.files?.[0])
        e.target.value = ''
      }}
    />
  )

  return (
    <div>
      {talent.cv ? (
        <div className="flex items-center gap-3 rounded-xl border border-lpo-navy/[0.08] bg-lpo-surface/60 p-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-lpo-blue text-white">
            {uploading ? <LoaderCircle className="size-[18px] animate-spin" /> : <FileText className="size-[18px]" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium text-lpo-ink">{talent.cv.name}</span>
            <span className="block text-[11.5px] text-muted-foreground">
              {uploading
                ? 'Uploading new CV…'
                : `${formatFileSize(talent.cv.size)} · ${formatDate(talent.cv.uploaded_at)}`}
            </span>
          </span>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={onOpen}
              disabled={opening || uploading}
              className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-[12px] font-medium text-lpo-blue ring-1 ring-lpo-blue/20 transition-colors hover:bg-lpo-blue-soft disabled:opacity-60"
            >
              {opening ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : isPdf ? (
                <ExternalLink className="size-3.5" />
              ) : (
                <Download className="size-3.5" />
              )}
              {isPdf ? 'View' : 'Download'}
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              aria-label="Replace CV"
              title="Replace CV"
              className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-[12px] font-medium text-lpo-navy ring-1 ring-lpo-navy/15 transition-colors hover:bg-lpo-surface disabled:opacity-60"
            >
              <RefreshCw className="size-3.5" />
              Replace
            </button>
          </div>
          {input}
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
            <p className="text-[13px] text-amber-800">
              <span className="font-semibold">No CV uploaded yet.</span> Upload it here, or the talent can
              add it from their LPO Careers account.
            </p>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              pick(e.dataTransfer.files[0])
            }}
            className={cn(
              'flex w-full flex-col items-center rounded-xl border-2 border-dashed px-4 py-5 text-center transition-colors disabled:cursor-wait',
              dragging
                ? 'border-lpo-blue bg-lpo-blue-soft'
                : 'border-lpo-navy/15 hover:border-lpo-blue/50 hover:bg-lpo-surface/60',
            )}
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-lpo-blue-soft text-lpo-blue">
              {uploading ? <LoaderCircle className="size-[18px] animate-spin" /> : <UploadCloud className="size-[18px]" />}
            </span>
            <span className="mt-2.5 text-[13px] font-medium text-lpo-ink">
              {uploading ? (
                'Uploading CV…'
              ) : (
                <>
                  <span className="text-lpo-blue">Upload CV</span> or drag and drop
                </>
              )}
            </span>
            <span className="mt-0.5 text-[11.5px] text-muted-foreground">PDF, DOC, or DOCX up to 5 MB</span>
          </button>
          {input}
        </>
      )}
      {error && (
        <p role="alert" className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-rose-600">
          <AlertTriangle className="size-3.5" />
          {error}
        </p>
      )}
    </div>
  )
}

export function TalentDrawer({
  talent,
  onClose,
  onChangeStatus,
  changingStatus,
  onOpenCv,
  openingCv,
  onUploadCv,
  uploadingCv,
}: {
  talent: AdminTalent | null
  onClose: () => void
  onChangeStatus: (talent: AdminTalent, status: TalentStatus) => void
  changingStatus: boolean
  onOpenCv: (talent: AdminTalent) => void
  openingCv: boolean
  onUploadCv: (talent: AdminTalent, file: File) => void
  uploadingCv: boolean
}) {
  return (
    <DrawerShell open={talent !== null} onClose={onClose} label={`${talent?.name ?? 'Talent'} details`}>
      {talent && (
        <>
          <DrawerHeader
            eyebrow="Talent profile"
            avatar={initials(talent.name)}
            title={talent.name}
            subtitle={talent.desired_position ?? '—'}
            badge={<TalentStatusBadge status={talent.status} />}
            onClose={onClose}
          />

          <div className="flex-1 overflow-y-auto">
            <DrawerSection title="Talent pipeline">
              <PipelineStepper
                options={TALENT_STATUSES}
                status={talent.status}
                changing={changingStatus}
                onChange={(status) => onChangeStatus(talent, status)}
                noun="talent"
              />
            </DrawerSection>

            <DrawerSection title="Curriculum vitae">
              <CvPanel
                talent={talent}
                onOpen={() => onOpenCv(talent)}
                opening={openingCv}
                onUpload={(file) => onUploadCv(talent, file)}
                uploading={uploadingCv}
              />
            </DrawerSection>

            <DrawerSection title="Profile">
              <div className="grid gap-4 sm:grid-cols-2">
                <DrawerInfo icon={Mail} label="Email">
                  <a href={`mailto:${talent.email}`} className="hover:text-lpo-blue">
                    {talent.email}
                  </a>
                </DrawerInfo>
                <DrawerInfo icon={Phone} label="Phone">
                  {talent.phone ?? '—'}
                </DrawerInfo>
                <DrawerInfo icon={BriefcaseBusiness} label="Desired position">
                  {talent.desired_position ?? '—'}
                </DrawerInfo>
                <DrawerInfo icon={Gauge} label="Experience">
                  {labelFor(EXPERIENCE_LEVELS, talent.experience_level)}
                </DrawerInfo>
                <DrawerInfo icon={MapPin} label="Location">
                  {talent.location ?? '—'}
                </DrawerInfo>
                <DrawerInfo icon={Monitor} label="Work setup">
                  {labelFor(WORK_SETUPS, talent.work_setup)}
                </DrawerInfo>
              </div>
              {talent.linkedin_url && (
                <a
                  href={talent.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-lpo-blue hover:underline"
                >
                  <ExternalLink className="size-3.5" />
                  LinkedIn / portfolio
                </a>
              )}
              <div className="mt-4">
                <p className="text-[11px] text-muted-foreground">Skills</p>
                {talent.skills.length > 0 ? (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {talent.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-lpo-yellow-soft px-2.5 py-0.5 text-[12px] font-medium text-lpo-navy ring-1 ring-lpo-yellow/40"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-[13px] font-medium text-lpo-ink">—</p>
                )}
              </div>
            </DrawerSection>

            <DrawerSection title="Activity">
              <div className="grid gap-4 sm:grid-cols-2">
                <DrawerInfo icon={CalendarDays} label="Registered">
                  {formatDate(talent.created_at, true)}
                </DrawerInfo>
                <DrawerInfo icon={CalendarDays} label="Last sign in">
                  {formatDate(talent.last_login_at, true)}
                </DrawerInfo>
                <DrawerInfo icon={CalendarDays} label="Status updated">
                  {formatDate(talent.status_updated_at, true)}
                </DrawerInfo>
              </div>
            </DrawerSection>
          </div>
        </>
      )}
    </DrawerShell>
  )
}
