import { QueryClient } from '@tanstack/react-query';
import { DEFAULT_STALE_TIME_MS } from '@/config/constants';
import { isApiError } from '@/shared/api';

const MAX_RETRIES = 2;

/** No reintenta errores 4xx (son definitivos: validación, permisos, no encontrado). */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_STALE_TIME_MS,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) =>
          !(isApiError(error) && error.isClientError) && failureCount < MAX_RETRIES,
      },
      mutations: { retry: false },
    },
  });
}
