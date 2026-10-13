import type { Appointment, Recommendation } from './types';

/** Query del wizard pre-cargada con el mismo servicio y prestador ("Repetir turno" / "Volver a empezar"). */
export function repeatBookingHref(appointment: {
  service: Pick<Appointment['service'], 'id'>;
  provider: Pick<Appointment['provider'], 'id'>;
}): string {
  return `/reservar?${new URLSearchParams({ serviceId: appointment.service.id, providerId: appointment.provider.id }).toString()}`;
}

/** Destino de la reserva al aceptar una recomendación: servicio directo o tratamiento paso a paso (desde el paso 0). */
export function recommendationBookingHref(
  recommendation: Pick<Recommendation, 'id' | 'type' | 'service' | 'treatment'>,
): string {
  const query = new URLSearchParams({ recommendationId: recommendation.id });
  if (recommendation.type === 'TREATMENT' && recommendation.treatment) {
    query.set('treatmentId', recommendation.treatment.id);
    query.set('step', '0');
  } else if (recommendation.service) {
    query.set('serviceId', recommendation.service.id);
  }
  return `/reservar?${query.toString()}`;
}
