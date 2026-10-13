import { Outlet, useNavigate } from 'react-router';
import { useAuth, useLogout } from '@/features/auth';
import { PublicLayout } from '@/shared/layouts';
import { Button } from '@/shared/ui';

export function PublicShell() {
  const navigate = useNavigate();
  const { user, isStaff, isClient } = useAuth();
  const logout = useLogout();
  const account = isStaff
    ? { to: '/panel/agenda', label: 'Panel' }
    : isClient
      ? { to: '/mi-cuenta', label: 'Mi cuenta' }
      : { to: '/ingresar', label: 'Ingresar' };

  return (
    <PublicLayout
      account={account}
      extraAction={
        user ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout.mutate(undefined, { onSettled: () => void navigate('/') })}
          >
            Salir
          </Button>
        ) : undefined
      }
    >
      <Outlet />
    </PublicLayout>
  );
}
