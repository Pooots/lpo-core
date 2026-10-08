import { useCallback, useEffect, useRef, useState } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ChevronRight, FileText, LoaderCircle, Upload, UsersRound } from 'lucide-react'
import type { AdminTalent, TalentCounts, TalentListParams, TalentStatus } from '@/types/talent'
import { AddTalentDialog } from '@/components/admin/talents/AddTalentDialog'
import { TalentDrawer, talentInitials } from '@/components/admin/talents/TalentDrawer'
import { TalentStatusMenu } from '@/components/admin/talents/TalentStatus'
import {
  LIST_CARD,
  ListEmpty,
  ListError,
  ListFooter,
  ListToolbar,
  NoticeToast,
  PageHeader,
  SkeletonRows,
  StatCard,
  TH,
  THEAD_ROW,
  useDebounced,
  useNotice,
} from '@/components/admin/ui'
import { EASE_OUT } from '@/components/home/ui'
import { EXPERIENCE_LEVELS, WORK_SETUPS, labelFor } from '@/lib/accountOptions'
import { parseApiError } from '@/lib/apiErrors'
import {
  CV_ACCEPT,
  TALENT_STATUSES,
  cvFileError,
  formatDate,
  talentStatusMeta,
} from '@/lib/talentStatus'
import { cn } from '@/lib/utils'
import { adminTalentKeys, adminTalentService } from '@/services/adminTalentService'

type Filter = TalentListParams['status']

const EMPTY_COUNTS: TalentCounts = { all: 0, for_assessment: 0, for_evaluation: 0, active: 0 }

