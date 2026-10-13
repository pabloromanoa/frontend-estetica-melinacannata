import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api';
import { catalogApi, type ServiceFilters } from '../api/catalog-api';

export function useCategories() {
  return useQuery({ queryKey: queryKeys.catalog.categories, queryFn: catalogApi.categories });
}

export function useServices(filters: ServiceFilters = {}) {
  return useQuery({
    queryKey: queryKeys.catalog.services(filters),
    queryFn: () => catalogApi.services(filters),
  });
}

export function useService(id: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.catalog.service(id ?? ''),
    queryFn: () => catalogApi.service(id ?? ''),
    enabled: Boolean(id),
  });
}

export function useTreatment(id: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.catalog.treatment(id ?? ''),
    queryFn: () => catalogApi.treatment(id ?? ''),
    enabled: Boolean(id),
  });
}
