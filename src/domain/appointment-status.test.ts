import { makeAppointment } from '@/test/fixtures';
import {
  ALL_APPOINTMENT_STATUSES,
  canCancel,
  canFinish,
  canReschedule,
  canUploadReceipt,
  clientFullName,
  getStatusMeta,
  isActiveStatus,
  isHoldLapsed,
  occupiesAgenda,
  sortByStart,
} from './appointment-status';

describe('appointment-status', () => {
  const beforeHold = new Date('2026-10-24T17:13:00.000Z');
  const afterHold = new Date('2026-10-24T17:18:00.000Z');

  it('expone etiquetas y badges del prototipo', () => {
    expect(getStatusMeta('DEPOSIT_PAID')).toEqual({ label: 'Señado', badge: 'Seña OK', tone: 'success' });
    expect(getStatusMeta('PAYMENT_INFORMED').badge).toBe('Por validar');
    expect(getStatusMeta('CREATED').badge).toBe('Seña Pend.');
    expect(ALL_APPOINTMENT_STATUSES).toHaveLength(6);
  });

  it('distingue turnos activos', () => {
    expect(isActiveStatus('CREATED')).toBe(true);
    expect(isActiveStatus('DEPOSIT_PAID')).toBe(true);
    expect(isActiveStatus('FINISHED')).toBe(false);
    expect(isActiveStatus('CANCELLED')).toBe(false);
  });

  it('CREATED ocupa la agenda sólo con el bloqueo vigente', () => {
    const created = makeAppointment();
    expect(occupiesAgenda(created, beforeHold)).toBe(true);
    expect(occupiesAgenda(created, afterHold)).toBe(false);
    expect(occupiesAgenda(makeAppointment({ status: 'FINISHED' }), afterHold)).toBe(true);
    expect(occupiesAgenda(makeAppointment({ status: 'CANCELLED' }), beforeHold)).toBe(false);
    expect(occupiesAgenda(makeAppointment({ status: 'EXPIRED' }), beforeHold)).toBe(false);
  });

  it('define las acciones permitidas por estado', () => {
    expect(canCancel('PAYMENT_INFORMED')).toBe(true);
    expect(canCancel('FINISHED')).toBe(false);
    expect(canReschedule('DEPOSIT_PAID')).toBe(true);
    expect(canReschedule('CREATED')).toBe(false);
    expect(canFinish('DEPOSIT_PAID')).toBe(true);
    expect(canFinish('PAYMENT_INFORMED')).toBe(false);
  });

  it('permite subir comprobante sólo en CREATED con tiempo', () => {
    expect(canUploadReceipt(makeAppointment(), beforeHold)).toBe(true);
    expect(canUploadReceipt(makeAppointment(), afterHold)).toBe(false);
    expect(canUploadReceipt(makeAppointment({ status: 'PAYMENT_INFORMED' }), beforeHold)).toBe(false);
    expect(isHoldLapsed(makeAppointment(), afterHold)).toBe(true);
    expect(isHoldLapsed(makeAppointment({ status: 'DEPOSIT_PAID' }), afterHold)).toBe(false);
  });

  it('ordena por inicio y arma el nombre', () => {
    const a = makeAppointment({ id: 'a', startAt: '2026-10-25T20:00:00.000Z' });
    const b = makeAppointment({ id: 'b', startAt: '2026-10-25T12:00:00.000Z' });
    expect(sortByStart([a, b]).map((x) => x.id)).toEqual(['b', 'a']);
    expect(clientFullName({ firstName: 'Lucía', lastName: 'Gómez' })).toBe('Lucía Gómez');
  });
});
