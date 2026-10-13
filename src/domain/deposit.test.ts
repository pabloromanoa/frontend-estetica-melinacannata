import { makeDeposit } from '@/test/fixtures';
import {
  DEPOSIT_STATUS_META,
  hasTransferData,
  isPendingReview,
  sortInboxOldestFirst,
  sumDepositAmounts,
  validateRejectionReason,
} from './deposit';

describe('deposit', () => {
  it('detecta señas pendientes', () => {
    expect(isPendingReview(makeDeposit())).toBe(true);
    expect(isPendingReview(makeDeposit({ status: 'VERIFIED' }))).toBe(false);
    expect(isPendingReview(null)).toBe(false);
    expect(DEPOSIT_STATUS_META.REJECTED.tone).toBe('danger');
  });

  it('suma montos', () => {
    expect(sumDepositAmounts([{ amount: 7000 }, { amount: 5000 }, { amount: 6000.5 }])).toBe(18000.5);
    expect(sumDepositAmounts([])).toBe(0);
  });

  it('ordena la bandeja del más antiguo al más nuevo', () => {
    const items = [
      makeDeposit({ id: 'b', uploadedAt: '2026-10-24T15:00:00.000Z' }),
      makeDeposit({ id: 'a', uploadedAt: '2026-10-24T10:00:00.000Z' }),
    ];
    expect(sortInboxOldestFirst(items).map((d) => d.id)).toEqual(['a', 'b']);
  });

  it('valida datos de transferencia y motivo de rechazo', () => {
    const empty = { alias: null, cbu: null, holder: 'X', cuil: null, bankName: null };
    expect(hasTransferData(empty)).toBe(false);
    expect(hasTransferData({ ...empty, cbu: '123' })).toBe(true);
    expect(validateRejectionReason('   ')).toMatch(/motivo/);
    expect(validateRejectionReason('Monto incorrecto')).toBeNull();
  });
});
