import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import type { DatesSetArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import { AVAILABILITY_GRID_END, AVAILABILITY_GRID_START } from '@/config/constants';
import type { BusinessHoursBlock, CalendarEvent, DateKey } from '@/domain';
import { TONE_CSS_VARS } from '@/shared/lib/tone-classes';

interface WeekCalendarProps {
  initialDate: DateKey;
  events: readonly CalendarEvent[];
  businessHours?: BusinessHoursBlock[];
  onRangeChange: (from: DateKey, toExclusive: DateKey) => void;
  onEventClick: (eventId: string) => void;
}

function renderEvent(arg: EventContentArg) {
  const { subtitle, statusLabel } = arg.event.extendedProps as Pick<
    CalendarEvent,
    'subtitle' | 'statusLabel'
  >;
  return (
    <div className="overflow-hidden px-1 py-0.5 leading-tight">
      <p className="text-xs font-semibold">{arg.timeText}</p>
      <p className="truncate text-xs font-medium">{arg.event.title}</p>
      <p className="truncate text-[11px] opacity-80">{subtitle}</p>
      <p className="truncate text-[11px] font-semibold">{statusLabel}</p>
    </div>
  );
}

/** Agenda semanal con FullCalendar timeGridWeek (plugins gratuitos). Los eventos ya vienen en hora del negocio. */
export function WeekCalendar({
  initialDate,
  events,
  businessHours,
  onRangeChange,
  onEventClick,
}: WeekCalendarProps) {
  const fcEvents = events.map((event) => {
    const colors = TONE_CSS_VARS[event.tone];
    return {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      backgroundColor: colors.background,
      borderColor: colors.border,
      textColor: colors.text,
      extendedProps: { subtitle: event.subtitle, statusLabel: event.statusLabel },
    };
  });

  return (
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      initialDate={initialDate}
      locale={esLocale}
      timeZone="local"
      firstDay={1}
      allDaySlot={false}
      slotMinTime={`${AVAILABILITY_GRID_START}:00`}
      slotMaxTime={`${AVAILABILITY_GRID_END}:00`}
      slotDuration="00:30:00"
      nowIndicator
      height="auto"
      headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
      businessHours={businessHours?.length ? businessHours : false}
      events={fcEvents}
      eventContent={renderEvent}
      eventClick={(arg: EventClickArg) => {
        arg.jsEvent.preventDefault();
        onEventClick(arg.event.id);
      }}
      datesSet={(arg: DatesSetArg) => onRangeChange(arg.startStr.slice(0, 10), arg.endStr.slice(0, 10))}
    />
  );
}
