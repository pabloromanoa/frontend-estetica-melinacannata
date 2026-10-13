import { makeAppointment } from '@/test/fixtures';
import { toBusinessHours, toCalendarEvents } from './calendar-events';

describe('calendar-events', () => {
  it('convierte turnos en eventos con hora local del negocio y descarta cancelados', () => {
    const now = new Date('2026-10-24T17:13:00.000Z');
    const events = toCalendarEvents(
      [makeAppointment({ status: 'DEPOSIT_PAID' }), makeAppointment({ id: 'x', status: 'CANCELLED' })],
      now,
    );
    expect(events).toEqual([
      {
        id: 'appt-1',
        title: 'Florencia Benítez',
        start: '2026-10-25T14:30:00',
        end: '2026-10-25T16:00:00',
        tone: 'success',
        subtitle: 'Manicuría Rusa',
        statusLabel: 'Seña OK',
      },
    ]);
  });

  it('convierte disponibilidad en businessHours', () => {
    expect(toBusinessHours([{ dayOfWeek: 1, startTime: '08:00', endTime: '13:00' }])).toEqual([
      { daysOfWeek: [1], startTime: '08:00', endTime: '13:00' },
    ]);
  });
});
