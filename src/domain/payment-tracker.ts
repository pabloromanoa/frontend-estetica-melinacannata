import type { Appointment, IsoDateTime } from './types';

export type TrackerStepState = 'done' | 'current' | 'upcoming' | 'failed';

export interface TrackerStep {
  index: 1 | 2 | 3 | 4;
  title: string;
  description: string | null;
  state: TrackerStepState;
  timestamp: IsoDateTime | null;
}

export interface PaymentTracker {
  /** Paso "actual" para el chip "Paso X de 4". */
  currentStep: 1 | 2 | 3 | 4;
  totalSteps: 4;
  steps: TrackerStep[];
  halted: boolean;
}

const TITLES = [
  'Turno Seleccionado',
  'Comprobante Enviado',
  'Validando acreditación',
  'Confirmación final vía WhatsApp',
] as const;

type TrackerInput = Pick<Appointment, 'status' | 'deposit' | 'createdAt' | 'cancellationReason'>;

/** Cuántos pasos se completaron según los datos del turno (independiente del estado terminal). */
function completedSteps(appointment: TrackerInput): 1 | 2 | 4 {
  if (appointment.status === 'DEPOSIT_PAID' || appointment.status === 'FINISHED') return 4;
  if (appointment.deposit?.status === 'VERIFIED') return 4;
  if (appointment.deposit) return 2;
  return 1;
}

function haltDescription(appointment: TrackerInput): string {
  if (appointment.deposit?.status === 'REJECTED') {
    return appointment.deposit.rejectionReason
      ? `Seña rechazada: ${appointment.deposit.rejectionReason}`
      : 'La seña fue rechazada.';
  }
  if (appointment.status === 'CANCELLED') return 'El turno fue cancelado.';
  return 'Venció el tiempo para enviar el comprobante.';
}

/**
 * Deriva el tracker "Estado en Vivo" (4 pasos) a partir del estado del turno.
 * CREATED → paso 2 en curso · PAYMENT_INFORMED → paso 3 · DEPOSIT_PAID/FINISHED → todo completo.
 * CANCELLED/EXPIRED → el paso siguiente al último completado queda "failed".
 */
export function buildPaymentTracker(appointment: TrackerInput): PaymentTracker {
  const done = completedSteps(appointment);
  const halted = appointment.status === 'CANCELLED' || appointment.status === 'EXPIRED';
  const rejected = appointment.deposit?.status === 'REJECTED';
  // Una seña rechazada se "cae" en la validación (paso 3).
  const stopAt = rejected ? 3 : done + 1;

  const timestamps: (IsoDateTime | null)[] = [
    appointment.createdAt,
    appointment.deposit?.uploadedAt ?? null,
    appointment.deposit?.status === 'VERIFIED' ? appointment.deposit.reviewedAt : null,
    appointment.deposit?.status === 'VERIFIED' ? appointment.deposit.reviewedAt : null,
  ];

  const steps = TITLES.map((title, i): TrackerStep => {
    const index = (i + 1) as TrackerStep['index'];
    let state: TrackerStepState;
    if (halted) {
      state = index < stopAt ? 'done' : index === stopAt ? 'failed' : 'upcoming';
    } else if (done === 4 || index <= done) {
      state = 'done';
    } else {
      state = index === done + 1 ? 'current' : 'upcoming';
    }
    let description: string | null = null;
    if (state === 'failed') description = haltDescription(appointment);
    else if (state === 'current' && index === 2) description = 'Adjuntá el comprobante de la transferencia.';
    else if (state === 'current' && index === 3) description = 'El equipo está verificando la transferencia.';
    return { index, title, description, state, timestamp: state === 'done' ? (timestamps[i] ?? null) : null };
  });

  const failedStep = steps.find((step) => step.state === 'failed');
  const currentStep = (failedStep?.index ?? (done === 4 ? 4 : done + 1)) as PaymentTracker['currentStep'];
  return { currentStep, totalSteps: 4, steps, halted };
}
