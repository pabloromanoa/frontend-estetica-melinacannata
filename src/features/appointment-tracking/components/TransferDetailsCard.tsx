import type { ReactNode } from 'react';
import { Banknote } from 'lucide-react';
import { formatARS, type Appointment } from '@/domain';
import { Card, CardHeader, CopyButton } from '@/shared/ui';

/** "Datos de Transferencia": alias/CBU del prestador, titular, CUIL, banco y monto exacto de la seña. */
export function TransferDetailsCard({
  appointment,
  children,
}: {
  appointment: Appointment;
  children?: ReactNode;
}) {
  const bank = appointment.provider.bankDetails;
  const field = (label: string, value: ReactNode) => (
    <div>
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd className="text-ink">{value ?? '—'}</dd>
    </div>
  );
  return (
    <Card>
      <CardHeader title="Datos de Transferencia" icon={<Banknote className="size-5" />} />
      {bank.alias && (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-muted p-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-ink-soft">Alias bancario</p>
            <p className="truncate font-mono text-xl font-semibold text-primary">{bank.alias}</p>
          </div>
          <CopyButton value={bank.alias} description="alias" variant="primary" />
        </div>
      )}
      <dl className="mt-4 grid grid-cols-2 gap-4 border-b border-border pb-4">
        {field('Titular:', bank.holder)}
        {field('CUIL:', bank.cuil)}
        {field('Entidad:', bank.bankName)}
        {field(
          'Monto exacto:',
          <span className="font-semibold text-primary">{formatARS(appointment.depositAmount)} ARS</span>,
        )}
        {bank.cbu && (
          <div className="col-span-2 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <dt className="text-sm text-ink-soft">CBU:</dt>
              <dd className="truncate font-mono text-sm text-ink">{bank.cbu}</dd>
            </div>
            <CopyButton value={bank.cbu} description="CBU" />
          </div>
        )}
      </dl>
      {children && (
        <div className="mt-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-ink-soft">Comprobante</p>
          {children}
        </div>
      )}
    </Card>
  );
}
