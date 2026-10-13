import { Link } from 'react-router';
import { Clock, Coffee } from 'lucide-react';
import { AGENDA_COLUMN_MIN_WIDTH_PX, AGENDA_ROW_HEIGHT_PX } from '@/config/constants';
import {
  agendaRowLabels,
  buildAgendaColumn,
  commonBreaks,
  computeAgendaBounds,
  formatTime,
  nowLinePosition,
  timeToMinutes,
  visibleAppointments,
  type AgendaProviderColumn,
  type ColumnFilters,
} from '@/domain';
import { useNow } from '@/shared/hooks';
import { Avatar } from '@/shared/ui';
import { AgendaAppointmentCard } from './AgendaAppointmentCard';

interface AgendaGridProps {
  providers: readonly AgendaProviderColumn[];
  filters: ColumnFilters;
  isToday: boolean;
}

const TIME_COLUMN = '72px';
const MINUTES_PER_HOUR = 60;

/**
 * Agenda por columnas de prestador con grilla CSS propia
 * (el resourceTimeGrid de FullCalendar es premium, por eso no se usa acá).
 */
export function AgendaGrid({ providers, filters, isToday }: AgendaGridProps) {
  const now = useNow();
  const bounds = computeAgendaBounds(providers);
  const labels = agendaRowLabels(bounds);
  const breaks = commonBreaks(providers, bounds);
  const nowPosition = nowLinePosition(bounds, now, isToday);
  const columns = `${TIME_COLUMN} repeat(${providers.length}, minmax(${AGENDA_COLUMN_MIN_WIDTH_PX}px, 1fr))`;
  const bodyHeight = bounds.rows * AGENDA_ROW_HEIGHT_PX;

  return (
    <div className="overflow-x-auto rounded-2xl bg-surface shadow-card">
      <div className="min-w-fit">
        <div
          className="grid border-b border-border bg-surface-muted"
          style={{ gridTemplateColumns: columns }}
        >
          <div className="grid place-items-center text-ink-soft">
            <Clock className="size-5" aria-label="Hora" />
          </div>
          {providers.map((provider) => (
            <div key={provider.id} className="flex items-center gap-3 px-3 py-3">
              <Avatar name={provider.displayName} src={provider.avatarUrl} />
              <div className="min-w-0">
                <p className="truncate text-lg text-ink">{provider.displayName}</p>
                {provider.specialty && <p className="truncate text-sm text-primary">{provider.specialty}</p>}
              </div>
            </div>
          ))}
        </div>
        <div
          className="relative grid gap-x-3 px-1 py-1"
          style={{
            gridTemplateColumns: columns,
            gridTemplateRows: `repeat(${bounds.rows}, ${AGENDA_ROW_HEIGHT_PX}px)`,
            height: bodyHeight,
          }}
        >
          {labels.map((label, index) =>
            timeToMinutes(label) % MINUTES_PER_HOUR === 0 ? (
              <span
                key={label}
                className="pt-2 pl-3 font-mono text-xs text-ink-soft"
                style={{ gridColumn: 1, gridRow: index + 1 }}
              >
                {label}
              </span>
            ) : null,
          )}
          {breaks.map((band) => (
            <div
              key={band.key}
              className="flex items-center justify-center gap-2 bg-surface-muted text-sm text-ink-soft"
              style={{ gridColumn: '2 / -1', gridRow: `${band.rowStart} / span ${band.rowSpan}` }}
            >
              <Coffee className="size-4" aria-hidden /> Pausa ({band.startTime} - {band.endTime})
            </div>
          ))}
          {providers.map((provider, columnIndex) =>
            buildAgendaColumn(provider, visibleAppointments(provider.appointments, now, filters), bounds).map(
              (cell) => (
                <div
                  key={`${provider.id}-${cell.key}`}
                  className="py-1"
                  style={{ gridColumn: columnIndex + 2, gridRow: `${cell.rowStart} / span ${cell.rowSpan}` }}
                >
                  {cell.kind === 'appointment' ? (
                    <AgendaAppointmentCard appointment={cell.appointment} />
                  ) : (
                    <Link
                      to="/panel/nueva-reserva"
                      aria-label={`Horario libre de ${provider.displayName} de ${cell.startTime} a ${cell.endTime}`}
                      className="grid h-full place-items-center rounded-xl border border-dashed border-border bg-app/50 text-sm text-ink-soft hover:border-primary hover:text-primary"
                    >
                      + Libre
                    </Link>
                  )}
                </div>
              ),
            ),
          )}
          {nowPosition !== null && (
            <div
              className="pointer-events-none absolute right-0 left-0 flex items-center"
              style={{ top: nowPosition * bodyHeight }}
              aria-hidden
            >
              <span className="rounded-r-md bg-danger px-2 py-0.5 font-mono text-xs font-semibold text-on-primary">
                {formatTime(now)}
              </span>
              <span className="h-px flex-1 bg-danger" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
