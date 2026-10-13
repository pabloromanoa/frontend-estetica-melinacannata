import type { ReactNode } from 'react';

interface CheckboxGroupProps<T> {
  legend: string;
  items: readonly T[];
  getId: (item: T) => string;
  getLabel: (item: T) => ReactNode;
  value: readonly string[];
  onChange: (value: string[]) => void;
  emptyMessage?: string;
  error?: string;
}

/** Selección múltiple accesible (fieldset + legend), útil para relaciones M:N. */
export function CheckboxGroup<T>({
  legend,
  items,
  getId,
  getLabel,
  value,
  onChange,
  emptyMessage = 'No hay opciones.',
  error,
}: CheckboxGroupProps<T>) {
  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter((item) => item !== id) : [...value, id]);
  return (
    <fieldset className="rounded-xl border border-border p-4">
      <legend className="px-1 text-sm font-medium text-ink">{legend}</legend>
      {items.length === 0 ? (
        <p className="text-sm text-ink-soft">{emptyMessage}</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => {
            const id = getId(item);
            return (
              <label key={id} className="flex cursor-pointer items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  className="size-4 accent-primary"
                  checked={value.includes(id)}
                  onChange={() => toggle(id)}
                />
                {getLabel(item)}
              </label>
            );
          })}
        </div>
      )}
      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
