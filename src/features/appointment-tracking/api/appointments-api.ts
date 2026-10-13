import type { Appointment, AppointmentStatus, RescheduleInput } from '@/domain';
import { httpClient } from '@/shared/api';

export interface AppointmentListParams {
  from: string;
  to: string;
  providerId?: string;
  status?: AppointmentStatus[];
  search?: string;
}

function receiptForm(file: File): FormData {
  const form = new FormData();
  form.append('file', file);
  return form;
}

export const appointmentsApi = {
  detail: (id: string) => httpClient.get<Appointment>(`/appointments/${id}`),
  list: ({ status, ...params }: AppointmentListParams) =>
    httpClient.get<Appointment[]>('/appointments', {
      query: { ...params, status: status?.length ? status.join(',') : undefined },
    }),
  uploadReceipt: (id: string, file: File) =>
    httpClient.post<Appointment>(`/appointments/${id}/receipt`, receiptForm(file)),
  cancel: (id: string, reason?: string) =>
    httpClient.post<Appointment>(`/appointments/${id}/cancel`, reason ? { reason } : {}),
  reschedule: (id: string, input: RescheduleInput) =>
    httpClient.post<Appointment>(`/appointments/${id}/reschedule`, input),
  finish: (id: string) => httpClient.post<Appointment>(`/appointments/${id}/finish`),
};

/** Acceso por enlace privado del invitado (`/turno/:token`). */
export const guestAppointmentsApi = {
  detail: (token: string) => httpClient.get<Appointment>(`/guest/appointments/${token}`),
  uploadReceipt: (token: string, file: File) =>
    httpClient.post<Appointment>(`/guest/appointments/${token}/receipt`, receiptForm(file)),
  cancel: (token: string, reason?: string) =>
    httpClient.post<Appointment>(`/guest/appointments/${token}/cancel`, reason ? { reason } : {}),
};
