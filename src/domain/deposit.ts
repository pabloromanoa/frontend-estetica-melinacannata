import type { Tone } from './tone';
import type { BankDetails, Deposit, DepositInboxItem, DepositStatus } from './types';
import { roundMoney } from './money';

export const DEPOSIT_STATUS_META: Record<DepositStatus, { label: string; tone: Tone }> = {
  PENDING: { label: 'Pendiente', tone: 'pending' },
  VERIFIED: { label: 'Verificada', tone: 'success' },
  REJECTED: { label: 'Rechazada', tone: 'danger' },
};

export function isPendingReview(deposit: Pick<Deposit, 'status'> | null): boolean {
  return deposit?.status === 'PENDING';
}

/** Suma de montos de una bandeja de señas. */
export function sumDepositAmounts(items: readonly Pick<Deposit, 'amount'>[]): number {
  return roundMoney(items.reduce((total, item) => total + item.amount, 0));
}

/** Bandeja ordenada: lo más antiguo primero (lo que más espera). */
export function sortInboxOldestFirst<T extends Pick<DepositInboxItem, 'uploadedAt'>>(
  items: readonly T[],
): T[] {
  return [...items].sort((a, b) => a.uploadedAt.localeCompare(b.uploadedAt));
}

/** Datos de transferencia completos como para mostrarlos al cliente. */
export function hasTransferData(bank: BankDetails): boolean {
  return Boolean(bank.alias || bank.cbu);
}

export function validateRejectionReason(reason: string): string | null {
  return reason.trim().length === 0 ? 'Indicá el motivo del rechazo.' : null;
}
