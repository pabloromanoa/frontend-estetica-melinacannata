import { CANCELLATION_REFUND_HOURS } from '@/config/constants';
import { hoursBetween } from './dates';
import type { Tone } from './tone';
import type { Appointment, DepositOutcome } from './types';

export interface CancellationAssessment {
  /** Resultado esperado (el backend es la fuente de verdad final). */
  expectedOutcome: DepositOutcome;
  /** true si faltan ≥ 24 h para el turno. */
  withinRefundWindow: boolean;
  hoursUntilStart: number;
  title: string;
  message: string;
  tone: Tone;
}

/** Hay una seña acreditada sólo si el turno llegó a DEPOSIT_PAID (o la seña figura VERIFIED). */
function hasVerifiedDeposit(appointment: Pick<Appointment, 'status' | 'deposit'>): boolean {
  return appointment.status === 'DEPOSIT_PAID' || appointment.deposit?.status === 'VERIFIED';
}

/**
 * Política de cancelación:
 *  - ≥ 24 h antes del turno ⇒ corresponde devolución de la seña (se gestiona fuera del sistema).
 *  - < 24 h ⇒ se pierde la seña.
 *  - Sin seña verificada ⇒ no aplica.
 */
export function assessCancellation(
  appointment: Pick<Appointment, 'status' | 'deposit' | 'startAt'>,
  now: Date,
): CancellationAssessment {
  const hoursUntilStart = hoursBetween(now, appointment.startAt);
  const withinRefundWindow = hoursUntilStart >= CANCELLATION_REFUND_HOURS;

  if (!hasVerifiedDeposit(appointment)) {
    const pendingReview = appointment.status === 'PAYMENT_INFORMED';
    return {
      expectedOutcome: 'NOT_APPLICABLE',
      withinRefundWindow,
      hoursUntilStart,
      title: 'No hay seña acreditada',
      message: pendingReview
        ? 'El comprobante todavía no fue verificado, por lo que no hay una seña acreditada. Si ya transferiste, el equipo revisará el caso.'
        : 'Todavía no se acreditó ninguna seña para este turno, así que la cancelación no tiene costo.',
      tone: 'neutral',
    };
  }

  if (withinRefundWindow) {
    return {
      expectedOutcome: 'REFUND',
      withinRefundWindow,
      hoursUntilStart,
      title: 'Corresponde devolución de la seña',
      message: `Estás cancelando con ${CANCELLATION_REFUND_HOURS} h o más de anticipación: corresponde la devolución de la seña. La devolución se coordina directamente con el centro.`,
      tone: 'success',
    };
  }

  return {
    expectedOutcome: 'FORFEIT',
    withinRefundWindow,
    hoursUntilStart,
    title: 'Se pierde la seña',
    message: `Faltan menos de ${CANCELLATION_REFUND_HOURS} h para el turno: si cancelás ahora, la seña no se devuelve.`,
    tone: 'danger',
  };
}

export const DEPOSIT_OUTCOME_LABEL: Record<DepositOutcome, string> = {
  REFUND: 'Corresponde devolver la seña',
  FORFEIT: 'La seña se pierde',
  NOT_APPLICABLE: 'Sin seña verificada',
};
