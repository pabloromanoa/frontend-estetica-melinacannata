import { Link } from 'react-router';
import { Layers, Plus } from 'lucide-react';
import { Badge, ButtonLink, Card, EmptyState, ErrorState, LoadingBlock, PageHeader } from '@/shared/ui';
import { useAdminTreatments } from '../hooks/useAdminCatalog';

export function TreatmentsAdminPage() {
  const { data, isLoading, isError, error, refetch } = useAdminTreatments();
  return (
    <>
      <PageHeader
        title="Tratamientos"
        icon={<Layers className="size-7" />}
        description="Secuencias ordenadas de servicios (cada uno se reserva con su turno y seña)."
        actions={
          <ButtonLink to="/panel/tratamientos/nuevo" leftIcon={<Plus className="size-4" aria-hidden />}>
            Nuevo tratamiento
          </ButtonLink>
        }
      />
      {isLoading && <LoadingBlock />}
      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}
      {data?.length === 0 && <EmptyState title="Todavía no hay tratamientos" />}
      <div className="grid gap-4 md:grid-cols-2">
        {data?.map((treatment) => (
          <Card key={treatment.id}>
            <div className="flex items-center justify-between gap-2">
              <Link
                to={`/panel/tratamientos/${treatment.id}`}
                className="text-lg font-semibold text-ink hover:text-primary"
              >
                {treatment.name}
              </Link>
              {treatment.isActive ? <Badge tone="success">Activo</Badge> : <Badge>Inactivo</Badge>}
            </div>
            <ol className="mt-3 list-inside list-decimal text-sm text-ink-soft">
              {treatment.services.map((service) => (
                <li key={service.id}>{service.name}</li>
              ))}
            </ol>
          </Card>
        ))}
      </div>
    </>
  );
}
