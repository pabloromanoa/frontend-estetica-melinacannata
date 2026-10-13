import { Link, useNavigate } from 'react-router';
import { getErrorMessage } from '@/shared/api';
import { Alert, ButtonLink } from '@/shared/ui';
import { AuthCard } from '../components/AuthCard';
import { RegisterForm } from '../components/RegisterForm';
import { useRegister } from '../hooks/useAuthMutations';

export const LINKED_APPOINTMENTS_MESSAGE =
  'Se encontraron reservas anteriores asociadas a este DNI. Serán incorporadas a tu historial.';

export function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const linked = registerMutation.data?.linkedAppointments ?? 0;

  if (registerMutation.isSuccess) {
    return (
      <AuthCard
        title="¡Tu cuenta está lista!"
        subtitle={`Bienvenida/o, ${registerMutation.data.user.firstName}.`}
      >
        <div className="space-y-4">
          {linked > 0 && <Alert tone="success">{LINKED_APPOINTMENTS_MESSAGE}</Alert>}
          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/mi-cuenta">Ver mis turnos</ButtonLink>
            <ButtonLink to="/reservar" variant="secondary">
              Reservar un turno
            </ButtonLink>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Crear cuenta"
      subtitle="Registrate para ver tu historial, repetir turnos y guardar tus recomendaciones."
      footer={
        <>
          ¿Ya tenés cuenta?{' '}
          <Link to="/ingresar" className="font-semibold text-primary hover:underline">
            Ingresá
          </Link>
        </>
      }
    >
      <RegisterForm
        isSubmitting={registerMutation.isPending}
        errorMessage={registerMutation.isError ? getErrorMessage(registerMutation.error) : null}
        onSubmit={(values) =>
          registerMutation.mutate(values, {
            onSuccess: (result) => result.linkedAppointments === 0 && void navigate('/mi-cuenta'),
          })
        }
      />
    </AuthCard>
  );
}
