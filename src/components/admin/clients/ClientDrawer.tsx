import {
  BadgeCheck,
  Building2,
  CalendarDays,
  CalendarRange,
  Coins,
  ExternalLink,
  Factory,
  Globe,
  Mail,
  MapPin,
  Megaphone,
  MessageSquareQuote,
  Pencil,
  Phone,
  Receipt,
  StickyNote,
  UserCog,
  UserRound,
  Users,
  Workflow,
} from 'lucide-react'
import type { AdminClient, ClientStatus } from '@/types/client'
import { StatusBadge } from '@/components/admin/StatusMenu'
import {
  DrawerHeader,
  DrawerInfo,
  DrawerSection,
  DrawerShell,
  PipelineStepper,
  initials,
} from '@/components/admin/drawer'
import { SERVICE_OPTIONS, labelFor } from '@/lib/accountOptions'
import {
  CLIENT_STATUSES,
  ENGAGEMENT_TYPES,
  LEAD_SOURCES,
  clientLocation,
  formatMoney,
  websiteHost,
} from '@/lib/clientOptions'
import { formatDate } from '@/lib/talentStatus'

function contractRange(client: AdminClient): string {
  if (!client.contract_start && !client.contract_end) return '—'
  return `${formatDate(client.contract_start)} – ${client.contract_end ? formatDate(client.contract_end) : 'Ongoing'}`
}

function hasEngagement(client: AdminClient): boolean {
  return Boolean(
    client.engagement_type ||
      client.team_size ||
      client.monthly_value !== null ||
      client.contract_start ||
      client.account_manager,
  )
}

