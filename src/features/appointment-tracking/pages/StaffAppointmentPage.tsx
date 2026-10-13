import { useState } from 'react';
import { useParams } from 'react-router';
import { ExternalLink } from 'lucide-react';
import { useReceiptBlob } from '@/features/deposits';
import { ErrorState, LoadingBlock, PageHeader, PdfViewerModal } from '@/shared/ui';
import { AppointmentTrackingView } from '../components/AppointmentTrackingView';
import { StaffAppointmentActions } from '../components/StaffAppointmentActions';
import { useAppointment } from '../hooks/useAppointments';

/** Seguimiento de un turno para el staff (`/panel/turnos/:id`). */
export function StaffAppointmentPage() {
  const { appointmentId } = useParams();
  const { data: appointment, isLoading, isError, error, refetch } = useAppointment(appointmentId);
  const [viewerOpen, setViewerOpen] = useState(false);
  const receipt = useReceiptBlob(appointment?.deposit?.id, viewerOpen);

  if (isLoading) return <LoadingBlock />;
  if (isError || !appointment) return <ErrorState error={error} onRetry={() => void refetch()} />;

  return (
    <>
      <PageHeader
        title="Seguimiento Cliente"
        icon={<ExternalLink className="size-7" />}
        description={`${appointment.client.firstName} ${appointment.client.lastName} · Turno #${appointment.code}`}
      />
      <AppointmentTrackingView
        appointment={appointment}
        showClient
        actions={<StaffAppointmentActions appointment={appointment} />}
        onHoldExpired={() => void refetch()}
        onViewReceipt={appointment.deposit ? () => setViewerOpen(true) : undefined}
      />
      <PdfViewerModal
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        title={`Comprobante del turno #${appointment.code}`}
        blob={receipt.data}
        isLoading={receipt.isLoading}
        error={receipt.error}
        onRetry={() => void receipt.refetch()}
      />
    </>
  );
}
