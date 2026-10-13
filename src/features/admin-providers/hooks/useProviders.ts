import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UpdateProviderInput } from '@/domain';
import { queryKeys } from '@/shared/api';
import { providersApi } from '../api/providers-api';

export function useAdminProviders(enabled = true) {
  return useQuery({ queryKey: queryKeys.admin.providers, queryFn: providersApi.list, enabled });
}

/** El contrato no expone GET /admin/providers/:id: se obtiene del listado. */
export function useAdminProvider(id: string | undefined) {
  const query = useAdminProviders(Boolean(id));
  return { ...query, data: query.data?.find((provider) => provider.id === id) };
}

export function useCreateProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: providersApi.create,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.admin.providers }),
  });
}

export function useUpdateProvider(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProviderInput) => providersApi.update(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.providers });
      void queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all });
    },
  });
}
