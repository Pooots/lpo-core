import type {
  AdminService,
  SaveServicePayload,
  ServiceListParams,
  ServiceListResponse,
  ServiceOption,
} from '@/types/service'
import api from '@/lib/api'

export const adminServiceKeys = {
  all: ['admin', 'services'] as const,
  list: (params: ServiceListParams) => [...adminServiceKeys.all, 'list', params] as const,
  catalog: ['services', 'catalog'] as const,
}

export const serviceCatalogService = {
  async list(): Promise<Array<ServiceOption>> {
    const { data } = await api.get<{ data: Array<ServiceOption> }>('/services')
    return data.data
  },
}

export const adminServiceService = {
  async list(params: ServiceListParams = {}): Promise<ServiceListResponse> {
    const { data } = await api.get<ServiceListResponse>('/admin/services', {
      params: {
        page: params.page ?? 1,
        per_page: params.per_page ?? 20,
        search: params.search || undefined,
        status: params.status && params.status !== 'all' ? params.status : undefined,
      },
    })
    return data
  },

  async create(payload: SaveServicePayload): Promise<{ message: string; service: AdminService }> {
    const { data } = await api.post<{ message: string; service: AdminService }>(
      '/admin/services',
      payload,
    )
    return data
  },

  async update(
    id: number,
    payload: Omit<SaveServicePayload, 'slug'>,
  ): Promise<{ message: string; service: AdminService }> {
    const { data } = await api.put<{ message: string; service: AdminService }>(
      `/admin/services/${id}`,
      payload,
    )
    return data
  },

  async remove(id: number): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/admin/services/${id}`)
    return data
  },
}
