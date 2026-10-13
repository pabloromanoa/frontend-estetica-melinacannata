import type { ReactNode } from 'react';
import { CalendarDays, Flower2, PenLine, UserRound } from 'lucide-react';
import { DEPOSIT_OUTCOME_LABEL, formatARS, formatDateTimeLong, type Appointment } from '@/domain';
import { Alert, Badge, Card, CardHeader, InfoTile, StatusBadge } from '@/shared/ui';

interface AppointmentDetailCardProps {
  appointment: Appointment;
  /** Muestra los datos del paciente (vista staff). */
  showClient?: boolean;
  actions?: ReactNode;
}

/** "Detalle de la Cita" del prototipo de Seguimiento. */
export function AppointmentDetailCard({
  appointment,
  showClient = false,
  actions,
}: AppointmentDetailCardProps) {
  const { service, provider, client } = appointment;
  return (
    <Card>
      <CardHeader
        title="Detalle de la Cita"
        icon={<Flower2 className="size-5" />}
        subtitle={`Turno #${appointment.code}`}
        actions={
          <>
            <StatusBadge status={appointment.status} full />
            <Badge>{service.durationMinutes} min</Badge>
          </>
        }
      />
      <div className="space-y-3">
        <InfoTile icon={<PenLine className="size-5" />} label="Tratamiento" title={service.name} />
        <InfoTile
          icon={<CalendarDays className="size-5" />}
          label="Fecha & horario"
          title={formatDateTimeLong(appointment.startAt)}
          detail={
            appointment.rescheduled
              ? `Reprogramado${appointment.rescheduleReason ? `: ${appointment.rescheduleReason}` : ''}`
              : undefined
          }
        />
        <InfoTile
          icon={<UserRound className="size-5" />}
          label="Profesional"
          title={provider.displayName}
          detail={provider.specialty ?? undefined}
        />
        {showClient && (
          <InfoTile
            icon={<UserRound className="size-5" />}
            label="Paciente"
            title={`${client.firstName} ${client.lastName}`}
            detail={`DNI ${client.dni} · ${client.phone}${client.email ? ` · ${client.email}` : ''}`}
          />
        )}
        <div className="flex items-center justify-between rounded-xl bg-surface-muted px-4 py-3">
          <span className="text-ink-soft">Saldo a abonar en recepción:</span>
          <span className="text-lg font-semibold text-ink">{formatARS(appointment.remainingAmount)} ARS</span>
        </div>
        {appointment.status === 'CANCELLED' && (
          <Alert tone="neutral" title="Turno cancelado">
            {appointment.cancellationReason && <p>Motivo: {appointment.cancellationReason}</p>}
            {appointment.depositOutcome && <p>Seña: {DEPOSIT_OUTCOME_LABEL[appointment.depositOutcome]}</p>}
          </Alert>
        )}
      </div>
      {actions && <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">{actions}</div>}
    </Card>
  );
}
