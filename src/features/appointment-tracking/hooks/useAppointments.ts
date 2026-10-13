import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { DEPOSITS_REFETCH_INTERVAL_MS } from '@/config/constants';
import type { Appointment, RescheduleInput } from '@/domain';
import { queryKeys } from '@/shared/api';
import { appointmentsApi, type AppointmentListParams } from '../api/appointments-api';

/** Mientras se valida la seña, el estado "en vivo" se refresca periódicamente. */
export const liveRefetch = (appointment: Appointment | undefined): number | false =>
  appointment?.status === 'PAYMENT_INFORMED' ? DEPOSITS_REFETCH_INTERVAL_MS : false;

export function useAppointment(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.appointments.detail(id ?? ''),
    queryFn: () => appointmentsApi.detail(id ?? ''),
    enabled: Boolean(id),
    refetchInterval: (query) => liveRefetch(query.state.data),
  });
}

export function useAppointmentsList(params: AppointmentListParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.appointments.list(params),
    queryFn: () => appointmentsApi.list(params),
    enabled,
  });
}

/** Tras cualquier cambio de un turno se refrescan las vistas que lo muestran. */
export function syncAppointment(queryClient: QueryClient, appointment: Appointment): void {
  queryClient.setQueryData(queryKeys.appointments.detail(appointment.id), appointment);
  void queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
  void queryClient.invalidateQueries({ queryKey: queryKeys.agenda.all });
  void queryClient.invalidateQueries({ queryKey: queryKeys.deposits.all });
  void queryClient.invalidateQueries({ queryKey: queryKeys.availability.all });
}

export function useUploadReceipt(appointmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => appointmentsApi.uploadReceipt(appointmentId, file),
    onSuccess: (appointment) => syncAppointment(queryClient, appointment),
  });
}

export function useCancelAppointment(appointmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reason?: string) => appointmentsApi.cancel(appointmentId, reason),
    onSuccess: (appointment) => syncAppointment(queryClient, appointment),
  });
}

export function useRescheduleAppointment(appointmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RescheduleInput) => appointmentsApi.reschedule(appointmentId, input),
    onSuccess: (appointment) => syncAppointment(queryClient, appointment),
  });
}

export function useFinishAppointment(appointmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => appointmentsApi.finish(appointmentId),
    onSuccess: (appointment) => syncAppointment(queryClient, appointment),
  });
}
