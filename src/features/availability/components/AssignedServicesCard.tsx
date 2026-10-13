import { useEffect, useState } from 'react';
import type { Service } from '@/domain';
import { getErrorMessage } from '@/shared/api';
import { Alert, Button, Card, CardHeader } from '@/shared/ui';

interface AssignedServicesCardProps {
  services: readonly Service[];
  assignedIds: readonly string[];
  onSave: (ids: string[]) => void;
  isSaving: boolean;
  error: unknown;
  saved: boolean;
}

/** "Servicios Asignados": qué servicios presta la profesional. */
export function AssignedServicesCard({
  services,
  assignedIds,
  onSave,
  isSaving,
  error,
  saved,
}: AssignedServicesCardProps) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(assignedIds));
  useEffect(() => setSelected(new Set(assignedIds)), [assignedIds]);

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <Card className="p-5">
      <CardHeader
        title="Servicios Asignados"
        actions={<span className="text-sm text-ink-soft">{selected.size} activos</span>}
      />
      <ul className="space-y-3">
        {services.map((service) => {
          const checked = selected.has(service.id);
          return (
            <li key={service.id}>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  className="size-5 accent-primary"
                  checked={checked}
                  onChange={() => toggle(service.id)}
                />
                <span className={checked ? 'flex-1 text-ink' : 'flex-1 text-ink-faint line-through'}>
                  {service.name}
                </span>
                <span className="text-sm text-ink-soft">{service.durationMinutes} min</span>
              </label>
            </li>
          );
        })}
      </ul>
      {Boolean(error) && (
        <Alert tone="danger" className="mt-3">
          {getErrorMessage(error)}
        </Alert>
      )}
      {saved && (
        <Alert tone="success" className="mt-3">
          Servicios actualizados.
        </Alert>
      )}
      <Button
        variant="secondary"
        fullWidth
        className="mt-4"
        loading={isSaving}
        onClick={() => onSave([...selected])}
      >
        Guardar servicios
      </Button>
    </Card>
  );
}
