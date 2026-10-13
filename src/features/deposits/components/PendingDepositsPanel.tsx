import { Link } from 'react-router';
import { ArrowRight, ReceiptText } from 'lucide-react';
import { DEPOSITS_PREVIEW_COUNT } from '@/config/constants';
import { formatARS, sortInboxOldestFirst } from '@/domain';
import { ButtonLink, Card, Spinner } from '@/shared/ui';
import { useDepositsInbox } from '../hooks/useDeposits';

/** Panel "Validar Señas" de la agenda: las 3 pendientes más antiguas. */
export function PendingDepositsPanel() {
  const { data, isLoading } = useDepositsInbox('PENDING');
  const items = sortInboxOldestFirst(data?.data ?? []).slice(0, DEPOSITS_PREVIEW_COUNT);
  const total = data?.meta.total ?? 0;
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
          <ReceiptText className="size-5" aria-hidden /> Validar Señas
        </h2>
        <span className="text-sm text-ink-soft">{total} pend.</span>
      </div>
      {isLoading && <Spinner className="text-primary" />}
      {!isLoading && items.length === 0 && (
        <p className="text-sm text-ink-soft">No hay señas pendientes. ¡Todo al día!</p>
      )}
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-xl bg-surface-muted p-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">
                {item.appointment.client.firstName} {item.appointment.client.lastName}
              </p>
              <p className="text-sm text-ink-soft">{formatARS(item.amount)} • Transferencia</p>
            </div>
            <ButtonLink to={`/panel/senas?deposito=${item.id}`} variant="success" size="sm">
              Validar
            </ButtonLink>
          </li>
        ))}
      </ul>
      <Link
        to="/panel/senas"
        className="mt-4 flex items-center justify-center gap-1 text-sm text-primary hover:underline"
      >
        Ver todas las señas <ArrowRight className="size-4" aria-hidden />
      </Link>
    </Card>
  );
}
