import { HOLD_MINUTES } from '@/config/constants';
import type { IsoDateTime } from './types';

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;

/** Segundos que le quedan a la reserva temporal (nunca negativo). */
export function secondsRemaining(holdExpiresAt: IsoDateTime | null, now: Date): number {
  if (!holdExpiresAt) return 0;
  const diff = new Date(holdExpiresAt).getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / MS_PER_SECOND));
}

export function isHoldExpired(holdExpiresAt: IsoDateTime | null, now: Date): boolean {
  return secondsRemaining(holdExpiresAt, now) === 0;
}

/** "04:59". */
export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / SECONDS_PER_MINUTE);
  const seconds = safe % SECONDS_PER_MINUTE;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** Proporción (0..1) del tiempo de bloqueo que todavía queda, para barras de progreso. */
export function holdProgress(totalSecondsLeft: number): number {
  const total = HOLD_MINUTES * SECONDS_PER_MINUTE;
  return Math.min(1, Math.max(0, totalSecondsLeft / total));
}
