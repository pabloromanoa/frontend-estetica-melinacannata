import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { BankDetails, NewAvailabilityException, Provider, WeeklyAvailabilityRange } from '@/domain';
import { useAdminProvider } from '@/features/admin-providers';
import { queryKeys } from '@/shared/api';
import { scopeKey, staffAvailabilityApi, type ProviderScope } from '../api/availability-admin-api';

/** Perfil del prestador: GET /staff/me (self) o el listado de ADMIN. */
export function useProviderProfile(scope: ProviderScope) {
  const self = useQuery({
    queryKey: queryKeys.staff.profile('me'),
    queryFn: staffAvailabilityApi.me,
    enabled: scope.kind === 'self',
  });
  const admin = useAdminProvider(scope.kind === 'admin' ? scope.providerId : undefined);
  return scope.kind === 'self' ? self : admin;
}

export function useWeeklyAvailability(scope: ProviderScope, enabled = true) {
  return useQuery({
    queryKey: queryKeys.staff.weekly(scopeKey(scope)),
    queryFn: () => staffAvailabilityApi.weekly(scope),
    enabled,
  });
}

export function useExceptions(scope: ProviderScope, range: { from?: string; to?: string }) {
  return useQuery({
    queryKey: queryKeys.staff.exceptions(scopeKey(scope), range),
    queryFn: () => staffAvailabilityApi.exceptions(scope, range),
  });
}

function useInvalidateAvailability(scope: ProviderScope) {
  const queryClient = useQueryClient();
  return (provider?: Provider) => {
    if (provider && scope.kind === 'self') queryClient.setQueryData(queryKeys.staff.profile('me'), provider);
    void queryClient.invalidateQueries({ queryKey: queryKeys.admin.providers });
    void queryClient.invalidateQueries({ queryKey: queryKeys.availability.all });
    void queryClient.invalidateQueries({ queryKey: queryKeys.agenda.all });
    void queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all });
  };
}

export function useSaveWeeklyAvailability(scope: ProviderScope) {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateAvailability(scope);
  return useMutation({
    mutationFn: (ranges: WeeklyAvailabilityRange[]) => staffAvailabilityApi.saveWeekly(scope, ranges),
    onSuccess: (ranges) => {
      queryClient.setQueryData(queryKeys.staff.weekly(scopeKey(scope)), ranges);
      invalidate();
    },
  });
}

export function useUpdateBankDetails(scope: ProviderScope) {
  const invalidate = useInvalidateAvailability(scope);
  return useMutation({
    mutationFn: (bank: BankDetails) => staffAvailabilityApi.updateBankDetails(scope, bank),
    onSuccess: invalidate,
  });
}

export function useUpdateProviderServices(scope: ProviderScope) {
  const invalidate = useInvalidateAvailability(scope);
  return useMutation({
    mutationFn: (ids: string[]) => staffAvailabilityApi.updateServices(scope, ids),
    onSuccess: invalidate,
  });
}

export function useCreateException(scope: ProviderScope) {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateAvailability(scope);
  return useMutation({
    mutationFn: (input: NewAvailabilityException) => staffAvailabilityApi.createException(scope, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['staff', scopeKey(scope), 'exceptions'] });
      invalidate();
    },
  });
}

export function useDeleteException(scope: ProviderScope) {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateAvailability(scope);
  return useMutation({
    mutationFn: (id: string) => staffAvailabilityApi.deleteException(scope, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['staff', scopeKey(scope), 'exceptions'] });
      invalidate();
    },
  });
}
