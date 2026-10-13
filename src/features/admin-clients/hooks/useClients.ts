import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api';
import { useDebouncedValue } from '@/shared/hooks';
import { clientsApi } from '../api/clients-api';

const MIN_SEARCH_LENGTH = 2;

/** GET /admin/clients?search= (sólo ADMIN). Con búsqueda vacía lista los clientes recientes que devuelva el backend. */
export function useClientSearch(term: string, options: { enabled?: boolean; requireTerm?: boolean } = {}) {
  const search = useDebouncedValue(term.trim());
  const hasTerm = search.length >= MIN_SEARCH_LENGTH;
  return useQuery({
    queryKey: queryKeys.admin.clients(search),
    queryFn: () => clientsApi.search(search),
    enabled: (options.enabled ?? true) && (!options.requireTerm || hasTerm),
  });
}

export function useClientDetail(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.admin.client(id ?? ''),
    queryFn: () => clientsApi.detail(id ?? ''),
    enabled: Boolean(id),
  });
}
