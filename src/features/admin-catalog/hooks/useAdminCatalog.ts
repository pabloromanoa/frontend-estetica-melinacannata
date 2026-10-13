import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CategoryInput, ServiceInput, TreatmentInput } from '@/domain';
import { queryKeys } from '@/shared/api';
import { adminCatalogApi } from '../api/admin-catalog-api';

function useInvalidateCatalog() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: ['admin'] });
    void queryClient.invalidateQueries({ queryKey: queryKeys.catalog.all });
  };
}

export function useAdminServices() {
  return useQuery({ queryKey: queryKeys.admin.services, queryFn: adminCatalogApi.services });
}

export function useAdminService(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.admin.service(id ?? ''),
    queryFn: () => adminCatalogApi.service(id ?? ''),
    enabled: Boolean(id),
  });
}

export function useSaveService(id: string | undefined) {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: (input: ServiceInput) =>
      id ? adminCatalogApi.updateService(id, input) : adminCatalogApi.createService(input),
    onSuccess: invalidate,
  });
}

export function useAdminCategories() {
  return useQuery({ queryKey: queryKeys.admin.categories, queryFn: adminCatalogApi.categories });
}

export function useCreateCategory() {
  const invalidate = useInvalidateCatalog();
  return useMutation({ mutationFn: adminCatalogApi.createCategory, onSuccess: invalidate });
}

export function useUpdateCategory() {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CategoryInput }) =>
      adminCatalogApi.updateCategory(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidateCatalog();
  return useMutation({ mutationFn: adminCatalogApi.deleteCategory, onSuccess: invalidate });
}

export function useAdminTreatments() {
  return useQuery({ queryKey: queryKeys.admin.treatments, queryFn: adminCatalogApi.treatments });
}

/** El contrato no expone GET /admin/treatments/:id: se toma del listado. */
export function useAdminTreatment(id: string | undefined) {
  const query = useAdminTreatments();
  return { ...query, data: id ? query.data?.find((treatment) => treatment.id === id) : undefined };
}

export function useSaveTreatment(id: string | undefined) {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: (input: TreatmentInput) =>
      id ? adminCatalogApi.updateTreatment(id, input) : adminCatalogApi.createTreatment(input),
    onSuccess: invalidate,
  });
}
