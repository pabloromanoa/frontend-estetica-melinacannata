import { useState } from 'react';
import { XCircle } from 'lucide-react';
import { canCancel, type Appointment } from '@/domain';
import { CancelAppointmentModal } from './CancelAppointmentModal';
import { Button } from '@/shared/ui';

interface ClientCancelButtonProps {
  appointment: Appointment;
  onCancel: (reason: string | undefined, done: () => void) => void;
  isPending: boolean;
  errorMessage: string | null;
}

/** Botón "Cancelar turno" para cliente/invitado (motivo opcional, aviso de política antes de confirmar). */
export function ClientCancelButton({
  appointment,
  onCancel,
  isPending,
  errorMessage,
}: ClientCancelButtonProps) {
  const [open, setOpen] = useState(false);
  if (!canCancel(appointment.status)) return null;
  return (
    <>
      <Button
        variant="danger"
        onClick={() => setOpen(true)}
        leftIcon={<XCircle className="size-4" aria-hidden />}
      >
        Cancelar turno
      </Button>
      <CancelAppointmentModal
        open={open}
        onClose={() => setOpen(false)}
        appointment={appointment}
        requireReason={false}
        isPending={isPending}
        errorMessage={errorMessage}
        onConfirm={(reason) => onCancel(reason, () => setOpen(false))}
      />
    </>
  );
}
