import { BUSINESS_LOCALE, BUSINESS_TIMEZONE } from '@/config/constants';
import type { DateKey, DayOfWeek, IsoDateTime, TimeOfDay } from './types';

const MINUTES_PER_HOUR = 60;
const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = MINUTES_PER_HOUR * MS_PER_MINUTE;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
const MONDAY_INDEX = 1;

type DateInput = IsoDateTime | Date;

interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

const partsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: BUSINESS_TIMEZONE,
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

const pad2 = (value: number): string => String(value).padStart(2, '0');
const toDate = (input: DateInput): Date => (input instanceof Date ? input : new Date(input));

function capitalize(text: string): string {
  return text.charAt(0).toLocaleUpperCase(BUSINESS_LOCALE) + text.slice(1);
}

/** Partes de fecha/hora de un instante, vistas en la zona horaria del negocio. */
export function getZonedParts(input: DateInput): ZonedParts {
  const parts = partsFormatter.formatToParts(toDate(input));
  const read = (type: Intl.DateTimeFormatPartTypes): number =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  return {
    year: read('year'),
    month: read('month'),
    day: read('day'),
    hour: read('hour'),
    minute: read('minute'),
    second: read('second'),
  };
}

/** `YYYY-MM-DD` del instante en la zona del negocio. */
export function toDateKey(input: DateInput): DateKey {
  const { year, month, day } = getZonedParts(input);
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

/** `HH:mm` del instante en la zona del negocio. */
export function formatTime(input: DateInput): TimeOfDay {
  const { hour, minute } = getZonedParts(input);
  return `${pad2(hour)}:${pad2(minute)}`;
}

/** Minutos desde la medianoche (zona del negocio). */
export function minutesOfDay(input: DateInput): number {
  const { hour, minute } = getZonedParts(input);
  return hour * MINUTES_PER_HOUR + minute;
}

export function timeToMinutes(time: TimeOfDay): number {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  return hours * MINUTES_PER_HOUR + minutes;
}

export function minutesToTime(totalMinutes: number): TimeOfDay {
  return `${pad2(Math.floor(totalMinutes / MINUTES_PER_HOUR))}:${pad2(totalMinutes % MINUTES_PER_HOUR)}`;
}

function parseDateKey(key: DateKey): { year: number; month: number; day: number } {
  const [year = 0, month = 1, day = 1] = key.split('-').map(Number);
  return { year, month, day };
}

function dateKeyToUtcNoon(key: DateKey): Date {
  const { year, month, day } = parseDateKey(key);
  const NOON = 12;
  return new Date(Date.UTC(year, month - 1, day, NOON));
}

export function addDays(key: DateKey, amount: number): DateKey {
  const date = dateKeyToUtcNoon(key);
  date.setUTCDate(date.getUTCDate() + amount);
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

/** 0 = domingo, igual que `WeeklyAvailabilityRange.dayOfWeek`. */
export function dayOfWeek(key: DateKey): DayOfWeek {
  return dateKeyToUtcNoon(key).getUTCDay() as DayOfWeek;
}

/** Lunes de la semana de `key`. */
export function startOfWeek(key: DateKey): DateKey {
  const day = dayOfWeek(key);
  const diff = (day - MONDAY_INDEX + DAYS_PER_WEEK) % DAYS_PER_WEEK;
  return addDays(key, -diff);
}

/** Número de semana ISO-8601. */
export function isoWeekNumber(key: DateKey): number {
  const date = dateKeyToUtcNoon(key);
  const isoDay = date.getUTCDay() || DAYS_PER_WEEK;
  const THURSDAY = 4;
  date.setUTCDate(date.getUTCDate() + THURSDAY - isoDay);
  const yearStart = Date.UTC(date.getUTCFullYear(), 0, 1);
  const MS_PER_DAY = HOURS_PER_DAY * MS_PER_HOUR;
  return Math.ceil(((date.getTime() - yearStart) / MS_PER_DAY + 1) / DAYS_PER_WEEK);
}

/** Diferencia (minutos) entre la hora de pared del negocio y UTC para un instante. */
function offsetMinutes(instant: Date): number {
  const p = getZonedParts(instant);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - instant.getTime()) / MS_PER_MINUTE);
}

/** Convierte una fecha + hora del negocio a un instante ISO en UTC (lo que espera el backend). */
export function zonedToUtcIso(key: DateKey, time: TimeOfDay = '00:00'): IsoDateTime {
  const { year, month, day } = parseDateKey(key);
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  const wallClockAsUtc = Date.UTC(year, month - 1, day, hours, minutes);
  let utc = wallClockAsUtc - offsetMinutes(new Date(wallClockAsUtc)) * MS_PER_MINUTE;
  const corrected = wallClockAsUtc - offsetMinutes(new Date(utc)) * MS_PER_MINUTE;
  if (corrected !== utc) utc = corrected;
  return new Date(utc).toISOString();
}

