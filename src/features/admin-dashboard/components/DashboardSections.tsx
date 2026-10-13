import { CalendarCheck, Gauge, TrendingUp, Wallet } from 'lucide-react';
import { formatARS, formatDuration, type Dashboard, type MoneyByPeriod } from '@/domain';
import { Card, CardHeader } from '@/shared/ui';
import { MetricTile } from './MetricTile';

const PERIODS: Array<{ key: keyof MoneyByPeriod; label: string }> = [
  { key: 'today', label: 'Hoy' },
  { key: 'last24h', label: 'Últimas 24 h' },
  { key: 'week', label: 'Semana' },
  { key: 'month', label: 'Mes' },
];

export function DailySection({ daily }: { daily: Dashboard['daily'] }) {
  return (
    <Card>
      <CardHeader title="Hoy" icon={<CalendarCheck className="size-5" />} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <MetricTile label="Turnos" value={daily.appointmentsToday} />
        <MetricTile label="Pagos informados" value={daily.paymentsInformed} />
        <MetricTile label="Pendientes de revisión" value={daily.paymentsPendingReview} />
        <MetricTile label="Señas verificadas" value={daily.paymentsVerified} />
        <MetricTile label="Señas rechazadas" value={daily.paymentsRejected} />
        <MetricTile label="Cancelaciones" value={daily.cancellationsToday} />
      </div>
    </Card>
  );
}

export function OccupancySection({ occupancy, monthly }: Pick<Dashboard, 'occupancy' | 'monthly'>) {
  return (
    <Card>
      <CardHeader title="Ocupación y mes" icon={<Gauge className="size-5" />} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <MetricTile label="Ocupación hoy" value={`${occupancy.todayPercent}%`} />
        <MetricTile label="Ocupación semana" value={`${occupancy.weekPercent}%`} />
        <MetricTile
          label="Huecos entre turnos hoy"
          value={formatDuration(occupancy.freeMinutesBetweenAppointmentsToday)}
        />
        <MetricTile label="Servicios del mes" value={monthly.servicesPerformed} />
        <MetricTile label="Clientes únicos" value={monthly.uniqueClients} />
        <MetricTile
          label="Servicio top"
          value={monthly.topService?.name ?? '—'}
          hint={monthly.topService ? `${monthly.topService.count} veces` : undefined}
        />
      </div>
    </Card>
  );
}

export function EconomicSection({ economic }: { economic: Dashboard['economic'] }) {
  return (
    <Card>
      <CardHeader title="Económico" icon={<Wallet className="size-5" />} />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs tracking-wide text-ink-soft uppercase">
            <tr>
              <th scope="col" className="py-2 text-left">
                Concepto
              </th>
              {PERIODS.map((period) => (
                <th key={period.key} scope="col" className="py-2 text-right">
                  {period.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <th scope="row" className="py-3 text-left font-medium text-ink">
                Valor de servicios
              </th>
              {PERIODS.map((period) => (
                <td key={period.key} className="py-3 text-right">
                  {formatARS(economic.servicesValue[period.key])}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className="py-3 text-left font-medium text-ink">
                Señas verificadas
              </th>
              {PERIODS.map((period) => (
                <td key={period.key} className="py-3 text-right text-primary">
                  {formatARS(economic.verifiedDeposits[period.key])}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function ByProviderSection({ rows }: { rows: Dashboard['economic']['byProvider'] }) {
  const sorted = [...rows].sort((a, b) => b.value - a.value);
  return (
    <Card>
      <CardHeader title="Por profesional" icon={<TrendingUp className="size-5" />} />
      {sorted.length === 0 ? (
        <p className="text-sm text-ink-soft">Sin datos en el período.</p>
      ) : (
        <ul className="divide-y divide-border">
          {sorted.map((row) => (
            <li key={row.providerId} className="flex items-center justify-between gap-3 py-3">
              <span className="font-medium text-ink">{row.displayName}</span>
              <span className="text-sm text-ink-soft">
                {row.appointments} turnos · <strong className="text-ink">{formatARS(row.value)}</strong>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
