import type { AdminDashboard } from '@/types/dashboard'
import api from '@/lib/api'

export const adminDashboardKeys = {
  all: ['admin', 'dashboard'] as const,
}

export const adminDashboardService = {
  async get(): Promise<AdminDashboard> {
    const { data } = await api.get<AdminDashboard>('/admin/dashboard')
    return data
  },
}
