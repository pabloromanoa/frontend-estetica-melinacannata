import { Link, useParams, useSearchParams } from 'react-router';
import {
  AppointmentTrackingView,
  ClientCancelButton,
  TreatmentContinueBanner,
  useAppointment,
  useCancelAppointment,
  useUploadReceipt,
} from '@/features/appointment-tracking';
import { repeatBookingHref } from '@/domain';
import { getErrorMessage } from '@/shared/api';
import { ButtonLink, ErrorState, LoadingBlock } from '@/shared/ui';

/** Seguimiento de un turno para el cliente registrado. */
export function ClientAppointmentPage() {
  const { appointmentId = '' } = useParams();
  const [params] = useSearchParams();
  const { data: appointment, isLoading, isError, error, refetch } = useAppointment(appointmentId);
  const upload = useUploadReceipt(appointmentId);
  const cancel = useCancelAppointment(appointmentId);

  if (isLoading) return <LoadingBlock />;
  if (isError || !appointment) return <ErrorState error={error} onRetry={() => void refetch()} />;

  const nextTreatment =
    params.get('treatmentId') && appointment.status !== 'EXPIRED' && appointment.status !== 'CANCELLED'
      ? params.toString()
      : null;

  return (
    <div className="space-y-4">
      <Link to="/mi-cuenta" className="text-sm text-primary hover:underline">
        ← Mis turnos
      </Link>
      <AppointmentTrackingView
        appointment={appointment}
        banner={nextTreatment ? <TreatmentContinueBanner nextQuery={nextTreatment} /> : undefined}
        onUpload={(file) => upload.mutate(file)}
        isUploading={upload.isPending}
        uploadError={upload.isError ? getErrorMessage(upload.error) : null}
        onHoldExpired={() => void refetch()}
        restartHref={repeatBookingHref(appointment)}
        actions={
          <>
            <ButtonLink to={repeatBookingHref(appointment)} variant="soft">
              Repetir turno
            </ButtonLink>
            <ClientCancelButton
              appointment={appointment}
              isPending={cancel.isPending}
              errorMessage={cancel.isError ? getErrorMessage(cancel.error) : null}
              onCancel={(reason, done) => cancel.mutate(reason, { onSuccess: done })}
            />
          </>
        }
      />
    </div>
  );
}