export function ClientDrawer({
  client,
  onClose,
  onEdit,
  onChangeStatus,
  changingStatus,
}: {
  client: AdminClient | null
  onClose: () => void
  onEdit: (client: AdminClient) => void
  onChangeStatus: (client: AdminClient, status: ClientStatus) => void
  changingStatus: boolean
}) {
  return (
    <DrawerShell open={client !== null} onClose={onClose} label={`${client?.company_name ?? 'Client'} details`}>
      {client && (
        <>
          <DrawerHeader
            eyebrow="Client profile"
            avatar={initials(client.company_name)}
            title={client.company_name}
            subtitle={[client.industry, websiteHost(client.company_website)].filter(Boolean).join(' · ') || '—'}
            badge={<StatusBadge options={CLIENT_STATUSES} status={client.status} />}
            action={
              <button
                type="button"
                onClick={() => onEdit(client)}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white/10 px-2.5 text-[12px] font-medium text-white transition-colors hover:bg-white/20"
              >
                <Pencil className="size-3.5" />
                Edit
              </button>
            }
            onClose={onClose}
          />

          <div className="flex-1 overflow-y-auto">
            <DrawerSection title="Client pipeline">
              <PipelineStepper
                options={CLIENT_STATUSES}
                status={client.status}
                changing={changingStatus}
                onChange={(status) => onChangeStatus(client, status)}
                noun="client"
              />
            </DrawerSection>

            <DrawerSection
              title="Engagement"
              action={
                <button
                  type="button"
                  onClick={() => onEdit(client)}
                  className="text-[12px] font-medium text-lpo-blue hover:underline"
                >
                  {hasEngagement(client) ? 'Update' : 'Add details'}
                </button>
              }
            >
              {hasEngagement(client) ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <DrawerInfo icon={Workflow} label="Engagement type">
                    {labelFor(ENGAGEMENT_TYPES, client.engagement_type)}
                  </DrawerInfo>
                  <DrawerInfo icon={Users} label="Team size">
                    {client.team_size ? `${client.team_size} ${client.team_size === 1 ? 'seat' : 'seats'}` : '—'}
                  </DrawerInfo>
                  <DrawerInfo icon={Coins} label="Monthly value">
                    {formatMoney(client.monthly_value, client.currency)}
                  </DrawerInfo>
                  <DrawerInfo icon={CalendarRange} label="Contract">
                    {contractRange(client)}
                  </DrawerInfo>
                  <DrawerInfo icon={UserCog} label="Account manager">
                    {client.account_manager ?? '—'}
                  </DrawerInfo>
                  <DrawerInfo icon={Megaphone} label="Lead source">
                    {labelFor(LEAD_SOURCES, client.lead_source)}
                  </DrawerInfo>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-lpo-navy/15 px-4 py-4 text-center text-[13px] text-muted-foreground">
                  No engagement details yet. Add the team size, contract, and monthly value once the deal is
                  scoped.
                  <div className="mt-2 text-[12px]">
                    Lead source:{' '}
                    <span className="font-medium text-lpo-ink">{labelFor(LEAD_SOURCES, client.lead_source)}</span>
                  </div>
                </div>
              )}
            </DrawerSection>

            <DrawerSection title="Services requested">
              {client.services.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {client.services.map((value) => {
                    const service = SERVICE_OPTIONS.find((s) => s.value === value)
                    const Icon = service?.icon ?? BadgeCheck
                    return (
                      <span
                        key={value}
                        className="inline-flex items-center gap-1.5 rounded-full bg-lpo-blue-soft px-2.5 py-1 text-[12px] font-medium text-lpo-navy ring-1 ring-lpo-blue/15"
                      >
                        <Icon className="size-3.5 text-lpo-blue" />
                        {service?.label ?? value}
                      </span>
                    )
                  })}
                </div>
              ) : (
                <p className="text-[13px] text-muted-foreground">No services selected.</p>
              )}
              {client.message && (
                <div className="mt-4 flex gap-3 rounded-xl bg-lpo-surface/70 p-3.5">
                  <MessageSquareQuote className="mt-0.5 size-4 shrink-0 text-lpo-navy/50" />
                  <p className="text-[13px] leading-relaxed whitespace-pre-line text-lpo-ink">{client.message}</p>
                </div>
              )}
            </DrawerSection>

            <DrawerSection title="Company">
              <div className="grid gap-4 sm:grid-cols-2">
                <DrawerInfo icon={Building2} label="Company">
                  {client.company_name}
                </DrawerInfo>
                <DrawerInfo icon={Factory} label="Industry">
                  {client.industry ?? '—'}
                </DrawerInfo>
                <DrawerInfo icon={Users} label="Company size">
                  {client.company_size ? `${client.company_size} employees` : '—'}
                </DrawerInfo>
                <DrawerInfo icon={MapPin} label="Location">
                  {clientLocation(client.city, client.country)}
                </DrawerInfo>
                <DrawerInfo icon={Globe} label="Website">
                  {client.company_website ? (
                    <a
                      href={client.company_website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 hover:text-lpo-blue"
                    >
                      {websiteHost(client.company_website)}
                      <ExternalLink className="size-3" />
                    </a>
                  ) : (
                    '—'
                  )}
                </DrawerInfo>
              </div>
            </DrawerSection>

            <DrawerSection title="Primary contact">
              <div className="grid gap-4 sm:grid-cols-2">
                <DrawerInfo icon={UserRound} label="Name">
                  {client.name}
                </DrawerInfo>
                <DrawerInfo icon={BadgeCheck} label="Job title">
                  {client.job_title ?? '—'}
                </DrawerInfo>
                <DrawerInfo icon={Mail} label="Email">
                  <a href={`mailto:${client.email}`} className="hover:text-lpo-blue">
                    {client.email}
                  </a>
                </DrawerInfo>
                <DrawerInfo icon={Phone} label="Phone">
                  {client.phone ?? '—'}
                </DrawerInfo>
                <DrawerInfo icon={Receipt} label="Billing email">
                  {client.billing_email ? (
                    <a href={`mailto:${client.billing_email}`} className="hover:text-lpo-blue">
                      {client.billing_email}
                    </a>
                  ) : (
                    '—'
                  )}
                </DrawerInfo>
              </div>
            </DrawerSection>

            <DrawerSection title="Internal notes">
              {client.notes ? (
                <div className="flex gap-3 rounded-xl bg-lpo-yellow-soft/70 p-3.5 ring-1 ring-lpo-yellow/30">
                  <StickyNote className="mt-0.5 size-4 shrink-0 text-amber-600" />
                  <p className="text-[13px] leading-relaxed whitespace-pre-line text-lpo-ink">{client.notes}</p>
                </div>
              ) : (
                <p className="text-[13px] text-muted-foreground">
                  No notes yet. Notes are only visible to admins.
                </p>
              )}
            </DrawerSection>

            <DrawerSection title="Activity">
              <div className="grid gap-4 sm:grid-cols-2">
                <DrawerInfo icon={CalendarDays} label="Client since">
                  {formatDate(client.created_at, true)}
                </DrawerInfo>
                <DrawerInfo icon={CalendarDays} label="Last sign in">
                  {formatDate(client.last_login_at, true)}
                </DrawerInfo>
                <DrawerInfo icon={CalendarDays} label="Status updated">
                  {formatDate(client.status_updated_at, true)}
                </DrawerInfo>
              </div>
            </DrawerSection>
          </div>
        </>
      )}
    </DrawerShell>
  )
}
