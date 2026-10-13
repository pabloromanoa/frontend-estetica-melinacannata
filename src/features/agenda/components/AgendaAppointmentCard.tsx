import { Link } from 'react-router';
import { clientFullName, formatARS, formatTimeRange, getStatusMeta, type Appointment } from '@/domain';
import { cn } from '@/shared/lib/cn';
import { TONE_CARD_CLASSES } from '@/shared/lib/tone-classes';
import { StatusBadge } from '@/shared/ui';

/** Tarjeta de turno en la Agenda Diaria, coloreada por estado. */
export function AgendaAppointmentCard({ appointment }: { appointment: Appointment }) {
  const meta = getStatusMeta(appointment.status);
  const name = clientFullName(appointment.client);
  const range = formatTimeRange(appointment.startAt, appointment.endAt);
  return (
    <Link
      to={`/panel/turnos/${appointment.id}`}
      aria-label={`${name}, ${appointment.service.name}, ${range}, ${meta.label}`}
      className={cn(
        'flex h-full min-h-0 flex-col overflow-hidden rounded-xl border-l-4 p-3 transition-shadow hover:shadow-card',
        TONE_CARD_CLASSES[meta.tone],
      )}
    >
      <span className="flex items-start justify-between gap-2">
        <span className="truncate text-base font-medium text-ink">{name}</span>
        <StatusBadge status={appointment.status} />
      </span>
      <span className="truncate text-sm text-ink-soft">{appointment.service.name}</span>
      {appointment.status === 'CREATED' ? (
        <span className="mt-auto truncate text-sm text-danger">Por abonar seña</span>
      ) : appointment.status === 'PAYMENT_INFORMED' ? (
        <span className="mt-auto truncate text-sm text-ink-soft">
          {formatARS(appointment.depositAmount)} • Transf. pendiente
        </span>
      ) : (
        <span className="mt-auto truncate text-sm text-ink-soft">{range}</span>
      )}
    </Link>
  );
}
