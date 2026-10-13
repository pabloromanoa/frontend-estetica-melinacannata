import { useSearchParams } from 'react-router';
import { ExternalLink } from 'lucide-react';
import { TRACKING_SEARCH_FUTURE_DAYS, TRACKING_SEARCH_PAST_DAYS } from '@/config/constants';
import {
  addDays,
  ALL_APPOINTMENT_STATUSES,
  getStatusMeta,
  sortByStart,
  toDateKey,
  zonedToUtcIso,
  type AppointmentStatus,
} from '@/domain';
import { useDebouncedValue } from '@/shared/hooks';
import { Card, ErrorState, FormField, Input, LoadingBlock, PageHeader, Select } from '@/shared/ui';
import { AppointmentsTable } from '../components/AppointmentsTable';
import { useAppointmentsList } from '../hooks/useAppointments';

/** Buscador de turnos (`/panel/turnos`) — destino del buscador de la topbar. */
export function AppointmentsSearchPage() {
  const [params, setParams] = useSearchParams();
  const today = toDateKey(new Date());
  const search = params.get('buscar') ?? '';
  const from = params.get('desde') ?? addDays(today, -TRACKING_SEARCH_PAST_DAYS);
  const to = params.get('hasta') ?? addDays(today, TRACKING_SEARCH_FUTURE_DAYS);
  const status = params.get('estado') as AppointmentStatus | null;
  const debouncedSearch = useDebouncedValue(search);

  const list = useAppointmentsList({
    from: zonedToUtcIso(from),
    to: zonedToUtcIso(addDays(to, 1)),
    search: debouncedSearch || undefined,
    status: status ? [status] : undefined,
  });

  const update = (key: string, value: string) =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );

  return (
    <>
      <PageHeader
        title="Seguimiento Cliente"
        icon={<ExternalLink className="size-7" />}
        description="Buscá un turno para ver su estado, la seña y las acciones disponibles."
      />
      <Card>
        <div className="mb-5 grid gap-4 md:grid-cols-4">
          <FormField label="Paciente" htmlFor="tracking-search">
            <Input
              id="tracking-search"
              type="search"
              placeholder="Nombre o WhatsApp…"
              value={search}
              onChange={(e) => update('buscar', e.target.value)}
            />
          </FormField>
          <FormField label="Desde" htmlFor="tracking-from">
            <Input
              id="tracking-from"
              type="date"
              value={from}
              onChange={(e) => update('desde', e.target.value)}
            />
          </FormField>
          <FormField label="Hasta" htmlFor="tracking-to">
            <Input
              id="tracking-to"
              type="date"
              value={to}
              min={from}
              onChange={(e) => update('hasta', e.target.value)}
            />
          </FormField>
          <FormField label="Estado" htmlFor="tracking-status">
            <Select
              id="tracking-status"
              value={status ?? ''}
              onChange={(e) => update('estado', e.target.value)}
            >
              <option value="">Todos</option>
              {ALL_APPOINTMENT_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {getStatusMeta(value).label}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
        {list.isLoading && <LoadingBlock />}
        {list.isError && <ErrorState error={list.error} onRetry={() => void list.refetch()} />}
        {list.data && <AppointmentsTable appointments={sortByStart(list.data)} />}
      </Card>
    </>
  );
}
