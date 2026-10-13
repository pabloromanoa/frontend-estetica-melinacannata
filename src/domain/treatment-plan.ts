import type { Service, Treatment } from './types';

/**
 * Seguimiento de un tratamiento: se reserva cada servicio de a uno (cada uno con su turno y su seña).
 * `stepIndex` es 0-based sobre `treatment.services` (ya ordenados por el backend).
 */
export interface TreatmentStep {
  stepIndex: number;
  totalSteps: number;
  service: Service;
  isLast: boolean;
}

export function getTreatmentStep(
  treatment: Pick<Treatment, 'services'>,
  stepIndex: number,
): TreatmentStep | null {
  const service = treatment.services[stepIndex];
  if (!service) return null;
  const totalSteps = treatment.services.length;
  return { stepIndex, totalSteps, service, isLast: stepIndex === totalSteps - 1 };
}

export function nextTreatmentStepIndex(
  treatment: Pick<Treatment, 'services'>,
  stepIndex: number,
): number | null {
  const next = stepIndex + 1;
  return next < treatment.services.length ? next : null;
}

/** Suma de señas del tratamiento completo (informativo). */
export function treatmentTotals(treatment: Pick<Treatment, 'services'>): { price: number; deposit: number } {
  return treatment.services.reduce(
    (totals, service) => ({
      price: totals.price + service.price,
      deposit: totals.deposit + service.depositAmount,
    }),
    { price: 0, deposit: 0 },
  );
}
