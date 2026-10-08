import type {
  AdminTalent,
  CreateTalentPayload,
  TalentCounts,
  TalentListParams,
  TalentListResponse,
  TalentStatus,
} from '@/types/talent'
import api from '@/lib/api'
import { MULTIPART, toFormData } from '@/lib/formData'

export const adminTalentKeys = {
  all: ['admin', 'talents'] as const,
  list: (params: TalentListParams) => ['admin', 'talents', 'list', params] as const,
}

export const adminTalentService = {
  async list(params: TalentListParams): Promise<TalentListResponse> {
    const { data } = await api.get<TalentListResponse>('/admin/talents', {
      params: {
        page: params.page,
        per_page: 10,
        search: params.search || undefined,
        status: params.status === 'all' ? undefined : params.status,
      },
    })
    return data
  },

  async create(payload: CreateTalentPayload): Promise<AdminTalent> {
    const { data } = await api.post<{ talent: AdminTalent }>(
      '/admin/talents',
      toFormData(payload),
      MULTIPART,
    )
    return data.talent
  },

  async updateStatus(
    id: number,
    status: TalentStatus,
  ): Promise<{ talent: AdminTalent; counts: TalentCounts }> {
    const { data } = await api.patch<{ talent: AdminTalent; counts: TalentCounts }>(
      `/admin/talents/${id}/status`,
      { status },
    )
    return data
  },

  async uploadCv(id: number, file: File): Promise<AdminTalent> {
    const { data } = await api.post<{ talent: AdminTalent }>(
      `/admin/talents/${id}/cv`,
      toFormData({ cv: file }),
      MULTIPART,
    )
    return data.talent
  },

  /**
   * PDFs open in a new tab; Word files download. The tab is opened before the
   * request so the browser does not treat it as an unsolicited popup.
   */
  async openCv(talent: AdminTalent): Promise<void> {
    const fileName = talent.cv?.name ?? `${talent.name} CV`
    const isPdf = fileName.toLowerCase().endsWith('.pdf')
    const preview = isPdf ? window.open('', '_blank') : null

    try {
      const { data } = await api.get<Blob>(`/admin/talents/${talent.id}/cv`, {
        responseType: 'blob',
      })
      const url = URL.createObjectURL(
        isPdf ? new Blob([data], { type: 'application/pdf' }) : data,
      )

      if (preview) {
        preview.location.href = url
      } else {
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        link.remove()
      }
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } catch (error) {
      preview?.close()
      throw error
    }
  },
}