export default function TalentsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<AdminTalent | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [openingCvId, setOpeningCvId] = useState<number | null>(null)
  const { notice, notify } = useNotice()
  const search = useDebounced(searchInput.trim(), 350)

  const params: TalentListParams = { page, search, status: filter }
  const query = useQuery({
    queryKey: adminTalentKeys.list(params),
    queryFn: () => adminTalentService.list(params),
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    setPage(1)
  }, [search, filter])

  const statusMutation = useMutation({
    mutationFn: ({ talent, status }: { talent: AdminTalent; status: TalentStatus }) =>
      adminTalentService.updateStatus(talent.id, status),
    onSuccess: ({ talent }) => {
      void queryClient.invalidateQueries({ queryKey: adminTalentKeys.all })
      setSelected((current) => (current?.id === talent.id ? talent : current))
      notify('success', `${talent.name} is now ${talentStatusMeta(talent.status).label}.`)
    },
    onError: (error) => notify('error', parseApiError(error, 'Could not update the status.').message),
  })

  const cvMutation = useMutation({
    mutationFn: ({ talent, file }: { talent: AdminTalent; file: File }) =>
      adminTalentService.uploadCv(talent.id, file),
    onSuccess: (talent) => {
      void queryClient.invalidateQueries({ queryKey: adminTalentKeys.all })
      setSelected((current) => (current?.id === talent.id ? talent : current))
      notify('success', `CV uploaded for ${talent.name}.`)
    },
    onError: (error) => notify('error', parseApiError(error, 'Could not upload the CV.').message),
  })

  const uploadCv = useCallback(
    (talent: AdminTalent, file: File) => cvMutation.mutate({ talent, file }),
    [cvMutation],
  )

  const cvInputRef = useRef<HTMLInputElement>(null)
  const cvTargetRef = useRef<AdminTalent | null>(null)

  const pickCvFor = (talent: AdminTalent) => {
    cvTargetRef.current = talent
    cvInputRef.current?.click()
  }

  const changeStatus = useCallback(
    (talent: AdminTalent, status: TalentStatus) => statusMutation.mutate({ talent, status }),
    [statusMutation],
  )

  const openCv = useCallback(
    async (talent: AdminTalent) => {
      setOpeningCvId(talent.id)
      try {
        await adminTalentService.openCv(talent)
      } catch (error) {
        notify('error', parseApiError(error, 'Could not open the CV.').message)
      } finally {
        setOpeningCvId(null)
      }
    },
    [notify],
  )

  const closeDrawer = useCallback(() => setSelected(null), [])
  const closeAdd = useCallback(() => setAddOpen(false), [])

  const counts = query.data?.counts ?? EMPTY_COUNTS
  const meta = query.data?.meta
  const talents = query.data?.data ?? []
  const pendingId = statusMutation.isPending ? statusMutation.variables.talent.id : null
  const uploadingCvId = cvMutation.isPending ? cvMutation.variables.talent.id : null
  const filtered = search !== '' || filter !== 'all'

  return (
    <div className="w-full">
      <PageHeader
        title="Talents"
        description="All registered job seekers and where they are in the talent pipeline."
        actionLabel="Add talent"
        onAction={() => setAddOpen(true)}
      />

      <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          icon={UsersRound}
          label="All talents"
          caption="Registered job seekers"
          count={counts.all}
          total={counts.all}
          selected={filter === 'all'}
          accent="bg-lpo-navy text-white"
          bar="bg-lpo-navy"
          index={0}
          badge={false}
          onClick={() => setFilter('all')}
        />
        {TALENT_STATUSES.map((status, i) => (
          <StatCard
            key={status.value}
            icon={status.icon}
            label={status.label}
            caption={`Stage ${i + 1} of ${TALENT_STATUSES.length}`}
            count={counts[status.value]}
            total={counts.all}
            selected={filter === status.value}
            accent={status.soft}
            bar={status.dot}
            index={i + 1}
            onClick={() => setFilter(filter === status.value ? 'all' : status.value)}
          />
        ))}
      </div>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
        className={LIST_CARD}
      >
        <ListToolbar
          search={searchInput}
          onSearch={setSearchInput}
          searching={query.isFetching && search !== ''}
          placeholder="Search name, email, position…"
          filterLabel={filter === 'all' ? null : talentStatusMeta(filter).label}
          onClearFilter={() => setFilter('all')}
          total={meta?.total}
          noun={['talent', 'talents']}
          fetching={query.isFetching}
          onRefresh={() => void query.refetch()}
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left">
            <thead>
              <tr className={THEAD_ROW}>
                <th className={TH}>Talent</th>
                <th className={TH}>Position</th>
                <th className={TH}>Location</th>
                <th className={TH}>CV</th>
                <th className={TH}>Status</th>
                <th className={TH}>Registered</th>
                <th className={cn(TH, 'w-10')} />
              </tr>
            </thead>
            <tbody>
              {query.isPending ? (
                <SkeletonRows widths={[42, 28, 22, 14, 18, 14]} />
              ) : (
                talents.map((talent, i) => (
                  <motion.tr
                    key={talent.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.03 }}
                    onClick={() => setSelected(talent)}
                    className={cn(
                      'group cursor-pointer border-t border-lpo-navy/[0.05] transition-colors hover:bg-lpo-surface/60',
                      query.isPlaceholderData && 'opacity-60',
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-lpo-navy text-[11px] font-semibold text-white transition-colors group-hover:bg-lpo-yellow group-hover:text-lpo-ink">
                          {talentInitials(talent.name)}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-medium text-lpo-ink">
                            {talent.name}
                          </span>
                          <span className="block truncate text-[12px] text-muted-foreground">
                            {talent.email}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="block text-[13px] font-medium text-lpo-ink">
                        {talent.desired_position ?? '—'}
                      </span>
                      <span className="block text-[12px] text-muted-foreground">
                        {labelFor(EXPERIENCE_LEVELS, talent.experience_level)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="block text-[13px] text-lpo-ink">{talent.location ?? '—'}</span>
                      <span className="block text-[12px] text-muted-foreground">
                        {labelFor(WORK_SETUPS, talent.work_setup)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {talent.cv ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            void openCv(talent)
                          }}
                          disabled={openingCvId === talent.id}
                          className="inline-flex items-center gap-1.5 rounded-md bg-lpo-blue-soft px-2 py-1 text-[12px] font-medium text-lpo-blue transition-colors hover:bg-lpo-blue hover:text-white disabled:opacity-60"
                        >
                          {openingCvId === talent.id ? (
                            <LoaderCircle className="size-3.5 animate-spin" />
                          ) : (
                            <FileText className="size-3.5" />
                          )}
                          View CV
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            pickCvFor(talent)
                          }}
                          disabled={uploadingCvId === talent.id}
                          title="No CV yet. Click to upload one."
                          className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-[12px] font-medium text-amber-700 ring-1 ring-amber-200/70 transition-colors hover:bg-amber-100 disabled:opacity-60"
                        >
                          {uploadingCvId === talent.id ? (
                            <LoaderCircle className="size-3.5 animate-spin" />
                          ) : (
                            <Upload className="size-3.5" />
                          )}
                          {uploadingCvId === talent.id ? 'Uploading…' : 'Upload CV'}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <TalentStatusMenu
                        status={talent.status}
                        loading={pendingId === talent.id}
                        onChange={(status) => changeStatus(talent, status)}
                      />
                    </td>
                    <td className="px-4 py-3 text-[13px] whitespace-nowrap text-muted-foreground">
                      {formatDate(talent.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-lpo-ink" />
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>

          {query.isError && (
            <ListError
              title="Could not load talents"
              message={parseApiError(query.error).message}
              onRetry={() => void query.refetch()}
            />
          )}

          {query.isSuccess && talents.length === 0 && (
            <ListEmpty
              filtered={filtered}
              icon={UsersRound}
              title="No talents yet"
              filteredTitle="No talents match your filters"
              description="Job seekers who register on LPO Careers will appear here. You can also add one manually."
              actionLabel="Add talent"
              onAction={() => setAddOpen(true)}
            />
          )}
        </div>

        <ListFooter meta={meta} onPage={setPage} />
      </motion.section>

      <TalentDrawer
        talent={selected}
        onClose={closeDrawer}
        onChangeStatus={changeStatus}
        changingStatus={selected !== null && pendingId === selected.id}
        onOpenCv={(talent) => void openCv(talent)}
        openingCv={selected !== null && openingCvId === selected.id}
        onUploadCv={uploadCv}
        uploadingCv={selected !== null && uploadingCvId === selected.id}
      />

      <input
        ref={cvInputRef}
        type="file"
        accept={CV_ACCEPT}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          const talent = cvTargetRef.current
          e.target.value = ''
          if (!file || !talent) return
          const invalid = cvFileError(file)
          if (invalid) notify('error', invalid)
          else uploadCv(talent, file)
        }}
      />

      <AddTalentDialog
        open={addOpen}
        onClose={closeAdd}
        onCreated={(talent) => {
          setAddOpen(false)
          setFilter('all')
          setSearchInput('')
          void queryClient.invalidateQueries({ queryKey: adminTalentKeys.all })
          notify('success', `${talent.name} was added to the talent pool.`)
        }}
      />

      <NoticeToast notice={notice} />
    </div>
  )
}
