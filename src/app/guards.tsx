import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { hasAnyRole, type Role } from '@/domain';
import { useAuth } from '@/features/auth';
import { EmptyState, LoadingBlock, ButtonLink } from '@/shared/ui';

/** Requiere sesión iniciada; si no, redirige a /ingresar recordando el destino. */
export function RequireAuth({ children }: { children?: ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <LoadingBlock label="Verificando sesión…" />;
  if (!user)
    return <Navigate to="/ingresar" replace state={{ from: `${location.pathname}${location.search}` }} />;
  return children ?? <Outlet />;
}

/** Requiere al menos uno de los roles indicados. */
export function RequireRole({ roles, children }: { roles: readonly Role[]; children?: ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <LoadingBlock label="Verificando sesión…" />;
  if (!user)
    return <Navigate to="/ingresar" replace state={{ from: `${location.pathname}${location.search}` }} />;
  if (!hasAnyRole(user, roles)) {
    return (
      <div className="p-8">
        <EmptyState
          title="No tenés permisos para ver esta sección"
          description="Si creés que es un error, consultá con la administración."
          action={<ButtonLink to="/">Volver al inicio</ButtonLink>}
        />
      </div>
    );
  }
  return children ?? <Outlet />;
}
