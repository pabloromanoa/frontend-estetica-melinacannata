import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DEPOSITS_REFETCH_INTERVAL_MS } from '@/config/constants';
import type { Appointment, DepositStatus } from '@/domain';
import { queryKeys } from '@/shared/api';
import { depositsApi } from '../api/deposits-api';

export function useDepositsInbox(status: DepositStatus = 'PENDING', enabled = true) {
  return useQuery({
    queryKey: queryKeys.deposits.inbox(status),
    queryFn: () => depositsApi.inbox(status),
    refetchInterval: status === 'PENDING' ? DEPOSITS_REFETCH_INTERVAL_MS : false,
    enabled,
  });
}

/** Cantidad de señas pendientes para el badge del menú y la campanita. */
export function usePendingDepositsCount(enabled = true): number {
  const { data } = useDepositsInbox('PENDING', enabled);
  return data?.meta.total ?? data?.data.length ?? 0;
}

export function useReceiptBlob(depositId: string | null | undefined, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.deposits.receipt(depositId ?? ''),
    queryFn: () => depositsApi.receipt(depositId ?? ''),
    enabled: enabled && Boolean(depositId),
    staleTime: Infinity,
  });
}

function useDepositMutation<TVariables>(mutationFn: (variables: TVariables) => Promise<Appointment>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (appointment) => {
      queryClient.setQueryData(queryKeys.appointments.detail(appointment.id), appointment);
      void queryClient.invalidateQueries({ queryKey: queryKeys.deposits.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.agenda.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
    },
  });
}

/** Aprobar: seña VERIFIED, turno DEPOSIT_PAID. */
export function useVerifyDeposit() {
  return useDepositMutation((depositId: string) => depositsApi.verify(depositId));
}

/** Rechazar (motivo obligatorio): seña REJECTED, turno EXPIRED. */
export function useRejectDeposit() {
  return useDepositMutation(({ depositId, reason }: { depositId: string; reason: string }) =>
    depositsApi.reject(depositId, reason),
  );
}
