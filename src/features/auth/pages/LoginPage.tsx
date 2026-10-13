import { Link, useLocation, useNavigate } from 'react-router';
import { homePathFor } from '@/domain';
import { getErrorMessage } from '@/shared/api';
import { AuthCard } from '../components/AuthCard';
import { LoginForm } from '../components/LoginForm';
import { useLogin } from '../hooks/useAuthMutations';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();
  const from = (location.state as { from?: string } | null)?.from;

  return (
    <AuthCard
      title="Ingresar"
      subtitle="Accedé a tus turnos o al panel de gestión."
      footer={
        <>
          ¿No tenés cuenta?{' '}
          <Link to="/registro" className="font-semibold text-primary hover:underline">
            Registrate
          </Link>
        </>
      }
    >
      <LoginForm
        isSubmitting={login.isPending}
        errorMessage={login.isError ? getErrorMessage(login.error) : null}
        onSubmit={(values) =>
          login.mutate(values, {
            onSuccess: (user) => void navigate(from ?? homePathFor(user), { replace: true }),
          })
        }
      />
    </AuthCard>
  );
}
