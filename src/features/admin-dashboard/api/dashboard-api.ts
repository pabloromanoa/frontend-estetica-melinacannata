import type { Dashboard } from '@/domain';
import { httpClient } from '@/shared/api';

export const dashboardApi = {
  get: () => httpClient.get<Dashboard>('/admin/dashboard'),
};
