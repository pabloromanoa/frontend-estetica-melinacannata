import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { guestAppointmentsApi, liveRefetch } from '@/features/appointment-tracking';
import type { Appointment } from '@/domain';
import { queryKeys } from '@/shared/api';

export function useGuestAppointment(token: string | undefined) {
  return useQuery({
    queryKey: queryKeys.appointments.guest(token ?? ''),
    queryFn: () => guestAppointmentsApi.detail(token ?? ''),
    enabled: Boolean(token),
    refetchInterval: (query) => liveRefetch(query.state.data),
  });
}

function useGuestMutation<TVariables>(
  token: string,
  mutationFn: (variables: TVariables) => Promise<Appointment>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (appointment) => {
      queryClient.setQueryData(queryKeys.appointments.guest(token), appointment);
      void queryClient.invalidateQueries({ queryKey: queryKeys.availability.all });
    },
  });
}

export function useGuestUploadReceipt(token: string) {
  return useGuestMutation(token, (file: File) => guestAppointmentsApi.uploadReceipt(token, file));
}

export function useGuestCancel(token: string) {
  return useGuestMutation(token, (reason?: string) => guestAppointmentsApi.cancel(token, reason));
}
