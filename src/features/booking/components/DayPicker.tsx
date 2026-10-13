import { addDays, dateRange, formatShortDay, type DateKey } from '@/domain';
import { cn } from '@/shared/lib/cn';
import { FormField, Input } from '@/shared/ui';

const VISIBLE_DAYS = 14;

interface DayPickerProps {
  today: DateKey;
  value: DateKey | null;
  onChange: (date: DateKey) => void;
  /** Si el servicio sólo se presta en fechas puntuales. */
  allowedDates?: readonly DateKey[];
}

/** Chips de los próximos días + selector libre de fecha. */
export function DayPicker({ today, value, onChange, allowedDates = [] }: DayPickerProps) {
  const restricted = allowedDates.length > 0;
  const days = restricted ? allowedDates.filter((date) => date >= today) : dateRange(today, VISIBLE_DAYS);
  return (
    <div className="space-y-3">
      <div role="group" aria-label="Elegí un día" className="flex flex-wrap gap-2">
        {days.map((date) => (
          <button
            key={date}
            type="button"
            aria-pressed={value === date}
            onClick={() => onChange(date)}
            className={cn(
              'rounded-xl border px-3 py-2 text-sm transition-colors',
              value === date
                ? 'border-primary bg-primary text-on-primary'
                : 'border-border bg-surface text-ink hover:border-primary',
            )}
          >
            {date === today ? 'Hoy' : formatShortDay(date)}
          </button>
        ))}
      </div>
      {!restricted && (
        <FormField label="Otra fecha" htmlFor="booking-date" className="max-w-xs">
          <Input
            id="booking-date"
            type="date"
            min={today}
            max={addDays(today, 365)}
            value={value ?? ''}
            onChange={(e) => e.target.value && onChange(e.target.value)}
          />
        </FormField>
      )}
    </div>
  );
}
