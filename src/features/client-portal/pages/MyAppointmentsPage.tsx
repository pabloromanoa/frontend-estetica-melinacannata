import { useState } from 'react';
import { sortByStart } from '@/domain';
import { useAuth } from '@/features/auth';
import { ButtonLink, EmptyState, ErrorState, LoadingBlock, Tabs } from '@/shared/ui';
import { ClientAppointmentCard } from '../components/ClientAppointmentCard';
import { ClientPortalNav } from '../components/ClientPortalNav';
import { useMyAppointments } from '../hooks/useClientPortal';

type View = 'active' | 'history';

export function MyAppointmentsPage() {
  const { user } = useAuth();
  const [view, setView] = useState<View>('active');
  const { data, isLoading, isError, error, refetch } = useMyAppointments();
  const items = data
    ? view === 'active'
      ? sortByStart(data.active)
      : sortByStart(data.history).reverse()
    : [];

  return (
    <div>
      <h1 className="mb-2 text-3xl font-semibold text-ink">Hola, {user?.firstName}</h1>
      <ClientPortalNav />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs
          label="Turnos"
          value={view}
          onChange={setView}
          items={[
            { id: 'active', label: 'Activos', count: data?.active.length },
            { id: 'history', label: 'Historial', count: data?.history.length },
          ]}
        />
        <ButtonLink to="/reservar">Reservar turno</ButtonLink>
      </div>
      {isLoading && <LoadingBlock />}
      {isError && <ErrorState error={error} onRetry={() => void refetch()} />}
      {data && items.length === 0 && (
        <EmptyState
          title={view === 'active' ? 'No tenés turnos activos' : 'Todavía no hay turnos en tu historial'}
          action={<ButtonLink to="/">Ver servicios</ButtonLink>}
        />
      )}
      <div className="space-y-3">
        {items.map((appointment) => (
          <ClientAppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
    </div>
  );
}
