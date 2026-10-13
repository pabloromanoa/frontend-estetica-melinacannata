import { useNavigate, useParams } from 'react-router';
import { Layers } from 'lucide-react';
import { getErrorMessage } from '@/shared/api';
import { Alert, Card, EmptyState, LoadingBlock, PageHeader } from '@/shared/ui';
import { TreatmentForm } from '../components/TreatmentForm';
import { useAdminServices, useAdminTreatment, useSaveTreatment } from '../hooks/useAdminCatalog';

export function TreatmentFormPage() {
  const { treatmentId } = useParams();
  const navigate = useNavigate();
  const treatment = useAdminTreatment(treatmentId);
  const services = useAdminServices();
  const save = useSaveTreatment(treatmentId);

  if (treatment.isLoading || services.isLoading) return <LoadingBlock />;
  if (treatmentId && !treatment.data) return <EmptyState title="No encontramos el tratamiento" />;

  return (
    <>
      <PageHeader
        title={treatmentId ? 'Editar tratamiento' : 'Nuevo tratamiento'}
        icon={<Layers className="size-7" />}
      />
      <Card className="max-w-3xl">
        {save.isError && (
          <Alert tone="danger" className="mb-4">
            {getErrorMessage(save.error)}
          </Alert>
        )}
        {save.isSuccess && treatmentId && (
          <Alert tone="success" className="mb-4">
            Tratamiento actualizado.
          </Alert>
        )}
        <TreatmentForm
          treatment={treatment.data}
          services={services.data ?? []}
          isSubmitting={save.isPending}
          onSubmit={(input) =>
            save.mutate(input, {
              onSuccess: (saved) => !treatmentId && void navigate(`/panel/tratamientos/${saved.id}`),
            })
          }
        />
      </Card>
    </>
  );
}
