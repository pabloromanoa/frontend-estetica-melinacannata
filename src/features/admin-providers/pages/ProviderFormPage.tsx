import { useNavigate, useParams } from 'react-router';
import { UserRound } from 'lucide-react';
import { getErrorMessage } from '@/shared/api';
import { Alert, Card, ErrorState, LoadingBlock, PageHeader } from '@/shared/ui';
import { ProviderForm } from '../components/ProviderForm';
import { useAdminProvider, useCreateProvider, useUpdateProvider } from '../hooks/useProviders';

export function ProviderFormPage() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const existing = useAdminProvider(providerId);
  const create = useCreateProvider();
  const update = useUpdateProvider(providerId ?? '');
  const mutation = providerId ? update : create;

  if (providerId && existing.isLoading) return <LoadingBlock />;
  if (providerId && !existing.data)
    return <ErrorState error={existing.error} title="No encontramos el prestador" />;

  return (
    <>
      <PageHeader
        title={providerId ? 'Editar prestador' : 'Nuevo prestador'}
        icon={<UserRound className="size-7" />}
      />
      <Card className="max-w-3xl">
        {mutation.isError && (
          <Alert tone="danger" className="mb-4">
            {getErrorMessage(mutation.error)}
          </Alert>
        )}
        {update.isSuccess && (
          <Alert tone="success" className="mb-4">
            Cambios guardados.
          </Alert>
        )}
        <ProviderForm
          provider={existing.data}
          isSubmitting={mutation.isPending}
          onCreate={(input) =>
            create.mutate(input, {
              onSuccess: (created) => void navigate(`/panel/disponibilidad?providerId=${created.id}`),
            })
          }
          onUpdate={(input) => update.mutate(input)}
        />
      </Card>
    </>
  );
}
