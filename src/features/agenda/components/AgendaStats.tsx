import { CalendarDays, ClipboardList } from 'lucide-react';
import { occupancyPercent, type AgendaDaySummary } from '@/domain';
import { StatCard } from '@/shared/ui';

/** Tarjetas superiores: "TURNOS HOY" y "SEÑAS PENDIENTES". */
export function AgendaStats({ summary, isToday }: { summary: AgendaDaySummary; isToday: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:max-w-3xl">
      <StatCard
        label={isToday ? 'Turnos hoy' : 'Turnos del día'}
        value={summary.appointments}
        suffix={`/ ${occupancyPercent(summary.bookedMinutes, summary.capacityMinutes)}% ocupación`}
        icon={<CalendarDays className="size-6" />}
      />
      <StatCard
        label="Señas pendientes"
        value={summary.pendingDeposits}
        suffix="por validar"
        icon={<ClipboardList className="size-6" />}
        tone="warning"
      />
    </div>
  );
}
