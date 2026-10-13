import { Link } from 'react-router';
import { Plus, Sparkles } from 'lucide-react';
import { formatARS } from '@/domain';
import { Badge, ButtonLink, Card, EmptyState, ErrorState, LoadingBlock, PageHeader } from '@/shared/ui';
import { useAdminServices } from '../hooks/useAdminCatalog';

export function ServicesAdminPage() {
  const { data, isLoading, isError, error, refetch } = useAdminServices();
  return (
    <>
      <PageHeader
        title="Servicios"
        icon={<Sparkles className="size-7" />}
        description="Catálogo completo, incluidos los inactivos."
        actions={
          <ButtonLink to="/panel/servicios/nuevo" leftIcon={<Plus className="size-4" aria-hidden />}>
            Nuevo servicio
          </ButtonLink>
        }
      />
      <Card>
        {isLoading && <LoadingBlock />}
        {isError && <ErrorState error={error} onRetry={() => void refetch()} />}
        {data?.length === 0 && <EmptyState title="Todavía no hay servicios" />}
        {data && data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs tracking-wide text-ink-soft uppercase">
                <tr>
                  <th scope="col" className="py-2 pr-4">
                    Servicio
                  </th>
                  <th scope="col" className="py-2 pr-4">
                    Categorías
                  </th>
                  <th scope="col" className="py-2 pr-4">
                    Duración
                  </th>
                  <th scope="col" className="py-2 pr-4">
                    Precio / Seña
                  </th>
                  <th scope="col" className="py-2 pr-4">
                    Profesionales
                  </th>
                  <th scope="col" className="py-2">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((service) => (
                  <tr key={service.id}>
                    <td className="py-3 pr-4">
                      <Link
                        to={`/panel/servicios/${service.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {service.name}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">{service.categories.map((c) => c.name).join(', ') || '—'}</td>
                    <td className="py-3 pr-4">
                      {service.durationMinutes} min{' '}
                      <span className="text-ink-soft">
                        (+{service.prepMinutes}/{service.cleanupMinutes})
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      {formatARS(service.price)} / {formatARS(service.depositAmount)}
                    </td>
                    <td className="py-3 pr-4">{service.providers.length}</td>
                    <td className="py-3">
                      {service.isActive ? <Badge tone="success">Activo</Badge> : <Badge>Inactivo</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
