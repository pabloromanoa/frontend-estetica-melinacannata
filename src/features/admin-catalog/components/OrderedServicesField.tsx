import { useState } from 'react';
import { ArrowDown, ArrowUp, X } from 'lucide-react';
import type { Service } from '@/domain';
import { Button, FormField, IconButton, Select } from '@/shared/ui';

interface OrderedServicesFieldProps {
  services: readonly Service[];
  value: readonly string[];
  onChange: (ids: string[]) => void;
  error?: string;
}

/** Servicios del tratamiento en orden (se reservan uno por uno en ese orden). */
export function OrderedServicesField({ services, value, onChange, error }: OrderedServicesFieldProps) {
  const [candidate, setCandidate] = useState('');
  const byId = new Map(services.map((service) => [service.id, service]));
  const move = (from: number, to: number) => {
    const next = [...value];
    const [item] = next.splice(from, 1);
    if (item) next.splice(to, 0, item);
    onChange(next);
  };
  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2">
        <FormField label="Agregar servicio" htmlFor="treatment-service" error={error} className="flex-1">
          <Select id="treatment-service" value={candidate} onChange={(e) => setCandidate(e.target.value)}>
            <option value="">Elegí un servicio…</option>
            {services
              .filter((s) => !value.includes(s.id))
              .map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
          </Select>
        </FormField>
        <Button
          variant="secondary"
          disabled={!candidate}
          className={error ? 'mb-5' : undefined}
          onClick={() => {
            onChange([...value, candidate]);
            setCandidate('');
          }}
        >
          Agregar
        </Button>
      </div>
      <ol className="space-y-2">
        {value.map((id, index) => (
          <li key={id} className="flex items-center gap-2 rounded-xl bg-surface-muted px-3 py-2">
            <span className="grid size-6 place-items-center rounded-full bg-surface text-xs font-semibold text-primary">
              {index + 1}
            </span>
            <span className="flex-1 text-ink">{byId.get(id)?.name ?? 'Servicio no disponible'}</span>
            <IconButton
              aria-label="Subir"
              size="sm"
              disabled={index === 0}
              onClick={() => move(index, index - 1)}
            >
              <ArrowUp className="size-4" />
            </IconButton>
            <IconButton
              aria-label="Bajar"
              size="sm"
              disabled={index === value.length - 1}
              onClick={() => move(index, index + 1)}
            >
              <ArrowDown className="size-4" />
            </IconButton>
            <IconButton
              aria-label="Quitar"
              size="sm"
              variant="danger"
              onClick={() => onChange(value.filter((item) => item !== id))}
            >
              <X className="size-4" />
            </IconButton>
          </li>
        ))}
      </ol>
    </div>
  );
}
