import { useParams, useSearchParams } from 'react-router';
import { buildGuestLink, repeatBookingHref } from '@/domain';
import {
  AppointmentTrackingView,
  ClientCancelButton,
  TreatmentContinueBanner,
} from '@/features/appointment-tracking';
import { getErrorMessage } from '@/shared/api';
import { ErrorState, LoadingBlock } from '@/shared/ui';
import { GuestLinkBanner } from '../components/GuestLinkBanner';
import { useGuestAppointment, useGuestCancel, useGuestUploadReceipt } from '../hooks/useGuestAppointment';

/** Enlace privado del invitado: `/turno/:token`. Puede ver estado, subir comprobante y cancelar (no reprogramar). */
export function GuestAppointmentPage() {
  const { token = '' } = useParams();
  const [params] = useSearchParams();
  const { data: appointment, isLoading, isError, error, refetch } = useGuestAppointment(token);
  const upload = useGuestUploadReceipt(token);
  const cancel = useGuestCancel(token);

  if (isLoading) return <LoadingBlock label="Buscando tu turno…" />;
  if (isError || !appointment) {
    return (
      <ErrorState
        error={error}
        title="No encontramos el turno. Revisá que el enlace esté completo."
        onRetry={() => void refetch()}
      />
    );
  }

  const nextTreatment =
    params.get('treatmentId') && appointment.status !== 'EXPIRED' && appointment.status !== 'CANCELLED'
      ? params.toString()
      : null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-ink">Tu turno</h1>
      <AppointmentTrackingView
        appointment={appointment}
        banner={
          <>
            <GuestLinkBanner link={buildGuestLink(window.location.origin, token)} />
            {nextTreatment && <TreatmentContinueBanner nextQuery={nextTreatment} />}
          </>
        }
        onUpload={(file) => upload.mutate(file)}
        isUploading={upload.isPending}
        uploadError={upload.isError ? getErrorMessage(upload.error) : null}
        onHoldExpired={() => void refetch()}
        restartHref={repeatBookingHref(appointment)}
        actions={
          <ClientCancelButton
            appointment={appointment}
            isPending={cancel.isPending}
            errorMessage={cancel.isError ? getErrorMessage(cancel.error) : null}
            onCancel={(reason, done) => cancel.mutate(reason, { onSuccess: done })}
          />
        }
      />
    </div>
  );
}
