import type { AgendaDay } from '@/domain';
import { Card } from '@/shared/ui';

/** "Resumen del Día". */
export function DaySummaryCard({ agenda }: { agenda: AgendaDay }) {
  const { summary } = agenda;
  const activeProviders = agenda.providers.filter((provider) => provider.workingRanges.length > 0).length;
  const rows: Array<[string, string, boolean]> = [
    ['Turnos agendados', `${summary.appointments} turnos`, false],
    ['Especialistas activas', `${activeProviders} en simultáneo`, false],
    ['Señas por validar', `${summary.pendingDeposits} pendientes`, true],
    ['Huecos disponibles', `${summary.freeGaps} espacios`, true],
  ];
  return (
    <Card className="p-5">
      <h2 className="mb-3 border-b border-border pb-3 text-lg font-semibold text-ink">Resumen del Día</h2>
      <dl className="space-y-3">
        {rows.map(([label, value, highlight]) => (
          <div key={label} className="flex justify-between gap-3 text-sm">
            <dt className="text-ink-soft">{label}</dt>
            <dd className={highlight ? 'font-medium text-primary' : 'font-medium text-ink'}>{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
