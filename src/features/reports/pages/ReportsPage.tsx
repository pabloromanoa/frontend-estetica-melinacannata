import { useState, type FormEvent } from 'react';
import { BarChart3, FileDown } from 'lucide-react';
import { addDays, REPORT_TYPES, toDateKey, type ReportType } from '@/domain';
import { getErrorMessage } from '@/shared/api';
import {
  Alert,
  Button,
  Card,
  ErrorState,
  FormField,
  Input,
  LoadingBlock,
  PageHeader,
  Select,
} from '@/shared/ui';
import type { ReportParams } from '../api/reports-api';
import { ReportView } from '../components/ReportView';
import { useExportReportPdf, useReport } from '../hooks/useReports';

const REPORT_LABEL: Record<ReportType, string> = {
  appointments: 'Turnos',
  services: 'Servicios',
  providers: 'Profesionales',
  cancellations: 'Cancelaciones',
  'agenda-efficiency': 'Eficiencia de agenda',
  recommendations: 'Recomendaciones',
};
const DEFAULT_RANGE_DAYS = 30;

export function ReportsPage() {
  const today = toDateKey(new Date());
  const [draft, setDraft] = useState<ReportParams>({
    type: 'appointments',
    from: addDays(today, -DEFAULT_RANGE_DAYS),
    to: today,
  });
  const [params, setParams] = useState<ReportParams | null>(null);
  const report = useReport(params);
  const exportPdf = useExportReportPdf();
  const invalidRange = draft.from > draft.to;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!invalidRange) setParams(draft);
  };

  return (
    <>
      <PageHeader
        title="Informes"
        icon={<BarChart3 className="size-7" />}
        description="Elegí el tipo de informe y el rango de fechas."
      />
      <Card className="mb-6">
        <form onSubmit={submit} className="grid items-end gap-4 md:grid-cols-[2fr_1fr_1fr_auto_auto]">
          <FormField label="Tipo de informe" htmlFor="report-type">
            <Select
              id="report-type"
              value={draft.type}
              onChange={(e) => setDraft({ ...draft, type: e.target.value as ReportType })}
            >
              {REPORT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {REPORT_LABEL[type]}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Desde" htmlFor="report-from">
            <Input
              id="report-from"
              type="date"
              value={draft.from}
              onChange={(e) => setDraft({ ...draft, from: e.target.value })}
            />
          </FormField>
          <FormField
            label="Hasta"
            htmlFor="report-to"
            error={invalidRange ? 'Debe ser posterior a "Desde".' : undefined}
          >
            <Input
              id="report-to"
              type="date"
              value={draft.to}
              onChange={(e) => setDraft({ ...draft, to: e.target.value })}
            />
          </FormField>
          <Button type="submit" disabled={invalidRange}>
            Generar
          </Button>
          <Button
            variant="secondary"
            disabled={invalidRange}
            loading={exportPdf.isPending}
            onClick={() => exportPdf.mutate(draft)}
            leftIcon={<FileDown className="size-4" aria-hidden />}
          >
            Exportar PDF
          </Button>
        </form>
        {exportPdf.isError && (
          <Alert tone="danger" className="mt-4">
            {getErrorMessage(exportPdf.error)}
          </Alert>
        )}
      </Card>
      {report.isLoading && <LoadingBlock label="Generando informe…" />}
      {report.isError && <ErrorState error={report.error} onRetry={() => void report.refetch()} />}
      {report.isSuccess && <ReportView data={report.data} />}
    </>
  );
}
