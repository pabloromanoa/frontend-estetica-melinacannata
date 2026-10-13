import { useMutation, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api';
import { downloadBlob } from '@/shared/lib/download';
import { reportsApi, type ReportParams } from '../api/reports-api';

export function useReport(params: ReportParams | null) {
  return useQuery({
    queryKey: params
      ? queryKeys.admin.report(params.type, params.from, params.to)
      : ['admin', 'report', 'idle'],
    queryFn: () => reportsApi.json(params as ReportParams),
    enabled: Boolean(params),
  });
}

export function useExportReportPdf() {
  return useMutation({
    mutationFn: async (params: ReportParams) => {
      const blob = await reportsApi.pdf(params);
      downloadBlob(blob, `informe-${params.type}-${params.from}-a-${params.to}.pdf`);
    },
  });
}
