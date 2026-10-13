import { Link } from 'react-router';
import { Clock, Sparkles } from 'lucide-react';
import { formatARS, type Service } from '@/domain';
import { Badge, ButtonLink } from '@/shared/ui';

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-surface shadow-card">
      {service.imageUrl ? (
        <img src={service.imageUrl} alt="" className="h-40 w-full object-cover" loading="lazy" />
      ) : (
        <div className="grid h-40 place-items-center bg-primary-soft text-primary" aria-hidden>
          <Sparkles className="size-10" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap gap-1.5">
          {service.categories.map((category) => (
            <Badge key={category.id} tone="primary">
              {category.name}
            </Badge>
          ))}
        </div>
        <h3 className="text-lg font-semibold text-ink">
          <Link to={`/servicios/${service.id}`} className="hover:text-primary">
            {service.name}
          </Link>
        </h3>
        {service.description && <p className="line-clamp-2 text-sm text-ink-soft">{service.description}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div>
            <p className="text-lg font-semibold text-ink">{formatARS(service.price)}</p>
            <p className="flex items-center gap-1 text-xs text-ink-soft">
              <Clock className="size-3.5" aria-hidden /> {service.durationMinutes} min · Seña{' '}
              {formatARS(service.depositAmount)}
            </p>
          </div>
          <ButtonLink
            to={`/reservar?serviceId=${service.id}`}
            size="sm"
            aria-label={`Reservar ${service.name}`}
          >
            Reservar
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
