import type { Category, CategoryInput, Service, ServiceInput, Treatment, TreatmentInput } from '@/domain';
import { httpClient } from '@/shared/api';

export const adminCatalogApi = {
  services: () => httpClient.get<Service[]>('/admin/services'),
  service: (id: string) => httpClient.get<Service>(`/admin/services/${id}`),
  createService: (input: ServiceInput) => httpClient.post<Service>('/admin/services', input),
  updateService: (id: string, input: ServiceInput) => httpClient.put<Service>(`/admin/services/${id}`, input),

  categories: () => httpClient.get<Category[]>('/admin/categories'),
  createCategory: (input: CategoryInput) => httpClient.post<Category>('/admin/categories', input),
  updateCategory: (id: string, input: CategoryInput) =>
    httpClient.put<Category>(`/admin/categories/${id}`, input),
  /** Elimina la categoría y SÓLO sus asociaciones: los servicios quedan intactos. */
  deleteCategory: (id: string) => httpClient.delete(`/admin/categories/${id}`),

  treatments: () => httpClient.get<Treatment[]>('/admin/treatments'),
  createTreatment: (input: TreatmentInput) => httpClient.post<Treatment>('/admin/treatments', input),
  updateTreatment: (id: string, input: TreatmentInput) =>
    httpClient.put<Treatment>(`/admin/treatments/${id}`, input),
};
