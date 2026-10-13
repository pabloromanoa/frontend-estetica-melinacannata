import { AGENDA_DEFAULT_END, AGENDA_DEFAULT_START, SLOT_GRID_MINUTES } from '@/config/constants';
import { occupiesAgenda } from './appointment-status';
import { minutesOfDay, minutesToTime, timeToMinutes } from './dates';
import type { AgendaProviderColumn, Appointment, AppointmentStatus, TimeOfDay, WorkingRange } from './types';

/**
 * Cálculo de la grilla de la Agenda Diaria (columnas por prestador, filas de 30 min).
 * Es puro: la vista sólo traduce `rowStart`/`rowSpan` a `grid-row`.
 */
export interface AgendaBounds {
  startMinutes: number;
  endMinutes: number;
  stepMinutes: number;
  rows: number;
}

export type AgendaCell =
  | { kind: 'appointment'; key: string; appointment: Appointment; rowStart: number; rowSpan: number }
  | {
      kind: 'free';
      key: string;
      startTime: TimeOfDay;
      endTime: TimeOfDay;
      rowStart: number;
      rowSpan: number;
    };

export function computeAgendaBounds(
  providers: readonly Pick<AgendaProviderColumn, 'workingRanges' | 'appointments'>[],
  stepMinutes = SLOT_GRID_MINUTES,
): AgendaBounds {
  const starts: number[] = [];
  const ends: number[] = [];
  for (const provider of providers) {
    provider.workingRanges.forEach((range) => {
      starts.push(timeToMinutes(range.startTime));
      ends.push(timeToMinutes(range.endTime));
    });
    provider.appointments.forEach((appointment) => {
      starts.push(minutesOfDay(appointment.startAt));
      ends.push(minutesOfDay(appointment.endAt));
    });
  }
  const rawStart = starts.length ? Math.min(...starts) : timeToMinutes(AGENDA_DEFAULT_START);
  const rawEnd = ends.length ? Math.max(...ends) : timeToMinutes(AGENDA_DEFAULT_END);
  const startMinutes = Math.floor(rawStart / stepMinutes) * stepMinutes;
  const endMinutes = Math.max(startMinutes + stepMinutes, Math.ceil(rawEnd / stepMinutes) * stepMinutes);
  return { startMinutes, endMinutes, stepMinutes, rows: (endMinutes - startMinutes) / stepMinutes };
}

/** Etiquetas de las filas (una por bloque). */
export function agendaRowLabels(bounds: AgendaBounds): TimeOfDay[] {
  return Array.from({ length: bounds.rows }, (_, i) =>
    minutesToTime(bounds.startMinutes + i * bounds.stepMinutes),
  );
}

const toRow = (minutes: number, bounds: AgendaBounds): number =>
  Math.floor((minutes - bounds.startMinutes) / bounds.stepMinutes) + 1;

function isWithinWorkingRanges(slotStart: number, slotEnd: number, ranges: readonly WorkingRange[]): boolean {
  return ranges.some(
    (range) => slotStart >= timeToMinutes(range.startTime) && slotEnd <= timeToMinutes(range.endTime),
  );
}

export interface ColumnFilters {
  statuses?: readonly AppointmentStatus[];
  serviceIds?: ReadonlySet<string> | null;
}

/** Turnos visibles: los que ocupan agenda y pasan los filtros de la vista. */
export function visibleAppointments(
  appointments: readonly Appointment[],
  now: Date,
  filters: ColumnFilters = {},
): Appointment[] {
  return appointments.filter((appointment) => {
    if (!occupiesAgenda(appointment, now)) return false;
    if (filters.statuses?.length && !filters.statuses.includes(appointment.status)) return false;
    if (filters.serviceIds && !filters.serviceIds.has(appointment.service.id)) return false;
    return true;
  });
}

/**
 * Celdas de una columna: turnos posicionados + huecos libres (bloques de la jornada laboral sin turnos,
 * fusionados cuando son consecutivos).
 */
