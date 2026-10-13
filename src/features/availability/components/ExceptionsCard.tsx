import { useState } from 'react';
import { CalendarX2, Trash2 } from 'lucide-react';
import { EXCEPTIONS_LOOKAHEAD_DAYS } from '@/config/constants';
import { addDays, formatLongDay, toDateKey, type AvailabilityException } from '@/domain';
import { getErrorMessage } from '@/shared/api';
import {
  Alert,
  Badge,
  Card,
  CardHeader,
  ConfirmModal,
  EmptyState,
  IconButton,
  LoadingBlock,
} from '@/shared/ui';
import type { ProviderScope } from '../api/availability-admin-api';
import { useCreateException, useDeleteException, useExceptions } from '../hooks/useProviderAvailability';
import { ExceptionForm } from './ExceptionForm';

function describe(exception: AvailabilityException): string {
  if (exception.startTime && exception.endTime) return `${exception.startTime} a ${exception.endTime}`;
  return 'Todo el día';
}

/** Excepciones puntuales: días u horarios no disponibles, o disponibilidad extra. */
export function ExceptionsCard({ scope }: { scope: ProviderScope }) {
  const today = toDateKey(new Date());
  const exceptions = useExceptions(scope, { from: today, to: addDays(today, EXCEPTIONS_LOOKAHEAD_DAYS) });
  const create = useCreateException(scope);
  const remove = useDeleteException(scope);
  const [toDelete, setToDelete] = useState<AvailabilityException | null>(null);
  const items = [...(exceptions.data ?? [])].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Card>
      <CardHeader
        title="Excepciones puntuales"
        icon={<CalendarX2 className="size-5" />}
        subtitle="Feriados, ausencias o jornadas especiales que pisan la plantilla semanal."
      />
      <ExceptionForm isSubmitting={create.isPending} onSubmit={(input) => create.mutate(input)} />
      {create.isError && (
        <Alert tone="danger" className="mt-3">
          {getErrorMessage(create.error)}
        </Alert>
      )}
      <div className="mt-6">
        {exceptions.isLoading && <LoadingBlock />}
        {exceptions.data && items.length === 0 && <EmptyState title="Sin excepciones cargadas" />}
        <ul className="divide-y divide-border">
          {items.map((exception) => (
            <li key={exception.id} className="flex items-center gap-3 py-3">
              <Badge tone={exception.type === 'AVAILABLE' ? 'success' : 'danger'}>
                {exception.type === 'AVAILABLE' ? 'Disponible' : 'No disponible'}
              </Badge>
              <div className="min-w-0 flex-1">
                <p className="text-ink">{formatLongDay(exception.date)}</p>
                <p className="text-sm text-ink-soft">
                  {describe(exception)}
                  {exception.reason ? ` · ${exception.reason}` : ''}
                </p>
              </div>
              <IconButton
                aria-label={`Eliminar excepción del ${formatLongDay(exception.date)}`}
                size="sm"
                variant="danger"
                onClick={() => setToDelete(exception)}
              >
                <Trash2 className="size-4" />
              </IconButton>
            </li>
          ))}
        </ul>
      </div>
      <ConfirmModal
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Eliminar excepción"
        confirmLabel="Eliminar"
        confirmVariant="destructive"
        loading={remove.isPending}
        onConfirm={() => toDelete && remove.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })}
      >
        {toDelete && (
          <p>
            Se eliminará la excepción del {formatLongDay(toDelete.date)} ({describe(toDelete)}).
          </p>
        )}
        {remove.isError && <Alert tone="danger">{getErrorMessage(remove.error)}</Alert>}
      </ConfirmModal>
    </Card>
  );
}
