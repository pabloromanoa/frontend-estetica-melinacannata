import { makeAppointment, makeDeposit } from '@/test/fixtures';
import { assessCancellation, DEPOSIT_OUTCOME_LABEL } from './cancellation-policy';

describe('cancellation-policy', () => {
  const startAt = '2026-10-25T17:30:00.000Z';
  const paid = makeAppointment({
    status: 'DEPOSIT_PAID',
    startAt,
    deposit: makeDeposit({ status: 'VERIFIED' }),
  });

  it('exactamente 24 h antes ⇒ corresponde devolución', () => {
    const result = assessCancellation(paid, new Date('2026-10-24T17:30:00.000Z'));
    expect(result.expectedOutcome).toBe('REFUND');
    expect(result.withinRefundWindow).toBe(true);
    expect(result.hoursUntilStart).toBe(24);
    expect(result.tone).toBe('success');
  });

  it('un segundo menos de 24 h ⇒ pierde la seña', () => {
    const result = assessCancellation(paid, new Date('2026-10-24T17:30:01.000Z'));
    expect(result.expectedOutcome).toBe('FORFEIT');
    expect(result.withinRefundWindow).toBe(false);
    expect(result.tone).toBe('danger');
  });

  it('más de 24 h ⇒ devolución', () => {
    expect(assessCancellation(paid, new Date('2026-10-20T10:00:00.000Z')).expectedOutcome).toBe('REFUND');
  });

  it('sin seña verificada ⇒ no aplica (aunque falte poco)', () => {
    const created = makeAppointment({ startAt });
    const result = assessCancellation(created, new Date('2026-10-25T17:00:00.000Z'));
    expect(result.expectedOutcome).toBe('NOT_APPLICABLE');
    expect(result.message).toMatch(/no tiene costo/);
  });

  it('pago informado sin verificar ⇒ no aplica con aviso de revisión', () => {
    const informed = makeAppointment({ status: 'PAYMENT_INFORMED', startAt, deposit: makeDeposit() });
    const result = assessCancellation(informed, new Date('2026-10-20T10:00:00.000Z'));
    expect(result.expectedOutcome).toBe('NOT_APPLICABLE');
    expect(result.message).toMatch(/todavía no fue verificado/);
  });

  it('seña VERIFIED cuenta aunque el estado sea otro', () => {
    const finished = makeAppointment({
      status: 'FINISHED',
      startAt,
      deposit: makeDeposit({ status: 'VERIFIED' }),
    });
    expect(assessCancellation(finished, new Date('2026-10-25T10:00:00.000Z')).expectedOutcome).toBe(
      'FORFEIT',
    );
  });

  it('tiene etiquetas para cada resultado', () => {
    expect(DEPOSIT_OUTCOME_LABEL.REFUND).toMatch(/devolver/);
    expect(Object.keys(DEPOSIT_OUTCOME_LABEL)).toHaveLength(3);
  });
});
