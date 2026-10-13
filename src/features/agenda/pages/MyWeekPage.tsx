import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { CalendarRange } from 'lucide-react';
import {
  addDays,
  startOfWeek,
  toBusinessHours,
  toCalendarEvents,
  zonedToUtcIso,
  type DateKey,
} from '@/domain';
import { useAdminProviders } from '@/features/admin-providers';
import { useAppointmentsList } from '@/features/appointment-tracking';
import { useAuth } from '@/features/auth';
import { useWeeklyAvailability } from '@/features/availability';
import { Card, ErrorState, FormField, PageHeader, Select, Spinner } from '@/shared/ui';
import { WeekCalendar } from '../components/WeekCalendar';
import { useDateParam } from '@/shared/hooks';

const DAYS_PER_WEEK = 7;

/** Agenda semanal (`/panel/mi-agenda`). PROVIDER ve la suya; ADMIN puede filtrar por profesional. */
export function MyWeekPage() {
  const navigate = useNavigate();
  const { isAdmin, isProvider } = useAuth();
  const { date } = useDateParam();
  const [range, setRange] = useState<{ from: DateKey; to: DateKey }>(() => {
    const from = startOfWeek(date);
    return { from, to: addDays(from, DAYS_PER_WEEK) };
  });
  const [providerId, setProviderId] = useState<string>('');
  const providers = useAdminProviders(isAdmin);
  const weekly = useWeeklyAvailability({ kind: 'self' }, isProvider && !providerId);
  const appointments = useAppointmentsList({
    from: zonedToUtcIso(range.from),
    to: zonedToUtcIso(range.to),
    providerId: providerId || undefined,
  });
  const events = useMemo(() => toCalendarEvents(appointments.data ?? [], new Date()), [appointments.data]);

  return (
    <>
      <PageHeader
        title="Agenda Semanal"
        icon={<CalendarRange className="size-7" />}
        description="Tus turnos de la semana. Hacé clic en un turno para ver su seguimiento."
        actions={
          <>
            {appointments.isFetching && <Spinner className="text-primary" />}
            {isAdmin && (
              <FormField label="Profesional" htmlFor="week-provider">
                <Select
                  id="week-provider"
                  value={providerId}
                  onChange={(e) => setProviderId(e.target.value)}
                  className="w-60"
                >
                  <option value="">Todas las profesionales</option>
                  {providers.data?.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.displayName}
                    </option>
                  ))}
                </Select>
              </FormField>
            )}
          </>
        }
      />
      {appointments.isError && (
        <ErrorState error={appointments.error} onRetry={() => void appointments.refetch()} />
      )}
      <Card>
        <WeekCalendar
          initialDate={date}
          events={events}
          businessHours={weekly.data ? toBusinessHours(weekly.data) : undefined}
          onRangeChange={(from, to) => setRange({ from, to })}
          onEventClick={(id) => void navigate(`/panel/turnos/${id}`)}
        />
      </Card>
    </>
  );
}
