import { Sparkles } from 'lucide-react';
import { formatDateTimeLong, formatTime, slotDurationMinutes, slotKey, type AvailableSlot } from '@/domain';
import { cn } from '@/shared/lib/cn';
import { Badge, EmptyState } from '@/shared/ui';

export const CONTIGUOUS_LABEL = 'Turno continuo sin demoras';

interface SlotPickerProps {
  slots: readonly AvailableSlot[];
  selectedKey: string | null;
  onSelect: (slot: AvailableSlot) => void;
  recommendedKey?: string | null;
  /** Muestra fecha completa (sugerencias de varios días). */
  showDate?: boolean;
  showProviders?: boolean;
  name?: string;
  emptyMessage?: string;
}

/** Lista de horarios disponibles como radio-cards (prototipo "Horarios Disponibles Sugeridos"). */
export function SlotPicker({
  slots,
  selectedKey,
  onSelect,
  recommendedKey,
  showDate = false,
  showProviders = true,
  name = 'slot',
  emptyMessage = 'No hay horarios disponibles para esta selección.',
}: SlotPickerProps) {
  if (slots.length === 0) return <EmptyState title="Sin horarios" description={emptyMessage} />;

  return (
    <fieldset className="space-y-3">
      <legend className="sr-only">Horarios disponibles</legend>
      {slots.map((slot) => {
        const key = slotKey(slot);
        const selected = key === selectedKey;
        const id = `${name}-${key}`;
        const duration = slotDurationMinutes(slot);
        return (
          <label
            key={key}
            htmlFor={id}
            className={cn(
              'flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-colors',
              selected
                ? 'border-primary bg-primary-soft'
                : 'border-transparent bg-surface-muted hover:border-border-strong',
            )}
          >
            <input
              id={id}
              type="radio"
              name={name}
              checked={selected}
              onChange={() => onSelect(slot)}
              className="size-5 accent-primary"
            />
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className={cn('text-ink', selected ? 'text-lg font-semibold' : 'font-medium')}>
                  {showDate ? formatDateTimeLong(slot.startAt) : `${formatTime(slot.startAt)} hs`}
                </span>
                {key === recommendedKey && (
                  <Badge tone="neutral" className="bg-surface text-ink">
                    Recomendado
                  </Badge>
                )}
                {showProviders && slot.providers.length > 0 && (
                  <span className="text-sm text-ink-soft">
                    ({slot.providers.map((p) => p.displayName).join(', ')})
                  </span>
                )}
              </span>
              <span className="mt-0.5 block text-sm text-ink-soft">
                Duración: {formatTime(slot.startAt)} a {formatTime(slot.endAt)} hs ({duration} min)
                {slot.contiguous && (
                  <span className="text-ink">
                    {' • '}
                    <Sparkles className="inline size-3.5 text-primary" aria-hidden /> {CONTIGUOUS_LABEL}
                  </span>
                )}
              </span>
            </span>
            {selected ? (
              <Badge tone="primary" appearance="solid" className="bg-primary text-on-primary">
                Seleccionado
              </Badge>
            ) : (
              <span aria-hidden className="rounded-lg bg-surface px-3 py-1.5 text-sm text-ink">
                Elegir
              </span>
            )}
          </label>
        );
      })}
    </fieldset>
  );
}
