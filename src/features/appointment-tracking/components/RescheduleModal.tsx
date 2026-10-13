import { useId, useState } from 'react';
import { toDateKey, type Appointment, type AvailableSlot, type RescheduleInput } from '@/domain';
import { SlotPicker, useDaySlots } from '@/features/booking';
import {
  Alert,
  Checkbox,
  ConfirmModal,
  ErrorState,
  fieldA11y,
  FormField,
  Input,
  LoadingBlock,
  Textarea,
} from '@/shared/ui';

interface RescheduleModalProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment;
  onConfirm: (input: RescheduleInput) => void;
  isPending?: boolean;
  errorMessage?: string | null;
}

/** Reprogramar: elegir un nuevo horario (revalidado por el backend) + motivo obligatorio. */
export function RescheduleModal({
  open,
  onClose,
  appointment,
  onConfirm,
  isPending,
  errorMessage,
}: RescheduleModalProps) {
  const reasonId = useId();
  const [date, setDate] = useState(() => toDateKey(appointment.startAt));
  const [anyProvider, setAnyProvider] = useState(false);
  const [slot, setSlot] = useState<AvailableSlot | null>(null);
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);
  const providerId = anyProvider ? undefined : appointment.provider.id;
  const slots = useDaySlots({ serviceId: open ? appointment.service.id : undefined, date, providerId });
  const reasonError = touched && !reason.trim() ? 'Indicá el motivo de la reprogramación.' : undefined;

  const confirm = () => {
    setTouched(true);
    if (!slot || !reason.trim()) return;
    const chosenProvider = providerId ?? slot.providers[0]?.id;
    onConfirm({ startAt: slot.startAt, providerId: chosenProvider, reason: reason.trim() });
  };

  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      title={`Reprogramar turno #${appointment.code}`}
      confirmLabel="Reprogramar"
      loading={isPending}
      confirmDisabled={!slot}
      onConfirm={confirm}
    >
      <div className="flex flex-wrap items-end gap-4">
        <FormField label="Nueva fecha" htmlFor={`${reasonId}-date`}>
          <Input
            id={`${reasonId}-date`}
            type="date"
            min={toDateKey(new Date())}
            value={date}
            onChange={(e) => {
              if (e.target.value) {
                setDate(e.target.value);
                setSlot(null);
              }
            }}
          />
        </FormField>
        <Checkbox
          label="Cualquier profesional disponible"
          checked={anyProvider}
          onChange={(e) => {
            setAnyProvider(e.target.checked);
            setSlot(null);
          }}
        />
      </div>
      {slots.isLoading && <LoadingBlock label="Buscando horarios…" />}
      {slots.isError && <ErrorState error={slots.error} onRetry={() => void slots.refetch()} />}
      {slots.data && (
        <SlotPicker
          name="reschedule-slot"
          slots={slots.data}
          selectedKey={slot?.startAt ?? null}
          onSelect={setSlot}
          showProviders={anyProvider}
        />
      )}
      <FormField label="Motivo" htmlFor={reasonId} error={reasonError} required>
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
