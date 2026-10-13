import { RotateCw } from 'lucide-react';
import {
  formatARS,
  formatRelativePast,
  formatShortDay,
  formatTime,
  toDateKey,
  type DepositInboxItem,
} from '@/domain';
import { useNow } from '@/shared/hooks';
import { cn } from '@/shared/lib/cn';
import { Button, EmptyState } from '@/shared/ui';

interface DepositInboxListProps {
  items: readonly DepositInboxItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

/** "Bandeja de transferencias" (columna izquierda del prototipo). */
export function DepositInboxList({
  items,
  selectedId,
  onSelect,
  onRefresh,
  isRefreshing,
}: DepositInboxListProps) {
  const now = useNow();
  return (
    <section aria-labelledby="inbox-title">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="inbox-title" className="text-sm font-semibold tracking-wide text-ink-soft uppercase">
          Bandeja de transferencias
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          loading={isRefreshing}
          leftIcon={<RotateCw className="size-4" aria-hidden />}
        >
          Actualizar
        </Button>
      </div>
      {items.length === 0 ? (
        <EmptyState title="No hay señas en esta bandeja" />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const { appointment } = item;
            const selected = item.id === selectedId;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-current={selected || undefined}
                  onClick={() => onSelect(item.id)}
                  className={cn(
                    'w-full rounded-2xl bg-surface p-5 text-left shadow-card transition-colors',
                    selected ? 'border-l-4 border-primary' : 'hover:bg-surface-muted',
                  )}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-lg text-ink">
                        {appointment.client.firstName} {appointment.client.lastName}
                        {selected && <span aria-hidden className="size-2 rounded-full bg-primary" />}
                      </span>
                      <span className="block truncate text-sm text-ink-soft">{appointment.service.name}</span>
                      <span className="block text-sm text-ink-faint">
                        {formatShortDay(toDateKey(appointment.startAt))} {formatTime(appointment.startAt)} hs
                        • {appointment.provider.displayName}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span
                        className={cn('block text-lg', selected ? 'font-semibold text-primary' : 'text-ink')}
                      >
                        {formatARS(item.amount)}
                      </span>
                      <span className="text-xs text-ink-soft">
                        {formatRelativePast(item.uploadedAt, now)}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
