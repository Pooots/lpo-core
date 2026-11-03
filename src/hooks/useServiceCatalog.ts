import { useQuery } from '@tanstack/react-query'
import type { LucideIcon } from 'lucide-react'
import { SERVICE_OPTIONS } from '@/lib/accountOptions'
import { serviceIcon } from '@/lib/serviceIcons'
import { adminServiceKeys, serviceCatalogService } from '@/services/adminServiceService'

export type CatalogService = {
  value: string
  label: string
  description: string
  icon: LucideIcon
}

const FALLBACK: Array<CatalogService> = SERVICE_OPTIONS.map((option) => ({
  value: option.value,
  label: option.label,
  description: option.description,
  icon: option.icon,
}))

export function useServiceCatalog() {
  const query = useQuery({
    queryKey: adminServiceKeys.catalog,
    queryFn: serviceCatalogService.list,
    staleTime: 60_000,
  })

  const options: Array<CatalogService> = query.data
    ? query.data.map((item) => ({
        value: item.value,
        label: item.label,
        description: item.description,
        icon: serviceIcon(item.icon),
      }))
    : FALLBACK

  const labelFor = (value: string | null | undefined): string =>
    options.find((option) => option.value === value)?.label ?? value ?? '—'

  return { ...query, options, labelFor }
}
