import { cn } from '@/shared/lib/cn';

export interface TabItem<T extends string> {
  id: T;
  label: string;
  count?: number;
}

interface TabsProps<T extends string> {
  items: readonly TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}

/** Selector segmentado (como "Día (Hoy) / Semana / Mes"). */
export function Tabs<T extends string>({ items, value, onChange, label, className }: TabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn('inline-flex rounded-xl bg-surface-sunken p-1', className)}
    >
      {items.map((item) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.id)}
            className={cn(
              'rounded-lg px-4 py-1.5 text-sm font-medium transition-colors',
              selected ? 'bg-surface text-ink shadow-card' : 'text-ink-soft hover:text-ink',
            )}
          >
            {item.label}
            {item.count !== undefined && <span className="ml-1.5 text-xs text-ink-soft">({item.count})</span>}
          </button>
        );
      })}
    </div>
  );
}
