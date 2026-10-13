import type { Appointment, DepositInboxItem, DepositInboxMeta, DepositStatus } from '@/domain';
import { httpClient } from '@/shared/api';

export const depositsApi = {
  inbox: (status: DepositStatus) =>
    httpClient.getWithMeta<DepositInboxItem[], DepositInboxMeta>('/deposits', { query: { status } }),
  /** PDF del comprobante (stream autenticado por cookie): se descarga como Blob. */
  receipt: (depositId: string) => httpClient.getBlob(`/deposits/${depositId}/receipt`),
  verify: (depositId: string) => httpClient.post<Appointment>(`/deposits/${depositId}/verify`),
  reject: (depositId: string, reason: string) =>
    httpClient.post<Appointment>(`/deposits/${depositId}/reject`, { reason }),
};
