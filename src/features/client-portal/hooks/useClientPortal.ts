import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api';
import { clientPortalApi } from '../api/client-portal-api';

export function useMyAppointments() {
  return useQuery({ queryKey: queryKeys.appointments.mine, queryFn: clientPortalApi.appointments });
}

export function useMyRecommendations() {
  return useQuery({ queryKey: queryKeys.recommendations.mine, queryFn: clientPortalApi.recommendations });
}
