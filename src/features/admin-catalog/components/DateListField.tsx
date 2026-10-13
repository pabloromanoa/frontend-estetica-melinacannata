import { useState } from 'react';
import { X } from 'lucide-react';
import { formatShortDate, toDateKey, type DateKey } from '@/domain';
import { Button, FormField, IconButton, Input } from '@/shared/ui';

/** Lista de fechas específicas (vacía = el servicio se presta habitualmente). */
export function DateListField({
  value,
  onChange,
}: {
  value: readonly DateKey[];
  onChange: (dates: DateKey[]) => void;
}) {
  const [draft, setDraft] = useState('');
  const add = () => {
    if (!draft || value.includes(draft)) return;
    onChange([...value, draft].sort());
    setDraft('');
  };
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-2">
        <FormField
          label="Fechas específicas"
          htmlFor="service-date"
          hint="Dejalo vacío si el servicio se presta habitualmente."
        >
          <Input
            id="service-date"
            type="date"
            min={toDateKey(new Date())}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        </FormField>
        <Button variant="secondary" onClick={add} disabled={!draft} className="mb-5">
          Agregar
        </Button>
      </div>
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((date) => (
            <li
              key={date}
              className="flex items-center gap-1 rounded-full bg-primary-soft py-0.5 pr-1 pl-3 text-sm text-primary"
            >
              {formatShortDate(date)}
              <IconButton
                aria-label={`Quitar ${formatShortDate(date)}`}
                size="sm"
                className="size-6"
                onClick={() => onChange(value.filter((item) => item !== date))}
              >
                <X className="size-3.5" />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
