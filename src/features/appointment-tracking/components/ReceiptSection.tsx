import { CircleCheck, FileText } from 'lucide-react';
import { COUNTDOWN_TICK_MS } from '@/config/constants';
import { canUploadReceipt, formatDateTimeLong, isHoldLapsed, type Appointment } from '@/domain';
import { useNow } from '@/shared/hooks';
import { Alert, Button, Countdown, DepositStatusBadge } from '@/shared/ui';
import { HoldExpiredNotice } from './HoldExpiredNotice';
import { ReceiptUpload } from './ReceiptUpload';

export interface ReceiptSectionProps {
  appointment: Appointment;
  onUpload?: (file: File) => void;
  isUploading?: boolean;
  uploadError?: string | null;
  onHoldExpired?: () => void;
  restartHref?: string;
  onViewReceipt?: () => void;
}

/** Estado del comprobante: countdown + carga (CREATED), recibido / verificado / rechazado, o reserva vencida. */
export function ReceiptSection({
  appointment,
  onUpload,
  isUploading,
  uploadError,
  onHoldExpired,
  restartHref,
  onViewReceipt,
}: ReceiptSectionProps) {
  const now = useNow(COUNTDOWN_TICK_MS);
  const { deposit } = appointment;

  if (isHoldLapsed(appointment, now) || (appointment.status === 'EXPIRED' && !deposit)) {
    return <HoldExpiredNotice restartHref={restartHref} />;
  }

  if (canUploadReceipt(appointment, now) && onUpload) {
    return (
      <div className="space-y-3">
        <Countdown expiresAt={appointment.holdExpiresAt} onExpire={onHoldExpired} />
        <ReceiptUpload onUpload={onUpload} isUploading={isUploading} errorMessage={uploadError} />
      </div>
    );
  }

  if (!deposit) return <p className="text-sm text-ink-soft">Todavía no se recibió el comprobante.</p>;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success-bg/50 p-3">
        {deposit.status === 'REJECTED' ? (
          <FileText className="size-5 text-danger" aria-hidden />
        ) : (
          <CircleCheck className="size-5 text-success" aria-hidden />
        )}
        <div className="min-w-0 flex-1">
          <p className="font-medium text-ink">Comprobante recibido</p>
          <p className="text-sm text-ink-soft">{formatDateTimeLong(deposit.uploadedAt)}</p>
        </div>
        <DepositStatusBadge status={deposit.status} />
        {onViewReceipt && (
          <Button size="sm" variant="secondary" onClick={onViewReceipt}>
            Ver PDF
          </Button>
        )}
      </div>
      {deposit.status === 'REJECTED' && (
        <Alert tone="danger" title="La seña fue rechazada">
          {deposit.rejectionReason ?? 'Comunicate con el centro para más información.'}
        </Alert>
      )}
    </div>
  );
}
