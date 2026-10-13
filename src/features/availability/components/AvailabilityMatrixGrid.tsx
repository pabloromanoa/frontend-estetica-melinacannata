import { Check } from 'lucide-react';
import {
  availableHours,
  DEFAULT_GRID,
  DISPLAY_DAYS,
  formatShortDay,
  slotLabels,
  type DayOfWeek,
  type DateKey,
} from '@/domain';
import { cn } from '@/shared/lib/cn';
import type { AvailabilityEditor } from '../hooks/useAvailabilityEditor';

const DAY_NAMES: Record<DayOfWeek, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};
const HOURS_FORMAT = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 });

interface AvailabilityMatrixGridProps {
  editor: AvailabilityEditor;
  /** Fecha de cada día de la semana mostrada (para el encabezado "Lun 28"). */
  weekDates: Record<DayOfWeek, DateKey>;
}

/** Matriz horaria semanal: clic o arrastre para alternar bloques de 30 minutos. */
export function AvailabilityMatrixGrid({ editor, weekDates }: AvailabilityMatrixGridProps) {
  const labels = slotLabels(DEFAULT_GRID);
  const days = DISPLAY_DAYS.filter((day) => day !== 0 || editor.includeSunday);
  const columns = `64px repeat(${days.length}, minmax(64px, 1fr))`;

  return (
    <div className="overflow-x-auto">
      <div
        role="grid"
        aria-label="Disponibilidad semanal"
        className="grid min-w-fit gap-1.5 select-none"
        style={{ gridTemplateColumns: columns }}
      >
        <div role="row" className="contents">
          <span
            role="columnheader"
            className="pt-2 text-xs font-semibold tracking-wide text-ink-soft uppercase"
          >
            Hora
          </span>
          {days.map((day) => (
            <span role="columnheader" key={day} className="rounded-xl bg-surface-muted py-2 text-center">
              <span className="block text-ink">{formatShortDay(weekDates[day])}</span>
              <span className="block text-xs text-ink-soft">
                {HOURS_FORMAT.format(availableHours(editor.matrix, day))}h
              </span>
            </span>
          ))}
        </div>
        {labels.map((label, index) => (
          <div role="row" key={label} className="contents">
            <span role="rowheader" className="self-center font-mono text-xs text-ink-soft">
              {label}
            </span>
            {days.map((day) => {
              const available = editor.matrix[day]?.[index] ?? false;
              return (
                <button
                  key={`${day}-${label}`}
                  type="button"
                  role="gridcell"
                  aria-pressed={available}
                  aria-label={`${DAY_NAMES[day]} ${label}: ${available ? 'disponible' : 'no disponible'}`}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    editor.startPaint(day, index);
                  }}
                  onPointerEnter={() => editor.continuePaint(day, index)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      editor.startPaint(day, index);
                    }
                  }}
                  className={cn(
                    'grid h-8 place-items-center rounded-lg text-sm transition-colors',
                    available
                      ? 'bg-success-bg text-success hover:brightness-95'
                      : 'bg-surface-muted text-ink-faint hover:bg-surface-sunken',
                  )}
                >
                  {available ? <Check className="size-4" aria-hidden /> : <span aria-hidden>-</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
