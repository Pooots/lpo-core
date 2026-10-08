import axios from 'axios'
import type { ApiInfoResponse, HealthResponse } from '@/types/system'
import { API_ROOT_URL } from '@/lib/api'

const rootApi = axios.create({
  baseURL: API_ROOT_URL,
  headers: { Accept: 'application/json' },
})

export const systemService = {
  async getApiInfo(): Promise<ApiInfoResponse> {
    const { data } = await rootApi.get<ApiInfoResponse>('/')
    return data
  },

  /** Resolves on 503 too: the backend is up, only the database is degraded. */
  async getHealth(): Promise<HealthResponse> {
    const { data } = await rootApi.get<HealthResponse>('/health', {
      validateStatus: (status) => status === 200 || status === 503,
    })
    return data
  },
}
