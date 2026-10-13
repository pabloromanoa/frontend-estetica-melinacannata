import type { Service } from '@/domain';
import { EmptyState } from '@/shared/ui';
import { ServiceCard } from './ServiceCard';

export function ServiceGrid({ services }: { services: readonly Service[] }) {
  if (services.length === 0) {
    return <EmptyState title="No encontramos servicios" description="Probá con otra categoría o búsqueda." />;
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
