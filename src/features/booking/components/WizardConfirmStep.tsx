import { Clock } from 'lucide-react';
import { HOLD_MINUTES } from '@/config/constants';
import type { AvailableSlot, GuestData, Service } from '@/domain';
import { Alert, Button } from '@/shared/ui';
import { BookingSummary } from './BookingSummary';
import { GuestDetailsForm } from './GuestDetailsForm';

interface WizardConfirmStepProps {
  service: Service;
  slot: AvailableSlot;
  providerName: string;
  isGuest: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  onConfirm: (guest?: GuestData) => void;
}

export function WizardConfirmStep({
  service,
  slot,
  providerName,
  isGuest,
  isSubmitting,
  errorMessage,
  onConfirm,
}: WizardConfirmStepProps) {
  return (
    <div className="space-y-6">
      <BookingSummary service={service} slot={slot} providerName={providerName} />
      <Alert tone="warning" title={`Tu horario queda reservado ${HOLD_MINUTES} minutos`}>
        <span className="flex items-center gap-2">
          <Clock className="size-4" aria-hidden />
          Al confirmar te mostramos los datos para transferir la seña. Tenés {HOLD_MINUTES} minutos para
          adjuntar el comprobante en PDF.
        </span>
      </Alert>
      {errorMessage && <Alert tone="danger">{errorMessage}</Alert>}
      {isGuest ? (
        <div>
          <h3 className="mb-3 font-semibold text-ink">Tus datos</h3>
          <GuestDetailsForm
            submitLabel="Confirmar reserva"
            isSubmitting={isSubmitting}
            onSubmit={onConfirm}
          />
        </div>
      ) : (
        <Button size="lg" fullWidth loading={isSubmitting} onClick={() => onConfirm()}>
          Confirmar reserva
        </Button>
      )}
    </div>
  );
}
