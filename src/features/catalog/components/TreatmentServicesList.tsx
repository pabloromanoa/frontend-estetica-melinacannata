import { formatARS, type Service } from '@/domain';

/** Lista ordenada de servicios de un tratamiento. */
export function TreatmentServicesList({
  services,
  currentIndex,
}: {
  services: readonly Service[];
  currentIndex?: number;
}) {
  return (
    <ol className="space-y-2">
      {services.map((service, index) => (
        <li
          key={service.id}
          aria-current={index === currentIndex ? 'step' : undefined}
          className={`flex items-center justify-between gap-3 rounded-xl p-3 ${index === currentIndex ? 'bg-primary-soft' : 'bg-surface-muted'}`}
        >
          <span className="flex items-center gap-3">
            <span className="grid size-7 place-items-center rounded-full bg-surface text-xs font-semibold text-primary">
              {index + 1}
            </span>
            <span>
              <span className="block font-medium text-ink">{service.name}</span>
              <span className="text-xs text-ink-soft">{service.durationMinutes} min</span>
            </span>
          </span>
          <span className="text-sm text-ink-soft">
            {formatARS(service.price)} · seña {formatARS(service.depositAmount)}
          </span>
        </li>
      ))}
    </ol>
  );
}
