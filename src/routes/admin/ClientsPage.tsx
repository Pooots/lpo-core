import { useCallback, useEffect, useState } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Building2, ChevronRight } from 'lucide-react'
import type { AdminClient, ClientCounts, ClientListParams, ClientStatus } from '@/types/client'
import { ClientDrawer } from '@/components/admin/clients/ClientDrawer'
import { ClientFormDialog } from '@/components/admin/clients/ClientFormDialog'
import { StatusMenu } from '@/components/admin/StatusMenu'
import { initials } from '@/components/admin/drawer'
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
import { SERVICE_OPTIONS, labelFor } from '@/lib/accountOptions'
import { parseApiError } from '@/lib/apiErrors'
import {
  CLIENT_STATUSES,
  ENGAGEMENT_TYPES,
  clientLocation,
  clientStatusMeta,
  formatMoney,
  websiteHost,
} from '@/lib/clientOptions'
import { formatDate } from '@/lib/talentStatus'
import { cn } from '@/lib/utils'
import { adminClientKeys, adminClientService } from '@/services/adminClientService'

type Filter = ClientListParams['status']

const EMPTY_COUNTS: ClientCounts = {
  all: 0,
  new_inquiry: 0,
  discovery: 0,
  proposal: 0,
  active: 0,
  inactive: 0,
}

const PIPELINE_LENGTH = CLIENT_STATUSES.filter((s) => !s.offPipeline).length

function serviceLabel(value: string): string {
  return SERVICE_OPTIONS.find((s) => s.value === value)?.label ?? value
}