export function buildAgendaColumn(
  provider: Pick<AgendaProviderColumn, 'workingRanges'>,
  appointments: readonly Appointment[],
  bounds: AgendaBounds,
): AgendaCell[] {
  const busy = new Set<number>();
  const cells: AgendaCell[] = appointments.map((appointment) => {
    const start = minutesOfDay(appointment.startAt);
    const end = Math.max(start + bounds.stepMinutes, minutesOfDay(appointment.endAt));
    const rowStart = toRow(start, bounds);
    const rowSpan = Math.max(1, Math.ceil((end - start) / bounds.stepMinutes));
    for (let row = rowStart; row < rowStart + rowSpan; row += 1) busy.add(row);
    return { kind: 'appointment', key: appointment.id, appointment, rowStart, rowSpan };
  });

  let freeStart: number | null = null;
  const closeFree = (rowExclusive: number): void => {
    if (freeStart === null) return;
    const startTime = minutesToTime(bounds.startMinutes + (freeStart - 1) * bounds.stepMinutes);
    const endTime = minutesToTime(bounds.startMinutes + (rowExclusive - 1) * bounds.stepMinutes);
    cells.push({
      kind: 'free',
      key: `free-${startTime}`,
      startTime,
      endTime,
      rowStart: freeStart,
      rowSpan: rowExclusive - freeStart,
    });
    freeStart = null;
  };
  for (let row = 1; row <= bounds.rows; row += 1) {
    const slotStart = bounds.startMinutes + (row - 1) * bounds.stepMinutes;
    const free =
      !busy.has(row) &&
      isWithinWorkingRanges(slotStart, slotStart + bounds.stepMinutes, provider.workingRanges);
    if (free && freeStart === null) freeStart = row;
    if (!free) closeFree(row);
  }
  closeFree(bounds.rows + 1);
  return cells.sort((a, b) => a.rowStart - b.rowStart);
}

/** Posición (0..1) de "ahora" dentro de la grilla, o null si está fuera de horario o no es el día mostrado. */
export function nowLinePosition(bounds: AgendaBounds, now: Date, isToday: boolean): number | null {
  if (!isToday) return null;
  const minutes = minutesOfDay(now);
  if (minutes < bounds.startMinutes || minutes > bounds.endMinutes) return null;
  return (minutes - bounds.startMinutes) / (bounds.endMinutes - bounds.startMinutes);
}

/** Porcentaje de ocupación del día a partir del resumen del backend. */
export function occupancyPercent(bookedMinutes: number, capacityMinutes: number): number {
  const PERCENT = 100;
  if (capacityMinutes <= 0) return 0;
  return Math.round((bookedMinutes / capacityMinutes) * PERCENT);
}

export interface AgendaBand {
  key: string;
  startTime: TimeOfDay;
  endTime: TimeOfDay;
  rowStart: number;
  rowSpan: number;
}

/**
 * Franjas en las que NINGÚN prestador trabaja ni tiene turnos dentro de la grilla
 * (ej. "Pausa Almuerzo 13:00 - 14:00"). Se muestran como una banda a lo ancho de la agenda.
 */
export function commonBreaks(
  providers: readonly Pick<AgendaProviderColumn, 'workingRanges' | 'appointments'>[],
  bounds: AgendaBounds,
): AgendaBand[] {
  if (providers.length === 0) return [];
  const bands: AgendaBand[] = [];
  let start: number | null = null;
  const close = (rowExclusive: number): void => {
    if (start === null) return;
    const startTime = minutesToTime(bounds.startMinutes + (start - 1) * bounds.stepMinutes);
    const endTime = minutesToTime(bounds.startMinutes + (rowExclusive - 1) * bounds.stepMinutes);
    bands.push({
      key: `break-${startTime}`,
      startTime,
      endTime,
      rowStart: start,
      rowSpan: rowExclusive - start,
    });
    start = null;
  };
  for (let row = 1; row <= bounds.rows; row += 1) {
    const slotStart = bounds.startMinutes + (row - 1) * bounds.stepMinutes;
    const slotEnd = slotStart + bounds.stepMinutes;
    const someoneBusy = providers.some(
      (provider) =>
        isWithinWorkingRanges(slotStart, slotEnd, provider.workingRanges) ||
        provider.appointments.some(
          (a) => minutesOfDay(a.startAt) < slotEnd && minutesOfDay(a.endAt) > slotStart,
        ),
    );
    if (!someoneBusy && start === null) start = row;
    if (someoneBusy) close(row);
  }
  close(bounds.rows + 1);
  return bands;
}
