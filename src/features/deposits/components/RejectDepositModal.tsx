import { useId, useState } from 'react';
import { validateRejectionReason } from '@/domain';
import { Alert, ConfirmModal, fieldA11y, FormField, Textarea } from '@/shared/ui';

interface RejectDepositModalProps {
  open: boolean;
  onClose: () => void;
  clientName: string;
  onConfirm: (reason: string) => void;
  isPending?: boolean;
  errorMessage?: string | null;
}

/** Rechazo de seña con motivo obligatorio. El turno pasa a EXPIRED y se libera el horario. */
export function RejectDepositModal({
  open,
  onClose,
  clientName,
  onConfirm,
  isPending,
  errorMessage,
}: RejectDepositModalProps) {
  const id = useId();
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | undefined>();

  const confirm = () => {
    const validation = validateRejectionReason(reason);
    setError(validation ?? undefined);
    if (!validation) onConfirm(reason.trim());
  };

  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      title="Rechazar seña"
      confirmLabel="Rechazar seña"
      confirmVariant="destructive"
      loading={isPending}
      onConfirm={confirm}
    >
      <p>
        Vas a rechazar la seña de <strong>{clientName}</strong>. El turno quedará expirado y el horario se
        liberará.
      </p>
      <FormField
        label="Motivo del rechazo"
        htmlFor={id}
        error={error}
        required
        hint="Se le mostrará al paciente."
      >
        <Textarea
          {...fieldA11y(id, error)}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ej.: el monto transferido no coincide con la seña."
        />
      </FormField>
      {errorMessage && <Alert tone="danger">{errorMessage}</Alert>}
    </ConfirmModal>
  );
}
