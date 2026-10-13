import type { ClientDetail, ClientSummary } from '@/domain';
import { httpClient } from '@/shared/api';

export const clientsApi = {
  search: (search: string) => httpClient.get<ClientSummary[]>('/admin/clients', { query: { search } }),
  detail: (id: string) => httpClient.get<ClientDetail>(`/admin/clients/${id}`),
};
