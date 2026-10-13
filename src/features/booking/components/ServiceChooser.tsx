import { Clock } from 'lucide-react';
import { formatARS, type Service } from '@/domain';
import { cn } from '@/shared/lib/cn';

interface ServiceChooserProps {
  services: readonly Service[];
  value: string | null;
  onChange: (service: Service) => void;
}

export function ServiceChooser({ services, value, onChange }: ServiceChooserProps) {
  return (
    <fieldset className="grid gap-3 sm:grid-cols-2">
      <legend className="sr-only">Servicio</legend>
      {services.map((service) => (
        <label
          key={service.id}
          className={cn(
            'flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors',
            value === service.id
              ? 'border-primary bg-primary-soft'
              : 'border-border bg-surface hover:border-border-strong',
          )}
        >
          <input
            type="radio"
            name="service"
            checked={value === service.id}
            onChange={() => onChange(service)}
            className="mt-1 size-4 accent-primary"
          />
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-ink">{service.name}</span>
            <span className="flex items-center gap-1 text-sm text-ink-soft">
              <Clock className="size-3.5" aria-hidden /> {service.durationMinutes} min ·{' '}
              {service.categories.map((c) => c.name).join(', ')}
            </span>
          </span>
          <span className="font-semibold text-ink">{formatARS(service.price)}</span>
        </label>
      ))}
    </fieldset>
  );
}
