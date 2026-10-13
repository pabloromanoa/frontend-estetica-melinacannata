import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import type { AppointmentStatus } from '@/domain';
import { useCategories, useServices } from '@/features/catalog';
import { PendingDepositsPanel } from '@/features/deposits';
import { EmptyState, ErrorState, LoadingBlock } from '@/shared/ui';
import { AgendaGrid } from '../components/AgendaGrid';
import { AgendaStats } from '../components/AgendaStats';
import { AgendaToolbar } from '../components/AgendaToolbar';
import { DaySummaryCard } from '../components/DaySummaryCard';
import { useAgendaDay } from '../hooks/useAgenda';
import { useDateParam } from '@/shared/hooks';

/** Agenda Diaria (prototipo agenda-diaria). La fecha se maneja desde la topbar (`?fecha=`). */
export function AgendaDayPage() {
  const navigate = useNavigate();
  const { date, isToday } = useDateParam();
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [status, setStatus] = useState<AppointmentStatus | null>(null);
  const agenda = useAgendaDay(date);
  const categories = useCategories();
  const categoryServices = useServices({ categoryId: categoryId ?? undefined });

  const filters = useMemo(
    () => ({
      statuses: status ? [status] : undefined,
      serviceIds:
        categoryId && categoryServices.data
          ? new Set(categoryServices.data.map((service) => service.id))
          : null,
    }),
    [status, categoryId, categoryServices.data],
  );

  return (
    <div className="space-y-6">
      {agenda.data && <AgendaStats summary={agenda.data.summary} isToday={isToday} />}
      <AgendaToolbar
        view="day"
        onViewChange={(view) => view === 'week' && void navigate(`/panel/mi-agenda?fecha=${date}`)}
        categories={categories.data ?? []}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        status={status}
        onStatusChange={setStatus}
      />
      {agenda.isLoading && <LoadingBlock label="Cargando agenda…" />}
      {agenda.isError && <ErrorState error={agenda.error} onRetry={() => void agenda.refetch()} />}
      {agenda.data && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          {agenda.data.providers.length === 0 ? (
            <EmptyState title="No hay profesionales con agenda este día" />
          ) : (
            <AgendaGrid providers={agenda.data.providers} filters={filters} isToday={isToday} />
          )}
          <aside className="space-y-6" aria-label="Resumen y señas">
            <DaySummaryCard agenda={agenda.data} />
            <PendingDepositsPanel />
          </aside>
        </div>
      )}
    </div>
  );
}
