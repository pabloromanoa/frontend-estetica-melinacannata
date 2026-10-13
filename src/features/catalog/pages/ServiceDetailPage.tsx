import { useParams } from 'react-router';
import { CalendarCheck, Clock } from 'lucide-react';
import { formatARS, formatShortDate } from '@/domain';
import { Badge, ButtonLink, Card, CardHeader, ErrorState, KeyValue, LoadingBlock } from '@/shared/ui';
import { ProviderList } from '../components/ProviderList';
import { useService } from '../hooks/useCatalog';

export function ServiceDetailPage() {
  const { serviceId } = useParams();
  const { data: service, isLoading, isError, error, refetch } = useService(serviceId);

  if (isLoading) return <LoadingBlock />;
  if (isError || !service) return <ErrorState error={error} onRetry={() => void refetch()} />;

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {service.categories.map((category) => (
            <Badge key={category.id} tone="primary">
              {category.name}
            </Badge>
          ))}
        </div>
        <h1 className="text-3xl font-semibold text-ink">{service.name}</h1>
        {service.description && <p className="mt-3 text-ink-soft">{service.description}</p>}
        {service.imageUrl && (
          <img src={service.imageUrl} alt="" className="mt-6 max-h-80 w-full rounded-2xl object-cover" />
        )}
        <h2 className="mt-8 mb-3 text-lg font-semibold text-ink">Profesionales</h2>
        <ProviderList providers={service.providers} />
      </Card>
      <Card className="h-fit">
        <CardHeader title="Resumen" icon={<Clock className="size-5" />} />
        <dl>
          <KeyValue label="Duración" value={`${service.durationMinutes} min`} />
          <KeyValue label="Precio" value={formatARS(service.price)} />
          <KeyValue label="Seña para confirmar (50%)" value={formatARS(service.depositAmount)} emphasis />
          {service.specificDates.length > 0 && (
            <KeyValue label="Disponible sólo" value={service.specificDates.map(formatShortDate).join(', ')} />
          )}
        </dl>
        <ButtonLink
          to={`/reservar?serviceId=${service.id}`}
          fullWidth
          size="lg"
          className="mt-6"
          leftIcon={<CalendarCheck className="size-5" aria-hidden />}
        >
          Reservar turno
        </ButtonLink>
      </Card>
    </div>
  );
}
