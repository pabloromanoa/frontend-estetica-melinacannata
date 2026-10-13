import {
  addDays,
  dateRange,
  dayOfWeek,
  formatDateTimeLong,
  formatDuration,
  formatLongDay,
  formatRelativePast,
  formatShortDate,
  formatShortDay,
  formatTime,
  formatTimeRange,
  hoursBetween,
  isoWeekNumber,
  minutesOfDay,
  minutesToTime,
  startOfWeek,
  timeToMinutes,
  toBusinessLocalIso,
  toDateKey,
  zonedToUtcIso,
} from './dates';

describe('dates (zona America/Argentina/Buenos_Aires, UTC-3)', () => {
  const iso = '2026-10-25T17:30:00.000Z'; // 14:30 en Buenos Aires

  it('muestra la hora en la zona del negocio', () => {
    expect(formatTime(iso)).toBe('14:30');
    expect(minutesOfDay(iso)).toBe(14 * 60 + 30);
  });

  it('calcula el día del negocio aunque en UTC ya sea el siguiente', () => {
    expect(toDateKey('2026-10-26T01:00:00.000Z')).toBe('2026-10-25');
    expect(toDateKey(new Date('2026-10-25T12:00:00.000Z'))).toBe('2026-10-25');
  });

  it('convierte fecha+hora del negocio a ISO UTC', () => {
    expect(zonedToUtcIso('2026-10-25', '14:30')).toBe(iso);
    expect(zonedToUtcIso('2026-10-25')).toBe('2026-10-25T03:00:00.000Z');
  });

  it('formatea fechas largas y cortas en español', () => {
    expect(formatLongDay(iso)).toBe('Domingo 25 de Octubre');
    expect(formatLongDay('2026-10-22')).toBe('Jueves 22 de Octubre');
    expect(formatDateTimeLong(iso)).toBe('Domingo 25 de Octubre • 14:30 hs');
    expect(formatShortDay('2026-10-26')).toBe('Lun 26');
    expect(formatShortDate('2026-10-05')).toBe('05/10/2026');
    expect(formatShortDate(iso)).toBe('25/10/2026');
    expect(formatTimeRange(iso, '2026-10-25T19:00:00.000Z')).toBe('14:30 - 16:00 (90m)');
  });

  it('opera con DateKeys', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(dayOfWeek('2026-10-25')).toBe(0);
    expect(dayOfWeek('2026-10-26')).toBe(1);
    expect(startOfWeek('2026-10-25')).toBe('2026-10-19');
    expect(startOfWeek('2026-10-26')).toBe('2026-10-26');
    expect(dateRange('2026-10-30', 3)).toEqual(['2026-10-30', '2026-10-31', '2026-11-01']);
    expect(isoWeekNumber('2026-10-28')).toBe(44);
    expect(isoWeekNumber('2027-01-01')).toBe(53);
  });

  it('convierte horas y minutos', () => {
    expect(timeToMinutes('08:30')).toBe(510);
    expect(minutesToTime(510)).toBe('08:30');
    expect(minutesToTime(0)).toBe('00:00');
  });

  it('calcula horas entre instantes y tiempo relativo', () => {
    const now = new Date('2026-10-24T17:30:00.000Z');
    expect(hoursBetween(now, iso)).toBe(24);
    expect(formatRelativePast('2026-10-24T17:29:40.000Z', now)).toBe('recién');
    expect(formatRelativePast('2026-10-24T17:18:00.000Z', now)).toBe('hace 12m');
    expect(formatRelativePast('2026-10-24T15:30:00.000Z', now)).toBe('hace 2h');
    expect(formatRelativePast('2026-10-21T17:30:00.000Z', now)).toBe('hace 3d');
  });

  it('genera ISO local del negocio para calendarios', () => {
    expect(toBusinessLocalIso(iso)).toBe('2026-10-25T14:30:00');
  });

  it('formatea duraciones', () => {
    expect(formatDuration(150)).toBe('2 h 30 min');
    expect(formatDuration(45)).toBe('45 min');
    expect(formatDuration(120)).toBe('2 h');
    expect(formatDuration(-5)).toBe('0 min');
  });
});
