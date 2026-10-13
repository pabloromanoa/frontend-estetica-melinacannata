import { Columns3, Info, RotateCcw, Sun, Sunset } from 'lucide-react';
import {
  addDays,
  DAYS_OF_WEEK,
  isoWeekNumber,
  startOfWeek,
  toDateKey,
  type DayOfWeek,
  type DateKey,
} from '@/domain';
import { Alert, Button, Card, Checkbox, IconButton } from '@/shared/ui';
import type { AvailabilityEditor } from '../hooks/useAvailabilityEditor';
import { AvailabilityMatrixGrid } from './AvailabilityMatrixGrid';

const MONDAY_OFFSET = 1;
const DAYS_PER_WEEK = 7;

function currentWeekDates(): Record<DayOfWeek, DateKey> {
  const monday = startOfWeek(toDateKey(new Date()));
  return Object.fromEntries(
    DAYS_OF_WEEK.map((day) => [day, addDays(monday, (day - MONDAY_OFFSET + DAYS_PER_WEEK) % DAYS_PER_WEEK)]),
  ) as Record<DayOfWeek, DateKey>;
}

/** "Matriz Horaria Semanal" con presets y leyenda (prototipo disponibilidad-semanal). */
export function WeeklyMatrixCard({ editor }: { editor: AvailabilityEditor }) {
  const weekDates = currentWeekDates();
  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-start gap-3">
          <Columns3 className="mt-1 size-6 text-primary" aria-hidden />
          <div>
            <h2 className="text-lg font-semibold text-ink">Matriz Horaria Semanal</h2>
            <p className="text-sm text-ink-soft">
              Hacé clic o arrastrá para alternar disponibilidad en bloques de 30 minutos.
            </p>
            <p className="text-xs text-ink-faint">
              Plantilla semanal · vista de referencia: semana {isoWeekNumber(weekDates[1])}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="size-3 rounded bg-success-bg" /> Disponible
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="size-3 rounded bg-surface-muted" /> Descanso
          </span>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="soft"
          leftIcon={<Sun className="size-4" aria-hidden />}
          onClick={editor.applyMornings}
        >
          Mañanas
        </Button>
        <Button
          size="sm"
          variant="soft"
          leftIcon={<Sunset className="size-4" aria-hidden />}
          onClick={editor.applyAfternoons}
        >
          Tardes
        </Button>
        <Checkbox
          label="Atiende domingos"
          checked={editor.includeSunday}
          onChange={(e) => editor.toggleSunday(e.target.checked)}
          className="ml-2"
        />
        <IconButton
          aria-label="Descartar cambios"
          size="sm"
          className="ml-auto"
          onClick={editor.reset}
          disabled={!editor.dirty}
        >
          <RotateCcw className="size-4" />
        </IconButton>
      </div>
      {editor.misaligned.length > 0 && (
        <Alert tone="warning" className="mb-4">
          Hay {editor.misaligned.length} rango(s) guardados que no encajan en bloques de 30 minutos o caen
          fuera de la grilla; al guardar se ajustarán.
        </Alert>
      )}
      <AvailabilityMatrixGrid editor={editor} weekDates={weekDates} />
      <p className="mt-4 flex items-start gap-2 rounded-xl bg-surface-muted p-3 text-sm text-ink-soft">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        Los cambios de disponibilidad impactan en tiempo real sobre el motor de turnos online.
      </p>
    </Card>
  );
}
