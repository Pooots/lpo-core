import { useCallback, useEffect, useState } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  BriefcaseBusiness,
  CircleOff,
  LoaderCircle,
  Pencil,
  Power,
  Trash2,
} from 'lucide-react'
import type { AdminService, ServiceCounts, ServiceListParams } from '@/types/service'
import { ServiceFormDialog } from '@/components/admin/services/ServiceFormDialog'
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
import { parseApiError } from '@/lib/apiErrors'
import { serviceIcon } from '@/lib/serviceIcons'
import { formatDate } from '@/lib/talentStatus'
import { cn } from '@/lib/utils'
import { adminServiceKeys, adminServiceService } from '@/services/adminServiceService'

type Filter = ServiceListParams['status']

const EMPTY_COUNTS: ServiceCounts = { all: 0, active: 0, inactive: 0 }

export default function ServicesPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [form, setForm] = useState<{ service: AdminService | null } | null>(null)
  const { notice, notify } = useNotice()
  const search = useDebounced(searchInput.trim(), 350)

  const params: ServiceListParams = { page, search, status: filter }
  const query = useQuery({
    queryKey: adminServiceKeys.list(params),
    queryFn: () => adminServiceService.list(params),
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    setPage(1)
  }, [search, filter])

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: adminServiceKeys.all })
    void queryClient.invalidateQueries({ queryKey: adminServiceKeys.catalog })
  }, [queryClient])

  const toggleMutation = useMutation({
    mutationFn: (service: AdminService) =>
      adminServiceService.update(service.id, {
        name: service.name,
        description: service.description,
        icon: service.icon,
        is_active: !service.is_active,
        sort_order: service.sort_order,
      }),
    onSuccess: ({ service }) => {
      invalidate()
      notify(
        'success',
        service.is_active
          ? `${service.name} is now offered to clients.`
          : `${service.name} is hidden from clients.`,
      )
    },
    onError: (error) => notify('error', parseApiError(error, 'Could not update the service.').message),
  })

  const deleteMutation = useMutation({
    mutationFn: (service: AdminService) => adminServiceService.remove(service.id),
    onSuccess: (_, service) => {
      invalidate()
      notify('success', `${service.name} was deleted.`)
    },
    onError: (error) => notify('error', parseApiError(error, 'Could not delete the service.').message),
  })

  const counts = query.data?.counts ?? EMPTY_COUNTS
  const meta = query.data?.meta
  const services = query.data?.data ?? []
  const busyId =
    toggleMutation.isPending
      ? toggleMutation.variables.id
      : deleteMutation.isPending
        ? deleteMutation.variables.id
        : null

  return (
    <div className="w-full">
      <PageHeader
        title="Services"
        description="Manage the services LPO offers. Active services appear when clients register or when you add a client."
        actionLabel="Add service"
        onAction={() => setForm({ service: null })}
      />

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          icon={BriefcaseBusiness}
          label="All services"
          caption="In the catalog"
          count={counts.all}
          total={counts.all}
          selected={filter === 'all'}
          accent="bg-lpo-navy text-white"
          bar="bg-lpo-navy"
          index={0}
          badge={false}
          onClick={() => setFilter('all')}
        />
        <StatCard
          icon={Power}
          label="Active"
          caption="Offered to clients"
          count={counts.active}
          total={counts.all}
          selected={filter === 'active'}
          accent="bg-emerald-600 text-white"
          bar="bg-emerald-500"
          index={1}
          onClick={() => setFilter(filter === 'active' ? 'all' : 'active')}
        />
        <StatCard
          icon={CircleOff}
          label="Inactive"
          caption="Hidden from pickers"
          count={counts.inactive}
          total={counts.all}
          selected={filter === 'inactive'}
          accent="bg-slate-500 text-white"
          bar="bg-slate-400"
          index={2}
          onClick={() => setFilter(filter === 'inactive' ? 'all' : 'inactive')}
        />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.05 }}
        className={cn(LIST_CARD, 'mt-5')}
      >
        <ListToolbar
          search={searchInput}
          onSearch={setSearchInput}
          searching={query.isFetching && search !== ''}
          placeholder="Search name, key, description…"
          filterLabel={filter && filter !== 'all' ? filter : null}
          onClearFilter={() => setFilter('all')}
          total={meta?.total}
          noun={['service', 'services']}
          fetching={query.isFetching}
          onRefresh={() => void query.refetch()}
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left">
            <thead>
              <tr className={THEAD_ROW}>
                <th className={TH}>Service</th>
                <th className={TH}>Key</th>
                <th className={TH}>Clients</th>
                <th className={TH}>Status</th>
                <th className={TH}>Updated</th>
                <th className={TH} />
              </tr>
            </thead>
            <tbody>
              {query.isPending ? (
                <SkeletonRows widths={[48, 28, 12, 18, 20]} />
              ) : (
                services.map((service, i) => {
                const Icon = serviceIcon(service.icon)
                const busy = busyId === service.id
                return (
                  <motion.tr
                    key={service.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.03 }}
                    className={cn(
                      'border-t border-lpo-navy/[0.05] transition-colors hover:bg-lpo-surface/60',
                      query.isPlaceholderData && 'opacity-60',
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            'flex size-10 shrink-0 items-center justify-center rounded-xl',
                            service.is_active
                              ? 'bg-lpo-yellow text-lpo-navy'
                              : 'bg-lpo-surface text-muted-foreground',
                          )}
                        >
                          <Icon className="size-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-extrabold text-lpo-ink">
                            {service.name}
                          </span>
                          <span className="block truncate text-[12px] text-muted-foreground">
                            {service.description}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="rounded-md bg-lpo-surface px-1.5 py-0.5 text-[11.5px] font-semibold text-lpo-navy">
                        {service.slug}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-lpo-ink">
                      {service.client_count}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold tracking-wide uppercase',
                          service.is_active
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                            : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
                        )}
                      >
                        {service.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-[12px] text-muted-foreground">
                      {service.updated_at ? formatDate(service.updated_at) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          title="Edit"
                          onClick={() => setForm({ service })}
                          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-white hover:text-lpo-navy"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          title={service.is_active ? 'Deactivate' : 'Activate'}
                          disabled={busy}
                          onClick={() => toggleMutation.mutate(service)}
                          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-white hover:text-lpo-navy disabled:opacity-50"
                        >
                          {busy && toggleMutation.isPending ? (
                            <LoaderCircle className="size-3.5 animate-spin" />
                          ) : (
                            <Power className="size-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          title={
                            service.client_count > 0
                              ? 'In use by clients — deactivate instead'
                              : 'Delete'
                          }
                          disabled={busy || service.client_count > 0}
                          onClick={() => {
                            if (
                              window.confirm(
                                `Delete “${service.name}”? This cannot be undone.`,
                              )
                            ) {
                              deleteMutation.mutate(service)
                            }
                          }}
                          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {busy && deleteMutation.isPending ? (
                            <LoaderCircle className="size-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="size-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })
              )}
            </tbody>
          </table>

          {query.isError && (
            <ListError
              title="Could not load services"
              message={parseApiError(query.error, 'Could not load services.').message}
              onRetry={() => void query.refetch()}
            />
          )}

          {query.isSuccess && services.length === 0 && (
            <ListEmpty
              filtered={search !== '' || filter !== 'all'}
              icon={BriefcaseBusiness}
              title="No services yet"
              filteredTitle="No services match your filters"
              description="Add the services LPO offers so clients can select them when they register."
              actionLabel="Add service"
              onAction={() => setForm({ service: null })}
            />
          )}
        </div>

        <ListFooter meta={meta} onPage={setPage} />
      </motion.section>

      <ServiceFormDialog
        open={form !== null}
        service={form?.service ?? null}
        onClose={() => setForm(null)}
        onSaved={(service, created) => {
          invalidate()
          setForm(null)
          notify('success', created ? `${service.name} was added.` : `${service.name} was updated.`)
        }}
      />

      <NoticeToast notice={notice} />
    </div>
  )
}
