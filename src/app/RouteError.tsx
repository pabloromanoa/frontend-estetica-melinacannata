import { isRouteErrorResponse, useRouteError } from 'react-router';
import { ButtonLink, EmptyState, ErrorState } from '@/shared/ui';

export function RouteError() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />;
  return (
    <div className="p-8">
      <ErrorState
        error={error}
        title="Algo salió mal al mostrar esta pantalla"
        onRetry={() => window.location.reload()}
      />
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="p-8">
      <EmptyState
        title="No encontramos esta página"
        description="Revisá la dirección o volvé al inicio."
        action={<ButtonLink to="/">Ir al inicio</ButtonLink>}
      />
    </div>
  );
}
