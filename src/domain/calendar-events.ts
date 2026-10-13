import { clientFullName, getStatusMeta, occupiesAgenda } from './appointment-status';
import { toBusinessLocalIso } from './dates';
import type { Tone } from './tone';
import type { Appointment, WeeklyAvailabilityRange } from './types';

export interface CalendarEvent {
  id: string;
  title: string;
  /** Hora de pared del negocio sin zona (`YYYY-MM-DDTHH:mm:ss`). */
  start: string;
  end: string;
  tone: Tone;
  subtitle: string;
  statusLabel: string;
}

/** Turnos → eventos de calendario (sólo los que ocupan agenda). */
export function toCalendarEvents(appointments: readonly Appointment[], now: Date): CalendarEvent[] {
  return appointments
    .filter((appointment) => occupiesAgenda(appointment, now))
    .map((appointment) => {
      const meta = getStatusMeta(appointment.status);
      return {
        id: appointment.id,
        title: clientFullName(appointment.client),
        start: toBusinessLocalIso(appointment.startAt),
        end: toBusinessLocalIso(appointment.endAt),
        tone: meta.tone,
        subtitle: appointment.service.name,
        statusLabel: meta.badge,
      };
    });
}

export interface BusinessHoursBlock {
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
}

/** Disponibilidad semanal → bloques de horario laboral (formato de FullCalendar `businessHours`). */
export function toBusinessHours(ranges: readonly WeeklyAvailabilityRange[]): BusinessHoursBlock[] {
  return ranges.map((range) => ({
    daysOfWeek: [range.dayOfWeek],
    startTime: range.startTime,
    endTime: range.endTime,
  }));
}
