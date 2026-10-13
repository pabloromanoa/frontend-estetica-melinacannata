import type { Category } from '@/domain';
import { cn } from '@/shared/lib/cn';

interface CategoryFilterProps {
  categories: readonly Category[];
  value: string | null;
  onChange: (categoryId: string | null) => void;
  allLabel?: string;
}

/** Chips de categoría ("Todos", "Faciales", "Uñas"…). */
export function CategoryFilter({ categories, value, onChange, allLabel = 'Todos' }: CategoryFilterProps) {
  const chip = (id: string | null, label: string) => {
    const selected = value === id;
    return (
      <button
        key={id ?? 'all'}
        type="button"
        aria-pressed={selected}
        onClick={() => onChange(id)}
        className={cn(
          'flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition-colors',
          selected
            ? 'border-primary bg-primary text-on-primary'
            : 'border-border bg-surface text-ink hover:border-primary',
        )}
      >
        {id && (
          <span
            aria-hidden
            className={cn('size-1.5 rounded-full', selected ? 'bg-on-primary' : 'bg-ink-soft')}
          />
        )}
        {label}
      </button>
    );
  };
  return (
    <div role="group" aria-label="Filtrar por categoría" className="flex flex-wrap gap-2">
      {chip(null, allLabel)}
      {categories.map((category) => chip(category.id, category.name))}
    </div>
  );
}
