import { Link } from 'react-router';
import { formatDateTimeLong, type Appointment } from '@/domain';
import { EmptyState, StatusBadge } from '@/shared/ui';

export function AppointmentsTable({ appointments }: { appointments: readonly Appointment[] }) {
  if (appointments.length === 0) return <EmptyState title="No hay turnos para estos filtros" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-ink-soft">
          <tr>
            <th scope="col" className="py-2 pr-4">
              Turno
            </th>
            <th scope="col" className="py-2 pr-4">
              Paciente
            </th>
            <th scope="col" className="py-2 pr-4">
              Fecha
            </th>
            <th scope="col" className="py-2 pr-4">
              Servicio
            </th>
            <th scope="col" className="py-2 pr-4">
              Profesional
            </th>
            <th scope="col" className="py-2">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td className="py-3 pr-4">
                <Link
                  to={`/panel/turnos/${appointment.id}`}
                  className="font-mono text-xs text-primary hover:underline"
                >
                  #{appointment.code}
                </Link>
              </td>
              <td className="py-3 pr-4">
                <span className="block font-medium text-ink">
                  {appointment.client.firstName} {appointment.client.lastName}
                </span>
                <span className="text-xs text-ink-soft">{appointment.client.phone}</span>
              </td>
              <td className="py-3 pr-4">{formatDateTimeLong(appointment.startAt)}</td>
              <td className="py-3 pr-4">{appointment.service.name}</td>
              <td className="py-3 pr-4">{appointment.provider.displayName}</td>
              <td className="py-3">
                <StatusBadge status={appointment.status} full />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
