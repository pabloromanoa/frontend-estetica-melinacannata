import { normalizeReport, type CellValue } from '@/domain';
import { Card, EmptyState } from '@/shared/ui';

const formatCell = (value: CellValue): string => {
  if (value === null) return '—';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (typeof value === 'number') return value.toLocaleString('es-AR');
  return value;
};

/** Render genérico del JSON del informe (resumen clave/valor + tablas). */
export function ReportView({ data }: { data: unknown }) {
  const report = normalizeReport(data);
  if (report.summary.length === 0 && report.tables.length === 0)
    return <EmptyState title="El informe no tiene datos para el período" />;
  return (
    <div className="space-y-6">
      {report.summary.length > 0 && (
        <Card>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {report.summary.map((item) => (
              <div key={item.label} className="rounded-xl bg-surface-muted p-3">
                <dt className="text-xs text-ink-soft">{item.label}</dt>
                <dd className="text-lg font-semibold text-ink">{formatCell(item.value)}</dd>
              </div>
            ))}
          </dl>
        </Card>
      )}
      {report.tables.map((table) => (
        <Card key={table.title}>
          <h2 className="mb-3 font-semibold text-ink">{table.title}</h2>
          {table.rows.length === 0 ? (
            <p className="text-sm text-ink-soft">Sin filas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs tracking-wide text-ink-soft uppercase">
                  <tr>
                    {table.columns.map((column) => (
                      <th key={column} scope="col" className="py-2 pr-4">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {table.rows.map((row) => (
                    <tr key={row.key}>
                      {table.columns.map((column, cellIndex) => (
                        <td key={column} className="py-2 pr-4">
                          {formatCell(row.cells[cellIndex] ?? null)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
