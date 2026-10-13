import { useNavigate } from 'react-router';
import { resolveSlotProvider, type GuestData } from '@/domain';
import { useAuth } from '@/features/auth';
import { useServices } from '@/features/catalog';
import { getErrorMessage, isApiError } from '@/shared/api';
import { Alert, Button, ButtonLink, Card, LoadingBlock, Stepper } from '@/shared/ui';
import { ProviderChooser } from '../components/ProviderChooser';
import { ServiceChooser } from '../components/ServiceChooser';
import { TreatmentBanner } from '../components/TreatmentBanner';
import { WizardConfirmStep } from '../components/WizardConfirmStep';
import { WizardScheduleStep } from '../components/WizardScheduleStep';
import { useBookingWizard, WIZARD_STEPS } from '../hooks/useBookingWizard';
import { useCreateAppointment } from '../hooks/useCreateAppointment';

const SLOT_ERRORS = new Set(['SLOT_NOT_AVAILABLE', 'HOLD_EXPIRED']);

/** Reserva pública (invitado o cliente): servicio → profesional → fecha/horario → datos y confirmación. */
export function BookingWizardPage() {
  const navigate = useNavigate();
  const { user, isStaff } = useAuth();
  const wizard = useBookingWizard();
  const services = useServices();
  const create = useCreateAppointment();
  const { service, slot, step } = wizard;

  if (isStaff) {
    return (
      <Alert tone="primary" title="Estás con una sesión del equipo">
        Para reservar a nombre de un paciente usá{' '}
        <ButtonLink to="/panel/nueva-reserva" variant="link">
          Nueva Reserva
        </ButtonLink>{' '}
        en el panel.
      </Alert>
    );
  }

  const providerName = slot
    ? (resolveSlotProvider(slot, wizard.providerId)?.displayName ?? 'Asignación automática')
    : '';

  const confirm = (guest?: GuestData) => {
    if (!service || !slot) return;
    create.mutate(
      {
        serviceId: service.id,
        startAt: slot.startAt,
        providerId: resolveSlotProvider(slot, wizard.providerId)?.id,
        guest,
        recommendationId: wizard.recommendationId,
      },
      {
        onSuccess: ({ appointment, guestAccessToken }) => {
          const nextTreatment = wizard.nextTreatmentParams();
          const suffix = nextTreatment ? `?${nextTreatment}` : '';
          void navigate(
            guestAccessToken
              ? `/turno/${guestAccessToken}${suffix}`
              : `/mi-cuenta/turnos/${appointment.id}${suffix}`,
          );
        },
        onError: (error) => {
          if (isApiError(error) && SLOT_ERRORS.has(error.code)) wizard.resetSlot();
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-ink">Reservar turno</h1>
        <Stepper steps={WIZARD_STEPS} current={step} className="mt-4" />
      </div>
      {wizard.treatment && wizard.treatmentStep && (
        <TreatmentBanner treatmentName={wizard.treatment.name} step={wizard.treatmentStep} />
      )}
      {create.isError && step !== 3 && <Alert tone="danger">{getErrorMessage(create.error)}</Alert>}
      <Card>
        {step > 0 && (
          <Button
            variant="link"
            size="sm"
            className="mb-4"
            onClick={() => wizard.goTo((step - 1) as 0 | 1 | 2)}
            disabled={Boolean(wizard.treatment) && step === 1}
          >
            ← Volver
          </Button>
        )}
        {wizard.serviceLoading && <LoadingBlock />}
        {step === 0 &&
          (services.isLoading ? (
            <LoadingBlock />
          ) : (
            <ServiceChooser
              services={services.data ?? []}
              value={service?.id ?? null}
              onChange={wizard.chooseService}
            />
          ))}
        {step === 1 && service && (
          <ProviderChooser
            providers={service.providers}
            value={wizard.providerId}
            onChange={wizard.chooseProvider}
          />
        )}
        {step === 2 && service && (
          <WizardScheduleStep
            date={wizard.date}
            onDateChange={wizard.chooseDate}
            allowedDates={service.specificDates}
            slots={wizard.slots}
            selected={slot}
            recommendedKey={wizard.recommendedKey}
            onSelect={wizard.chooseSlot}
            onContinue={() => wizard.goTo(3)}
          />
        )}
        {step === 3 && service && slot && (
          <WizardConfirmStep
            service={service}
            slot={slot}
            providerName={providerName}
            isGuest={!user}
            isSubmitting={create.isPending}
            errorMessage={create.isError ? getErrorMessage(create.error) : null}
            onConfirm={confirm}
          />
        )}
      </Card>
    </div>
  );
}
