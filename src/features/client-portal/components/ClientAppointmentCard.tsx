import { Link } from 'react-router';
import { CalendarDays, RotateCcw } from 'lucide-react';
import { formatARS, formatDateTimeLong, repeatBookingHref, type Appointment } from '@/domain';
import { ButtonLink, StatusBadge } from '@/shared/ui';

export function ClientAppointmentCard({ appointment }: { appointment: Appointment }) {
  return (
    <article className="flex flex-wrap items-center gap-4 rounded-2xl bg-surface p-5 shadow-card">
      <span aria-hidden className="grid size-12 place-items-center rounded-xl bg-primary-soft text-primary">
        <CalendarDays className="size-6" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-ink">
            <Link to={`/mi-cuenta/turnos/${appointment.id}`} className="hover:text-primary">
              {appointment.service.name}
            </Link>
          </h3>
          <StatusBadge status={appointment.status} full />
        </div>
        <p className="text-sm text-ink-soft">
          {formatDateTimeLong(appointment.startAt)} · {appointment.provider.displayName} ·{' '}
          {formatARS(appointment.price)}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <ButtonLink to={`/mi-cuenta/turnos/${appointment.id}`} variant="secondary" size="sm">
          Ver detalle
        </ButtonLink>
        <ButtonLink
          to={repeatBookingHref(appointment)}
          variant="soft"
          size="sm"
          leftIcon={<RotateCcw className="size-4" aria-hidden />}
        >
          Repetir turno
        </ButtonLink>
      </div>
    </article>
  );
}
