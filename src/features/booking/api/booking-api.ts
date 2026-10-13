import type { CreateAppointmentInput, CreateAppointmentResult } from '@/domain';
import { httpClient } from '@/shared/api';

export const bookingApi = {
  create: (input: CreateAppointmentInput) => httpClient.post<CreateAppointmentResult>('/appointments', input),
};
