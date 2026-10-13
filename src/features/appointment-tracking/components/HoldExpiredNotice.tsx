import { HOLD_MINUTES } from '@/config/constants';
import { Alert, ButtonLink } from '@/shared/ui';

export function HoldExpiredNotice({ restartHref }: { restartHref?: string }) {
  return (
    <Alert tone="danger" title="Se venció el tiempo de reserva">
      <p>
        Pasaron los {HOLD_MINUTES} minutos sin recibir el comprobante y el horario se liberó. Podés volver a
        reservar: si el horario sigue libre, lo vas a encontrar de nuevo.
      </p>
      {restartHref && (
        <ButtonLink to={restartHref} size="sm" className="mt-3">
          Volver a empezar
        </ButtonLink>
      )}
    </Alert>
  );
}
