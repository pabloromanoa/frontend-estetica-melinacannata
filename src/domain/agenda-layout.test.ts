import { makeAppointment } from '@/test/fixtures';
import {
  agendaRowLabels,
  buildAgendaColumn,
  commonBreaks,
  computeAgendaBounds,
  nowLinePosition,
  occupancyPercent,
  visibleAppointments,
} from './agenda-layout';

// 2026-10-24: 09:00 BA = 12:00Z
const at = (time: string) => `2026-10-24T${time}:00.000Z`;

describe('agenda-layout', () => {
  const appointment = makeAppointment({
    status: 'DEPOSIT_PAID',
    startAt: at('13:00'),
    endAt: at('14:30'),
    holdExpiresAt: null,
  });
  const provider = {
    workingRanges: [
      { startTime: '09:00', endTime: '13:00' },
      { startTime: '14:00', endTime: '16:00' },
    ],
    appointments: [appointment],
  };

  it('calcula los límites de la grilla a partir de los horarios', () => {
    const bounds = computeAgendaBounds([provider]);
    expect(bounds).toEqual({ startMinutes: 540, endMinutes: 960, stepMinutes: 30, rows: 14 });
    expect(agendaRowLabels(bounds)[0]).toBe('09:00');
  });

  it('usa el rango por defecto si no hay datos', () => {
    expect(computeAgendaBounds([]).rows).toBe(24);
  });

  it('posiciona turnos y fusiona los huecos libres dentro de la jornada', () => {
    const bounds = computeAgendaBounds([provider]);
    const cells = buildAgendaColumn(provider, provider.appointments, bounds);
    expect(cells.map((c) => [c.kind, c.rowStart, c.rowSpan])).toEqual([
      ['free', 1, 2], // 09:00-10:00
      ['appointment', 3, 3], // 10:00-11:30
      ['free', 6, 3], // 11:30-13:00
      ['free', 11, 4], // 14:00-16:00
    ]);
    const lastFree = cells.at(-1);
    expect(lastFree?.kind === 'free' && lastFree.startTime).toBe('14:00');
    expect(lastFree?.kind === 'free' && lastFree.endTime).toBe('16:00');
  });

  it('filtra turnos que no ocupan agenda y por estado/servicio', () => {
    const now = new Date(at('12:00'));
    const cancelled = makeAppointment({ id: 'x', status: 'CANCELLED' });
    expect(visibleAppointments([appointment, cancelled], now)).toEqual([appointment]);
    expect(visibleAppointments([appointment], now, { statuses: ['PAYMENT_INFORMED'] })).toEqual([]);
    expect(visibleAppointments([appointment], now, { serviceIds: new Set(['otro']) })).toEqual([]);
    expect(visibleAppointments([appointment], now, { serviceIds: new Set(['svc-1']) })).toHaveLength(1);
  });

  it('ubica la línea de "ahora"', () => {
    const bounds = computeAgendaBounds([provider]);
    expect(nowLinePosition(bounds, new Date(at('15:30')), true)).toBe(0.5);
    expect(nowLinePosition(bounds, new Date(at('15:30')), false)).toBeNull();
    expect(nowLinePosition(bounds, new Date(at('23:00')), true)).toBeNull();
  });

  it('calcula ocupación', () => {
    expect(occupancyPercent(330, 440)).toBe(75);
    expect(occupancyPercent(10, 0)).toBe(0);
  });

  it('detecta pausas comunes (nadie trabaja) para la banda de almuerzo', () => {
    const other = {
      workingRanges: [
        { startTime: '09:00', endTime: '13:00' },
        { startTime: '14:00', endTime: '15:00' },
      ],
      appointments: [],
    };
    const bounds = computeAgendaBounds([provider, other]);
    expect(commonBreaks([provider, other], bounds)).toEqual([
      { key: 'break-13:00', startTime: '13:00', endTime: '14:00', rowStart: 9, rowSpan: 2 },
    ]);
    expect(commonBreaks([], bounds)).toEqual([]);
  });
});
