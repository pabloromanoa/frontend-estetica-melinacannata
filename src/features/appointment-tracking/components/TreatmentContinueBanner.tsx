import { Route } from 'lucide-react';
import { Alert, ButtonLink } from '@/shared/ui';

/** Después de reservar un servicio de un tratamiento, invita a reservar el siguiente. */
export function TreatmentContinueBanner({ nextQuery }: { nextQuery: string }) {
  return (
    <Alert tone="primary" title="Seguís con tu tratamiento">
      <p>Cuando termines con esta seña, reservá el siguiente servicio del tratamiento.</p>
      <ButtonLink
        to={`/reservar?${nextQuery}`}
        size="sm"
        className="mt-3"
        leftIcon={<Route className="size-4" aria-hidden />}
      >
        Reservar el siguiente servicio
      </ButtonLink>
    </Alert>
  );
}
