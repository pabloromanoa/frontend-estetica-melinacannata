import { useState, type FormEvent } from 'react';
import { Tags } from 'lucide-react';
import type { Category } from '@/domain';
import { getErrorMessage } from '@/shared/api';
import {
  Alert,
  Button,
  Card,
  ConfirmModal,
  EmptyState,
  ErrorState,
  FormField,
  Input,
  LoadingBlock,
  PageHeader,
} from '@/shared/ui';
import { CategoryRow } from '../components/CategoryRow';
import {
  useAdminCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '../hooks/useAdminCatalog';

export function CategoriesPage() {
  const categories = useAdminCategories();
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const remove = useDeleteCategory();
  const [name, setName] = useState('');
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const mutationError = create.error ?? update.error;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (name.trim()) create.mutate({ name: name.trim(), isActive: true }, { onSuccess: () => setName('') });
  };

  return (
    <>
      <PageHeader
        title="Categorías"
        icon={<Tags className="size-7" />}
        description="Agrupan los servicios del catálogo (un servicio puede tener varias)."
      />
      <Card className="max-w-3xl">
        <form onSubmit={submit} className="mb-4 flex items-end gap-3">
          <FormField label="Nueva categoría" htmlFor="category-name" className="flex-1">
            <Input
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej.: Faciales"
            />
          </FormField>
          <Button type="submit" loading={create.isPending} disabled={!name.trim()}>
            Agregar
          </Button>
        </form>
        {mutationError && (
          <Alert tone="danger" className="mb-4">
            {getErrorMessage(mutationError)}
          </Alert>
        )}
        {categories.isLoading && <LoadingBlock />}
        {categories.isError && (
          <ErrorState error={categories.error} onRetry={() => void categories.refetch()} />
        )}
        {categories.data?.length === 0 && <EmptyState title="Todavía no hay categorías" />}
        <ul className="divide-y divide-border">
          {categories.data?.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              disabled={update.isPending}
              onUpdate={(input) => update.mutate({ id: category.id, input })}
              onDelete={() => setToDelete(category)}
            />
          ))}
        </ul>
      </Card>
      <ConfirmModal
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title={`Eliminar "${toDelete?.name ?? ''}"`}
        confirmLabel="Eliminar categoría"
        confirmVariant="destructive"
        loading={remove.isPending}
        onConfirm={() => toDelete && remove.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })}
      >
        <p>Se eliminará la categoría y sus asociaciones.</p>
        <Alert tone="neutral" title="Los servicios no se borran">
          Los servicios que la tenían quedan intactos; sólo dejan de pertenecer a esta categoría.
        </Alert>
        {remove.isError && <Alert tone="danger">{getErrorMessage(remove.error)}</Alert>}
      </ConfirmModal>
    </>
  );
}
