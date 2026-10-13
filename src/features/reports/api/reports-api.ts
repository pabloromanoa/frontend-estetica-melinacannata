import type { DateKey, ReportType } from '@/domain';
import { httpClient } from '@/shared/api';

export interface ReportParams {
  type: ReportType;
  from: DateKey;
  to: DateKey;
}

export const reportsApi = {
  json: ({ type, from, to }: ReportParams) =>
    httpClient.get<unknown>(`/admin/reports/${type}`, { query: { from, to } }),
  pdf: ({ type, from, to }: ReportParams) =>
    httpClient.getBlob(`/admin/reports/${type}/pdf`, { query: { from, to } }),
};
