import { useParams, useSearchParams } from 'react-router';
import { Route } from 'lucide-react';
import { formatARS, treatmentTotals } from '@/domain';
import { Alert, ButtonLink, Card, ErrorState, LoadingBlock } from '@/shared/ui';
import { TreatmentServicesList } from '../components/TreatmentServicesList';
import { useTreatment } from '../hooks/useCatalog';

export function TreatmentDetailPage() {
  const { treatmentId } = useParams();
  const [params] = useSearchParams();
  const recommendationId = params.get('recommendationId');
  const { data: treatment, isLoading, isError, error, refetch } = useTreatment(treatmentId);

  if (isLoading) return <LoadingBlock />;
  if (isError || !treatment) return <ErrorState error={error} onRetry={() => void refetch()} />;

  const totals = treatmentTotals(treatment);
  const query = new URLSearchParams({ treatmentId: treatment.id, step: '0' });
  if (recommendationId) query.set('recommendationId', recommendationId);

  return (
    <Card className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold text-ink">{treatment.name}</h1>
      {treatment.description && <p className="mt-2 text-ink-soft">{treatment.description}</p>}
      <h2 className="mt-6 mb-3 font-semibold text-ink">Servicios del tratamiento (en orden)</h2>
      <TreatmentServicesList services={treatment.services} />
      <Alert tone="neutral" className="mt-6">
        Cada servicio se reserva por separado, con su propio turno y su seña. Total estimado{' '}
        {formatARS(totals.price)} (señas {formatARS(totals.deposit)}).
      </Alert>
      <ButtonLink
        to={`/reservar?${query.toString()}`}
        size="lg"
        className="mt-6"
        leftIcon={<Route className="size-5" aria-hidden />}
      >
        Quiero seguir este tratamiento
      </ButtonLink>
    </Card>
  );
}
