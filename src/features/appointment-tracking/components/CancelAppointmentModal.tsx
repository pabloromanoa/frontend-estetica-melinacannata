import { useId, useState } from 'react';
import { assessCancellation, type Appointment } from '@/domain';
import { useNow } from '@/shared/hooks';
import { Alert, ConfirmModal, fieldA11y, FormField, Textarea } from '@/shared/ui';
import { CancellationNotice } from './CancellationNotice';

interface CancelAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  appointment: Pick<Appointment, 'status' | 'deposit' | 'startAt' | 'service' | 'code'>;
  /** El staff debe indicar motivo (CANCELLATION_REASON_REQUIRED). */
  requireReason: boolean;
  onConfirm: (reason: string | undefined) => void;
  isPending?: boolean;
  errorMessage?: string | null;
}

export function CancelAppointmentModal({
  open,
  onClose,
  appointment,
  requireReason,
  onConfirm,
  isPending,
  errorMessage,
}: CancelAppointmentModalProps) {
  const now = useNow();
  const reasonId = useId();
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);
  const assessment = assessCancellation(appointment, now);
  const reasonError =
    requireReason && touched && !reason.trim() ? 'Indicá el motivo de la cancelación.' : undefined;

  const confirm = () => {
    setTouched(true);
    if (requireReason && !reason.trim()) return;
    onConfirm(reason.trim() || undefined);
  };

  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      title={`Cancelar turno #${appointment.code}`}
      confirmLabel="Sí, cancelar turno"
      confirmVariant="destructive"
      loading={isPending}
      onConfirm={confirm}
    >
      <p>
        Vas a cancelar <strong>{appointment.service.name}</strong>. Esta acción no se puede deshacer.
      </p>
      <CancellationNotice assessment={assessment} />
      <FormField
        label={requireReason ? 'Motivo' : 'Motivo (opcional)'}
        htmlFor={reasonId}
        error={reasonError}
        required={requireReason}
      >
        <Textarea
          {...fieldA11y(reasonId, reasonError)}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          onBlur={() => setTouched(true)}
        />
      </FormField>
      {errorMessage && <Alert tone="danger">{errorMessage}</Alert>}
    </ConfirmModal>
  );
}
