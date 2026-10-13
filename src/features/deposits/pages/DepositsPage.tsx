import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { CalendarDays } from 'lucide-react';
import { formatARS, formatLongDay, formatTime, sortInboxOldestFirst, type DepositStatus } from '@/domain';
import { Badge, EmptyState, ErrorState, LoadingBlock, PageHeader, Tabs } from '@/shared/ui';
import { DepositDetailPanel } from '../components/DepositDetailPanel';
import { DepositInboxList } from '../components/DepositInboxList';
import { useDepositsInbox } from '../hooks/useDeposits';

const STATUS_TABS = [
  { id: 'PENDING', label: 'Pendientes' },
  { id: 'VERIFIED', label: 'Verificadas' },
  { id: 'REJECTED', label: 'Rechazadas' },
] as const satisfies ReadonlyArray<{ id: DepositStatus; label: string }>;

/** "Verificación de Señas" (prototipo verificacion-senas). */
export function DepositsPage() {
  const [params, setParams] = useSearchParams();
  const [status, setStatus] = useState<DepositStatus>('PENDING');
  const [lastValidated, setLastValidated] = useState<{ name: string; amount: number; at: Date } | null>(null);
  const inbox = useDepositsInbox(status);
  const items = sortInboxOldestFirst(inbox.data?.data ?? []);
  const selectedId = params.get('deposito');
  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  const select = (id: string) => setParams({ deposito: id }, { replace: true });

  return (
    <>
      <PageHeader
        title="Verificación de Señas"
        aside={status === 'PENDING' && <Badge tone="success">{inbox.data?.meta.total ?? 0} pendientes</Badge>}
        description="Control de transferencias recibidas y validación inmediata de turnos."
        actions={
          <>
            {status === 'PENDING' && (
              <p className="text-ink-soft">
                <span className="text-2xl font-semibold text-primary">
                  {formatARS(inbox.data?.meta.pendingAmount ?? 0)}
                </span>{' '}
                en espera
              </p>
            )}
            <span className="flex items-center gap-2 rounded-xl bg-surface px-4 py-2 text-ink-soft shadow-card">
              <CalendarDays className="size-4" aria-hidden /> Hoy: {formatLongDay(new Date())}
            </span>
          </>
        }
      />
      <Tabs
        label="Estado de la seña"
        items={STATUS_TABS}
        value={status}
        onChange={(value) => {
          setStatus(value);
          setParams({}, { replace: true });
        }}
        className="mb-6"
      />
      {inbox.isLoading && <LoadingBlock label="Cargando señas…" />}
      {inbox.isError && <ErrorState error={inbox.error} onRetry={() => void inbox.refetch()} />}
      {inbox.data && (
        <div className="grid gap-6 lg:grid-cols-[minmax(280px,2fr)_3fr]">
          <div>
            <DepositInboxList
              items={items}
              selectedId={selected?.id ?? null}
              onSelect={select}
              onRefresh={() => void inbox.refetch()}
              isRefreshing={inbox.isFetching}
            />
            {lastValidated && (
              <p className="mt-4 flex justify-between border-t border-border pt-3 text-sm text-ink-soft">
                <span>
                  Última validada: {lastValidated.name} ({formatARS(lastValidated.amount)})
                </span>
                <span>{formatTime(lastValidated.at)} hs</span>
              </p>
            )}
          </div>
          {selected ? (
            <DepositDetailPanel
              key={selected.id}
              item={selected}
              onResolved={(name, amount) => setLastValidated({ name, amount, at: new Date() })}
            />
          ) : (
            <EmptyState title="Seleccioná una seña de la bandeja" />
          )}
        </div>
      )}
    </>
  );
}
