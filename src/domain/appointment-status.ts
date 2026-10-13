import { isHoldExpired } from './hold-timer';
import type { Tone } from './tone';
import type { Appointment, AppointmentStatus } from './types';

interface StatusMeta {
  /** Etiqueta completa (detalle, listados). */
  label: string;
  /** Texto corto del badge en agenda / tarjetas (como en los prototipos). */
  badge: string;
  tone: Tone;
}

export const APPOINTMENT_STATUS_META: Record<AppointmentStatus, StatusMeta> = {
  CREATED: { label: 'Creado (reserva temporal)', badge: 'Seña Pend.', tone: 'danger' },
  PAYMENT_INFORMED: { label: 'Pago informado', badge: 'Por validar', tone: 'pending' },
  DEPOSIT_PAID: { label: 'Señado', badge: 'Seña OK', tone: 'success' },
  FINISHED: { label: 'Finalizado', badge: 'Finalizado', tone: 'neutral' },
  CANCELLED: { label: 'Cancelado', badge: 'Cancelado', tone: 'neutral' },
  EXPIRED: { label: 'Expirado', badge: 'Expirado', tone: 'neutral' },
};

export const ALL_APPOINTMENT_STATUSES = Object.keys(APPOINTMENT_STATUS_META) as AppointmentStatus[];

const ACTIVE_STATUSES: ReadonlySet<AppointmentStatus> = new Set([
  'CREATED',
  'PAYMENT_INFORMED',
  'DEPOSIT_PAID',
]);
const CANCELLABLE_STATUSES = ACTIVE_STATUSES;
const RESCHEDULABLE_STATUSES: ReadonlySet<AppointmentStatus> = new Set(['PAYMENT_INFORMED', 'DEPOSIT_PAID']);

export function getStatusMeta(status: AppointmentStatus): StatusMeta {
  return APPOINTMENT_STATUS_META[status];
}

/** Turno vigente (no finalizado ni caído). */
export function isActiveStatus(status: AppointmentStatus): boolean {
  return ACTIVE_STATUSES.has(status);
}

/** Según el contrato: CREATED ocupa la agenda sólo mientras el bloqueo no venció. */
export function occupiesAgenda(
  appointment: Pick<Appointment, 'status' | 'holdExpiresAt'>,
  now: Date,
): boolean {
  if (appointment.status === 'CANCELLED' || appointment.status === 'EXPIRED') return false;
  if (appointment.status === 'CREATED') return !isHoldExpired(appointment.holdExpiresAt, now);
  return true;
}

export function canCancel(status: AppointmentStatus): boolean {
  return CANCELLABLE_STATUSES.has(status);
}

export function canReschedule(status: AppointmentStatus): boolean {
  return RESCHEDULABLE_STATUSES.has(status);
}

/** Finalizar sólo desde DEPOSIT_PAID (contrato). */
export function canFinish(status: AppointmentStatus): boolean {
  return status === 'DEPOSIT_PAID';
}

/** Se puede adjuntar comprobante sólo en CREATED con el bloqueo vigente. */
export function canUploadReceipt(
  appointment: Pick<Appointment, 'status' | 'holdExpiresAt'>,
  now: Date,
): boolean {
  return appointment.status === 'CREATED' && !isHoldExpired(appointment.holdExpiresAt, now);
}

/** Turno en CREATED cuyo bloqueo ya venció (el backend lo pasará a EXPIRED). */
export function isHoldLapsed(appointment: Pick<Appointment, 'status' | 'holdExpiresAt'>, now: Date): boolean {
  return appointment.status === 'CREATED' && isHoldExpired(appointment.holdExpiresAt, now);
}

/** Ordena turnos por fecha de inicio (ascendente). */
export function sortByStart<T extends Pick<Appointment, 'startAt'>>(appointments: readonly T[]): T[] {
  return [...appointments].sort((a, b) => a.startAt.localeCompare(b.startAt));
}

export function clientFullName(client: Pick<Appointment['client'], 'firstName' | 'lastName'>): string {
  return `${client.firstName} ${client.lastName}`.trim();
}
