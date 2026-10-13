import { useState } from 'react';
import { CalendarClock, CheckCheck, ShieldCheck, XCircle } from 'lucide-react';
import { canCancel, canFinish, canReschedule, type Appointment } from '@/domain';
import { getErrorMessage } from '@/shared/api';
import { Alert, Button, ButtonLink, ConfirmModal } from '@/shared/ui';
import {
  useCancelAppointment,
  useFinishAppointment,
  useRescheduleAppointment,
} from '../hooks/useAppointments';
import { CancelAppointmentModal } from './CancelAppointmentModal';
import { RescheduleModal } from './RescheduleModal';

type Dialog = 'cancel' | 'reschedule' | 'finish' | null;

/** Acciones del staff sobre un turno: cancelar (motivo obligatorio), reprogramar y finalizar. */
export function StaffAppointmentActions({ appointment }: { appointment: Appointment }) {
  const [dialog, setDialog] = useState<Dialog>(null);
  const cancel = useCancelAppointment(appointment.id);
  const reschedule = useRescheduleAppointment(appointment.id);
  const finish = useFinishAppointment(appointment.id);
  const close = () => setDialog(null);

  return (
    <>
      {appointment.status === 'PAYMENT_INFORMED' && appointment.deposit && (
        <ButtonLink
          to={`/panel/senas?deposito=${appointment.deposit.id}`}
          variant="success"
          leftIcon={<ShieldCheck className="size-4" aria-hidden />}
        >
          Validar seña
        </ButtonLink>
      )}
      {canFinish(appointment.status) && (
        <Button onClick={() => setDialog('finish')} leftIcon={<CheckCheck className="size-4" aria-hidden />}>
          Finalizar
        </Button>
      )}
      {canReschedule(appointment.status) && (
        <Button
          variant="secondary"
          onClick={() => setDialog('reschedule')}
          leftIcon={<CalendarClock className="size-4" aria-hidden />}
        >
          Reprogramar
        </Button>
      )}
      {canCancel(appointment.status) && (
        <Button
          variant="danger"
          onClick={() => setDialog('cancel')}
          leftIcon={<XCircle className="size-4" aria-hidden />}
        >
          Cancelar turno
        </Button>
      )}
      {finish.isSuccess && (
        <Alert tone="success" className="w-full">
          Turno finalizado.
        </Alert>
      )}

      <CancelAppointmentModal
        open={dialog === 'cancel'}
        onClose={close}
        appointment={appointment}
        requireReason
        isPending={cancel.isPending}
        errorMessage={cancel.isError ? getErrorMessage(cancel.error) : null}
        onConfirm={(reason) => cancel.mutate(reason, { onSuccess: close })}
      />
      {dialog === 'reschedule' && (
        <RescheduleModal
          open
          onClose={close}
          appointment={appointment}
          isPending={reschedule.isPending}
          errorMessage={reschedule.isError ? getErrorMessage(reschedule.error) : null}
          onConfirm={(input) => reschedule.mutate(input, { onSuccess: close })}
        />
      )}
      <ConfirmModal
        open={dialog === 'finish'}
        onClose={close}
        title="Finalizar turno"
        confirmLabel="Marcar como finalizado"
        loading={finish.isPending}
        onConfirm={() => finish.mutate(undefined, { onSuccess: close })}
      >
        <p>
          Confirmá que la atención de {appointment.client.firstName} se realizó y que se cobró el saldo en el
          centro.
        </p>
        {finish.isError && <Alert tone="danger">{getErrorMessage(finish.error)}</Alert>}
      </ConfirmModal>
    </>
  );
}
