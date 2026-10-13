import type { MyAppointments, Recommendation } from '@/domain';
import { httpClient } from '@/shared/api';

export const clientPortalApi = {
  appointments: () => httpClient.get<MyAppointments>('/me/appointments'),
  recommendations: () => httpClient.get<Recommendation[]>('/me/recommendations'),
};
