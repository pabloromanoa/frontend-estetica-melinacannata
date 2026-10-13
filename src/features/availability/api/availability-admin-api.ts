import type {
  AvailabilityException,
  BankDetails,
  NewAvailabilityException,
  Provider,
  WeeklyAvailabilityRange,
} from '@/domain';
import { httpClient } from '@/shared/api';

/**
 * El mismo set de operaciones existe para el prestador logueado (`/staff/me`) y para ADMIN sobre
 * cualquier prestador (`/admin/providers/:id`). El "scope" elige la base (DIP: los hooks no conocen las URLs).
 */
export type ProviderScope = { kind: 'self' } | { kind: 'admin'; providerId: string };

export const scopeKey = (scope: ProviderScope): string => (scope.kind === 'self' ? 'me' : scope.providerId);
const base = (scope: ProviderScope): string =>
  scope.kind === 'self' ? '/staff/me' : `/admin/providers/${scope.providerId}`;

export const staffAvailabilityApi = {
  /** Sólo existe para `self` (GET /staff/me). Para ADMIN el perfil sale de GET /admin/providers. */
  me: () => httpClient.get<Provider>('/staff/me'),
  updateBankDetails: (scope: ProviderScope, bankDetails: BankDetails) =>
    httpClient.put<Provider>(`${base(scope)}/bank-details`, bankDetails),
  updateServices: (scope: ProviderScope, serviceIds: string[]) =>
    httpClient.put<Provider>(`${base(scope)}/services`, { serviceIds }),
  weekly: (scope: ProviderScope) =>
    httpClient.get<WeeklyAvailabilityRange[]>(`${base(scope)}/weekly-availability`),
  saveWeekly: (scope: ProviderScope, ranges: WeeklyAvailabilityRange[]) =>
    httpClient.put<WeeklyAvailabilityRange[]>(`${base(scope)}/weekly-availability`, { ranges }),
  exceptions: (scope: ProviderScope, range: { from?: string; to?: string }) =>
    httpClient.get<AvailabilityException[]>(`${base(scope)}/exceptions`, { query: range }),
  createException: (scope: ProviderScope, input: NewAvailabilityException) =>
    httpClient.post<AvailabilityException>(`${base(scope)}/exceptions`, input),
  deleteException: (scope: ProviderScope, id: string) => httpClient.delete(`${base(scope)}/exceptions/${id}`),
};
