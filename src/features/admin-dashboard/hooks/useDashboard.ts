import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api';
import { dashboardApi } from '../api/dashboard-api';

/** Los datos viven sólo en la caché en memoria de TanStack Query (no se persisten en el navegador). */
export function useDashboard() {
  return useQuery({ queryKey: queryKeys.admin.dashboard, queryFn: dashboardApi.get });
}
