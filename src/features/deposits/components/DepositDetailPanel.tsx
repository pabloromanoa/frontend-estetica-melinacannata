import { useState } from 'react';
import { Check, FileText, MessageCircle, ZoomIn } from 'lucide-react';
import {
  buildWhatsAppUrl,
  formatARS,
  formatDateTimeLong,
  formatShortDay,
  formatTime,
  toDateKey,
  type DepositInboxItem,
} from '@/domain';
import { getErrorMessage } from '@/shared/api';
import { Alert, Button, Card, DepositStatusBadge, KeyValue, PdfViewerModal, Tooltip } from '@/shared/ui';
import { useReceiptBlob, useRejectDeposit, useVerifyDeposit } from '../hooks/useDeposits';
import { RejectDepositModal } from './RejectDepositModal';

interface DepositDetailPanelProps {
  item: DepositInboxItem;
  onResolved: (clientName: string, amount: number) => void;
}

/** Detalle de la seña seleccionada + visor del PDF + aprobar / rechazar. */
export function DepositDetailPanel({ item, onResolved }: DepositDetailPanelProps) {
  const { appointment } = item;
  const clientName = `${appointment.client.firstName} ${appointment.client.lastName}`;
  const [viewerOpen, setViewerOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const receipt = useReceiptBlob(item.id, viewerOpen);
  const verify = useVerifyDeposit();
  const reject = useRejectDeposit();
  const pending = item.status === 'PENDING';
  const bank = appointment.provider.bankDetails;

  return (
    <Card className="p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="text-xs font-medium tracking-wide text-ink-soft uppercase">
            Detalle del turno #{appointment.code}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-ink">{clientName}</h2>
          <p className="text-sm text-ink-soft">
            {appointment.client.phone} •{' '}
            <a
              href={buildWhatsAppUrl(appointment.client.phone, '')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <MessageCircle className="size-3.5" aria-hidden /> Abrir chat
            </a>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-ink-soft">Monto a conciliar</p>
          <p className="text-3xl font-semibold text-primary">
            {formatARS(item.amount, { withDecimals: true })}
          </p>
          <DepositStatusBadge status={item.status} />
        </div>
      </div>

      <div className="grid gap-6 py-5 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-ink-soft uppercase">
            Datos de la reserva
          </h3>
          <dl>
            <KeyValue label="Tratamiento" value={appointment.service.name} />
            <KeyValue
              label="Fecha y hora"
              value={`${formatShortDay(toDateKey(appointment.startAt))}, ${formatTime(appointment.startAt)} hs`}
            />
            <KeyValue label="Especialista" value={appointment.provider.displayName} />
          </dl>
        </div>
        <div>
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-ink-soft uppercase">
            Comprobante bancario
          </h3>
          <dl>
            <KeyValue label="Cuenta destino" value={bank.alias ?? bank.cbu ?? '—'} mono />
            <KeyValue label="Recibido" value={formatDateTimeLong(item.uploadedAt)} />
            <KeyValue label="Seña esperada" value={formatARS(appointment.depositAmount)} />
          </dl>
        </div>
      </div>

      <h3 className="mb-2 text-xs font-semibold tracking-wide text-ink-soft uppercase">
        Comprobante adjunto
      </h3>
      <div className="grid h-48 place-items-center rounded-2xl bg-surface-sunken">
        <div className="flex flex-col items-center gap-3">
          <FileText className="size-10 text-ink-faint" aria-hidden />
          <Button
            variant="secondary"
            onClick={() => setViewerOpen(true)}
            leftIcon={<ZoomIn className="size-4" aria-hidden />}
          >
            Ver comprobante completo
          </Button>
        </div>
      </div>

      {item.status === 'REJECTED' && item.rejectionReason && (
        <Alert tone="danger" title="Seña rechazada" className="mt-4">
          {item.rejectionReason}
        </Alert>
      )}
      {verify.isError && (
        <Alert tone="danger" className="mt-4">
          {getErrorMessage(verify.error)}
        </Alert>
      )}

      {pending && (
        <div className="mt-6 grid gap-3 border-t border-border pt-6 sm:grid-cols-3">
          <Button
            size="lg"
            loading={verify.isPending}
            leftIcon={<Check className="size-5" aria-hidden />}
            onClick={() => verify.mutate(item.id, { onSuccess: () => onResolved(clientName, item.amount) })}
          >
            Aprobar y Confirmar Turno
          </Button>
          <Tooltip content="Pendiente de definir con el negocio">
            <Button size="lg" variant="ghost" disabled fullWidth>
              Pedir Reenvío
            </Button>
          </Tooltip>
          <Button size="lg" variant="danger" onClick={() => setRejectOpen(true)}>
            Rechazar Seña
          </Button>
        </div>
      )}

      <PdfViewerModal
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        title={`Comprobante de ${clientName}`}
        fileName={`comprobante-${appointment.code}.pdf`}
        blob={receipt.data}
        isLoading={receipt.isLoading}
        error={receipt.error}
        onRetry={() => void receipt.refetch()}
      />
      <RejectDepositModal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        clientName={clientName}
        isPending={reject.isPending}
        errorMessage={reject.isError ? getErrorMessage(reject.error) : null}
        onConfirm={(reason) =>
          reject.mutate({ depositId: item.id, reason }, { onSuccess: () => setRejectOpen(false) })
        }
      />
    </Card>
  );
}
