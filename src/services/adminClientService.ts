import type {
  AdminClient,
  ClientCounts,
  ClientListParams,
  ClientListResponse,
  ClientStatus,
  SaveClientPayload,
} from '@/types/client'
import api from '@/lib/api'

export const adminClientKeys = {
  all: ['admin', 'clients'] as const,
  list: (params: ClientListParams) => ['admin', 'clients', 'list', params] as const,
}

export const adminClientService = {
  async list(params: ClientListParams): Promise<ClientListResponse> {
    const { data } = await api.get<ClientListResponse>('/admin/clients', {
      params: {
        page: params.page,
        per_page: 10,
        search: params.search || undefined,
        status: params.status === 'all' ? undefined : params.status,
      },
    })
    return data
  },

  async create(payload: SaveClientPayload): Promise<AdminClient> {
    const { data } = await api.post<{ client: AdminClient }>('/admin/clients', payload)
    return data.client
  },

  async update(id: number, payload: SaveClientPayload): Promise<AdminClient> {
    const { data } = await api.put<{ client: AdminClient }>(`/admin/clients/${id}`, payload)
    return data.client
  },

  async updateStatus(
    id: number,
    status: ClientStatus,
  ): Promise<{ client: AdminClient; counts: ClientCounts }> {
    const { data } = await api.patch<{ client: AdminClient; counts: ClientCounts }>(
      `/admin/clients/${id}/status`,
      { status },
    )
    return data
  },
}