export default function ClientsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<AdminClient | null>(null)
  const [form, setForm] = useState<{ client: AdminClient | null } | null>(null)
  const { notice, notify } = useNotice()
  const search = useDebounced(searchInput.trim(), 350)

  const params: ClientListParams = { page, search, status: filter }
  const query = useQuery({
    queryKey: adminClientKeys.list(params),
    queryFn: () => adminClientService.list(params),
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    setPage(1)
  }, [search, filter])

  const statusMutation = useMutation({
    mutationFn: ({ client, status }: { client: AdminClient; status: ClientStatus }) =>
      adminClientService.updateStatus(client.id, status),
    onSuccess: ({ client }) => {
      void queryClient.invalidateQueries({ queryKey: adminClientKeys.all })
      setSelected((current) => (current?.id === client.id ? client : current))
      notify('success', `${client.company_name} is now ${clientStatusMeta(client.status).label}.`)
    },
    onError: (error) => notify('error', parseApiError(error, 'Could not update the status.').message),
  })

  const changeStatus = useCallback(
    (client: AdminClient, status: ClientStatus) => statusMutation.mutate({ client, status }),
    [statusMutation],
  )

  const closeDrawer = useCallback(() => setSelected(null), [])
  const closeForm = useCallback(() => setForm(null), [])
  const openEdit = useCallback((client: AdminClient) => setForm({ client }), [])

  const counts = query.data?.counts ?? EMPTY_COUNTS
  const meta = query.data?.meta
  const clients = query.data?.data ?? []
  const pendingId = statusMutation.isPending ? statusMutation.variables.client.id : null

  return (
    <div className="w-full">
      <PageHeader
        title="Clients"
        description="LPO's client companies, their service requests, and where each account is in the pipeline."
        actionLabel="Add client"
        onAction={() => setForm({ client: null })}
      />

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard
          icon={Building2}
          label="All clients"
          caption="Registered companies"
          count={counts.all}
          total={counts.all}
          selected={filter === 'all'}
          accent="bg-lpo-navy text-white"
          bar="bg-lpo-navy"
          index={0}
          badge={false}
          onClick={() => setFilter('all')}
        />
        {CLIENT_STATUSES.map((status, i) => (
          <StatCard
            key={status.value}
            icon={status.icon}
            label={status.label}
            caption={status.offPipeline ? 'Paused or ended' : `Stage ${i + 1} of ${PIPELINE_LENGTH}`}
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
          placeholder="Search company, contact, industry…"
          filterLabel={filter === 'all' ? null : clientStatusMeta(filter).label}
          onClearFilter={() => setFilter('all')}
          total={meta?.total}
          noun={['client', 'clients']}
          fetching={query.isFetching}
          onRefresh={() => void query.refetch()}
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] table-fixed text-left">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[19%]" />
              <col className="w-[16%]" />
              <col className="w-[17%]" />
              <col className="w-[12%]" />
              <col className="w-[10%]" />
              <col className="w-[4%]" />
            </colgroup>
            <thead>
              <tr className={THEAD_ROW}>
                <th className={TH}>Company</th>
                <th className={TH}>Primary contact</th>
                <th className={TH}>Services</th>
                <th className={TH}>Engagement</th>
                <th className={TH}>Status</th>
                <th className={TH}>Client since</th>
                <th className={TH} />
              </tr>
            </thead>
            <tbody>
              {query.isPending ? (
                <SkeletonRows widths={[44, 34, 30, 26, 18, 14]} />
              ) : (
                clients.map((client, i) => (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.03 }}
                    onClick={() => setSelected(client)}
                    className={cn(
                      'group cursor-pointer border-t border-lpo-navy/[0.05] transition-colors hover:bg-lpo-surface/60',
                      query.isPlaceholderData && 'opacity-60',
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-lpo-navy text-[11px] font-semibold text-white transition-colors group-hover:bg-lpo-yellow group-hover:text-lpo-ink">
                          {initials(client.company_name)}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-medium text-lpo-ink">
                            {client.company_name}
                          </span>
                          <span className="block truncate text-[12px] text-muted-foreground">
                            {[client.industry, clientLocation(client.city, client.country)]
                              .filter((v) => v && v !== '—')
                              .join(' · ') ||
                              websiteHost(client.company_website) ||
                              '—'}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="block truncate text-[13px] font-medium text-lpo-ink">{client.name}</span>
                      <span className="block truncate text-[12px] text-muted-foreground">
                        {client.job_title ? `${client.job_title} · ` : ''}
                        {client.email}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {client.services.slice(0, 2).map((service) => (
                          <span
                            key={service}
                            className="max-w-full truncate rounded-md bg-lpo-surface px-1.5 py-0.5 text-[11.5px] text-lpo-navy ring-1 ring-lpo-navy/[0.06]"
                          >
                            {serviceLabel(service)}
                          </span>
                        ))}
                        {client.services.length > 2 && (
                          <span
                            className="rounded-md px-1.5 py-0.5 text-[11.5px] font-medium text-muted-foreground"
                            title={client.services.slice(2).map(serviceLabel).join(', ')}
                          >
                            +{client.services.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {client.engagement_type || client.team_size || client.monthly_value !== null ? (
                        <>
                          <span className="block truncate text-[13px] text-lpo-ink">
                            {client.engagement_type ? labelFor(ENGAGEMENT_TYPES, client.engagement_type) : 'Engagement'}
                            {client.team_size ? ` · ${client.team_size} ${client.team_size === 1 ? 'seat' : 'seats'}` : ''}
                          </span>
                          <span className="block truncate text-[12px] text-muted-foreground">
                            {client.monthly_value !== null
                              ? `${formatMoney(client.monthly_value, client.currency)} / month`
                              : 'Value not set'}
                          </span>
                        </>
                      ) : (
                        <span className="text-[12px] text-muted-foreground">Not scoped yet</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusMenu
                        options={CLIENT_STATUSES}
                        status={client.status}
                        loading={pendingId === client.id}
                        onChange={(status) => changeStatus(client, status)}
                      />
                    </td>
                    <td className="px-4 py-3 text-[13px] whitespace-nowrap text-muted-foreground">
                      {formatDate(client.created_at)}
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
              title="Could not load clients"
              message={parseApiError(query.error).message}
              onRetry={() => void query.refetch()}
            />
          )}

          {query.isSuccess && clients.length === 0 && (
            <ListEmpty
              filtered={search !== '' || filter !== 'all'}
              icon={Building2}
              title="No clients yet"
              filteredTitle="No clients match your filters"
              description="Companies that register on LPO for Business will appear here. You can also add one manually."
              actionLabel="Add client"
              onAction={() => setForm({ client: null })}
            />
          )}
        </div>

        <ListFooter meta={meta} onPage={setPage} />
      </motion.section>

      <ClientDrawer
        client={selected}
        onClose={closeDrawer}
        onEdit={openEdit}
        onChangeStatus={changeStatus}
        changingStatus={selected !== null && pendingId === selected.id}
      />

      <ClientFormDialog
        open={form !== null}
        client={form?.client ?? null}
        onClose={closeForm}
        onSaved={(client, created) => {
          setForm(null)
          if (created) {
            setFilter('all')
            setSearchInput('')
          }
          setSelected((current) => (current?.id === client.id ? client : current))
          void queryClient.invalidateQueries({ queryKey: adminClientKeys.all })
          notify('success', created ? `${client.company_name} was added as a client.` : `${client.company_name} was updated.`)
        }}
      />

      <NoticeToast notice={notice} />
    </div>
  )
}
