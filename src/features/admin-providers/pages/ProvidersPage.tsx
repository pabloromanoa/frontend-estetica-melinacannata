import { Link } from 'react-router';
import { Plus, UserRound } from 'lucide-react';
import {
  Avatar,
  Badge,
  ButtonLink,
  Card,
  EmptyState,
  ErrorState,
  LoadingBlock,
  PageHeader,
} from '@/shared/ui';
import { useAdminProviders } from '../hooks/useProviders';

export function ProvidersPage() {
  const { data, isLoading, isError, error, refetch } = useAdminProviders();
  return (
    <>
      <PageHeader
        title="Prestadores"
        icon={<UserRound className="size-7" />}
        description="Alta y edición de profesionales. Los permisos de administración no se asignan desde aquí."
        actions={
          <ButtonLink to="/panel/prestadores/nuevo" leftIcon={<Plus className="size-4" aria-hidden />}>
            Nuevo prestador
          </ButtonLink>
        }
      />
      {isLoading && <LoadingBlock />}
      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}
      {data?.length === 0 && <EmptyState title="Todavía no hay prestadores" />}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data?.map((provider) => (
          <Card key={provider.id} className="flex items-start gap-4">
            <Avatar name={provider.displayName} src={provider.avatarUrl} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/panel/prestadores/${provider.id}`}
                  className="text-lg font-semibold text-ink hover:text-primary"
                >
                  {provider.displayName}
                </Link>
                {provider.isActive ? <Badge tone="success">Activa</Badge> : <Badge>Inactiva</Badge>}
              </div>
              <p className="text-sm text-primary">{provider.specialty ?? 'Sin especialidad'}</p>
              <p className="truncate text-sm text-ink-soft">{provider.email}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ButtonLink to={`/panel/prestadores/${provider.id}`} size="sm" variant="secondary">
                  Editar
                </ButtonLink>
                <ButtonLink to={`/panel/disponibilidad?providerId=${provider.id}`} size="sm" variant="soft">
                  Disponibilidad y seña
                </ButtonLink>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
