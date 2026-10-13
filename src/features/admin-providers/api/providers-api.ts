import type { CreateProviderInput, Provider, UpdateProviderInput } from '@/domain';
import { httpClient } from '@/shared/api';

export const providersApi = {
  list: () => httpClient.get<Provider[]>('/admin/providers'),
  create: (input: CreateProviderInput) => httpClient.post<Provider>('/admin/providers', input),
  update: (id: string, input: UpdateProviderInput) =>
    httpClient.put<Provider>(`/admin/providers/${id}`, input),
};
