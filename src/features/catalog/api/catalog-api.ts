import type { Category, Service, Treatment } from '@/domain';
import { httpClient } from '@/shared/api';

export interface ServiceFilters {
  categoryId?: string;
  search?: string;
}

export const catalogApi = {
  categories: () => httpClient.get<Category[]>('/catalog/categories'),
  services: (filters: ServiceFilters = {}) =>
    httpClient.get<Service[]>('/catalog/services', { query: { ...filters } }),
  service: (id: string) => httpClient.get<Service>(`/catalog/services/${id}`),
  treatment: (id: string) => httpClient.get<Treatment>(`/catalog/treatments/${id}`),
};
