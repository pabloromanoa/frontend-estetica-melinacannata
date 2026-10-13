import { makeAppointment, makeDeposit } from '@/test/fixtures';
import { buildPaymentTracker } from './payment-tracker';

const states = (appointment: Parameters<typeof buildPaymentTracker>[0]) =>
  buildPaymentTracker(appointment).steps.map((step) => step.state);

describe('payment-tracker', () => {
  it('CREATED: turno elegido, esperando comprobante (paso 2)', () => {
    const tracker = buildPaymentTracker(makeAppointment());
    expect(tracker.currentStep).toBe(2);
    expect(states(makeAppointment())).toEqual(['done', 'current', 'upcoming', 'upcoming']);
    expect(tracker.steps[0]?.timestamp).toBe('2026-10-24T17:12:00.000Z');
    expect(tracker.steps[1]?.description).toMatch(/Adjuntá/);
  });

  it('PAYMENT_INFORMED: validando acreditación (paso 3 de 4)', () => {
    const appointment = makeAppointment({ status: 'PAYMENT_INFORMED', deposit: makeDeposit() });
    const tracker = buildPaymentTracker(appointment);
    expect(tracker.currentStep).toBe(3);
    expect(states(appointment)).toEqual(['done', 'done', 'current', 'upcoming']);
    expect(tracker.steps[1]?.timestamp).toBe('2026-10-24T17:22:00.000Z');
    expect(tracker.halted).toBe(false);
  });

  it('DEPOSIT_PAID y FINISHED: los 4 pasos completos', () => {
    const deposit = makeDeposit({ status: 'VERIFIED', reviewedAt: '2026-10-24T17:30:00.000Z' });
    for (const status of ['DEPOSIT_PAID', 'FINISHED'] as const) {
      const appointment = makeAppointment({ status, deposit });
      expect(buildPaymentTracker(appointment).currentStep).toBe(4);
      expect(states(appointment)).toEqual(['done', 'done', 'done', 'done']);
      expect(buildPaymentTracker(appointment).steps[3]?.timestamp).toBe('2026-10-24T17:30:00.000Z');
    }
  });

  it('EXPIRED sin comprobante: falla el paso 2', () => {
    const appointment = makeAppointment({ status: 'EXPIRED' });
    const tracker = buildPaymentTracker(appointment);
    expect(states(appointment)).toEqual(['done', 'failed', 'upcoming', 'upcoming']);
    expect(tracker.halted).toBe(true);
    expect(tracker.currentStep).toBe(2);
    expect(tracker.steps[1]?.description).toMatch(/Venció/);
  });

  it('EXPIRED por seña rechazada: falla el paso 3 con el motivo', () => {
    const appointment = makeAppointment({
      status: 'EXPIRED',
      deposit: makeDeposit({ status: 'REJECTED', rejectionReason: 'Monto incorrecto' }),
    });
    expect(states(appointment)).toEqual(['done', 'done', 'failed', 'upcoming']);
    expect(buildPaymentTracker(appointment).steps[2]?.description).toBe('Seña rechazada: Monto incorrecto');
  });

  it('rechazo sin motivo y cancelaciones', () => {
    const rejected = makeAppointment({ status: 'EXPIRED', deposit: makeDeposit({ status: 'REJECTED' }) });
    expect(buildPaymentTracker(rejected).steps[2]?.description).toBe('La seña fue rechazada.');

    const cancelledAfterPaying = makeAppointment({
      status: 'CANCELLED',
      deposit: makeDeposit({ status: 'VERIFIED' }),
    });
    expect(states(cancelledAfterPaying)).toEqual(['done', 'done', 'done', 'done']);

    const cancelledInformed = makeAppointment({ status: 'CANCELLED', deposit: makeDeposit() });
    expect(states(cancelledInformed)).toEqual(['done', 'done', 'failed', 'upcoming']);
    expect(buildPaymentTracker(cancelledInformed).steps[2]?.description).toBe('El turno fue cancelado.');
  });
});