/** `YYYY-MM-DDTHH:mm:ss` sin zona (hora de pared del negocio), útil para FullCalendar. */
export function toBusinessLocalIso(input: DateInput): string {
  const p = getZonedParts(input);
  return `${p.year}-${pad2(p.month)}-${pad2(p.day)}T${pad2(p.hour)}:${pad2(p.minute)}:${pad2(p.second)}`;
}

const longDayFormatter = new Intl.DateTimeFormat(BUSINESS_LOCALE, {
  timeZone: BUSINESS_TIMEZONE,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});
const keyLongDayFormatter = new Intl.DateTimeFormat(BUSINESS_LOCALE, {
  timeZone: 'UTC',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});
const keyShortDayFormatter = new Intl.DateTimeFormat(BUSINESS_LOCALE, {
  timeZone: 'UTC',
  weekday: 'short',
  day: '2-digit',
});
const shortDateFormatter = new Intl.DateTimeFormat(BUSINESS_LOCALE, {
  timeZone: BUSINESS_TIMEZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

function assembleLongDay(formatter: Intl.DateTimeFormat, date: Date): string {
  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes): string => parts.find((p) => p.type === type)?.value ?? '';
  return `${capitalize(get('weekday'))} ${get('day')} de ${capitalize(get('month'))}`;
}

const isDateKey = (value: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(value);

/** "Jueves 25 de Octubre". Acepta un instante ISO o un `YYYY-MM-DD`. */
export function formatLongDay(input: DateInput | DateKey): string {
  if (typeof input === 'string' && isDateKey(input)) {
    return assembleLongDay(keyLongDayFormatter, dateKeyToUtcNoon(input));
  }
  return assembleLongDay(longDayFormatter, toDate(input));
}

/** "Jueves 25 de Octubre • 14:30 hs". */
export function formatDateTimeLong(input: DateInput): string {
  return `${formatLongDay(input)} • ${formatTime(input)} hs`;
}

/** "Lun 28". */
export function formatShortDay(key: DateKey): string {
  const parts = keyShortDayFormatter.formatToParts(dateKeyToUtcNoon(key));
  const weekday = (parts.find((p) => p.type === 'weekday')?.value ?? '').replace('.', '');
  const day = parts.find((p) => p.type === 'day')?.value ?? '';
  return `${capitalize(weekday)} ${day}`;
}

/** "25/10/2026". */
export function formatShortDate(input: DateInput | DateKey): string {
  if (typeof input === 'string' && isDateKey(input)) {
    const { year, month, day } = parseDateKey(input);
    return `${pad2(day)}/${pad2(month)}/${year}`;
  }
  return shortDateFormatter.format(toDate(input));
}

/** "14:30 - 16:00 (90m)". */
export function formatTimeRange(startAt: DateInput, endAt: DateInput): string {
  const minutes = Math.round((toDate(endAt).getTime() - toDate(startAt).getTime()) / MS_PER_MINUTE);
  return `${formatTime(startAt)} - ${formatTime(endAt)} (${minutes}m)`;
}

/** Horas (con decimales) desde `now` hasta `target`. Negativo si ya pasó. */
export function hoursBetween(now: Date, target: DateInput): number {
  return (toDate(target).getTime() - now.getTime()) / MS_PER_HOUR;
}

/** "hace 12m", "hace 2h", "hace 3d", "recién". */
export function formatRelativePast(input: DateInput, now: Date): string {
  const minutes = Math.floor((now.getTime() - toDate(input).getTime()) / MS_PER_MINUTE);
  if (minutes < 1) return 'recién';
  if (minutes < MINUTES_PER_HOUR) return `hace ${minutes}m`;
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  if (hours < HOURS_PER_DAY) return `hace ${hours}h`;
  return `hace ${Math.floor(hours / HOURS_PER_DAY)}d`;
}

/** Lista de `DateKey` desde `from` (incluido) durante `count` días. */
export function dateRange(from: DateKey, count: number): DateKey[] {
  return Array.from({ length: count }, (_, index) => addDays(from, index));
}

/** 150 → "2 h 30 min", 45 → "45 min". */
export function formatDuration(totalMinutes: number): string {
  const safe = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(safe / MINUTES_PER_HOUR);
  const minutes = safe % MINUTES_PER_HOUR;
  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}
