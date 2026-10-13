import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api';
import { bookingApi } from '../api/booking-api';

/** POST /appointments → estado CREATED con bloqueo de 5 minutos. */
export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingApi.create,
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.availability.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.agenda.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
    },
  });
}
