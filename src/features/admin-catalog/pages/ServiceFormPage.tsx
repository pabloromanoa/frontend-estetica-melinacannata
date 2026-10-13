import { useNavigate, useParams } from 'react-router';
import { Sparkles } from 'lucide-react';
import { useAdminProviders } from '@/features/admin-providers';
import { getErrorMessage } from '@/shared/api';
import { Alert, Card, ErrorState, LoadingBlock, PageHeader } from '@/shared/ui';
import { ServiceForm } from '../components/ServiceForm';
import { useAdminCategories, useAdminService, useSaveService } from '../hooks/useAdminCatalog';

export function ServiceFormPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = useAdminService(serviceId);
  const categories = useAdminCategories();
  const providers = useAdminProviders();
  const save = useSaveService(serviceId);

  if ((serviceId && service.isLoading) || categories.isLoading || providers.isLoading)
    return <LoadingBlock />;
  if (serviceId && service.isError)
    return <ErrorState error={service.error} onRetry={() => void service.refetch()} />;

  return (
    <>
      <PageHeader
        title={serviceId ? 'Editar servicio' : 'Nuevo servicio'}
        icon={<Sparkles className="size-7" />}
      />
      <Card className="max-w-4xl">
        {save.isError && (
          <Alert tone="danger" className="mb-4">
            {getErrorMessage(save.error)}
          </Alert>
        )}
        {save.isSuccess && serviceId && (
          <Alert tone="success" className="mb-4">
            Servicio actualizado.
          </Alert>
        )}
        <ServiceForm
          service={service.data}
          categories={categories.data ?? []}
          providers={providers.data ?? []}
          isSubmitting={save.isPending}
          onSubmit={(input) =>
            save.mutate(input, {
              onSuccess: (saved) => !serviceId && void navigate(`/panel/servicios/${saved.id}`),
            })
          }
        />
      </Card>
    </>
  );
}
