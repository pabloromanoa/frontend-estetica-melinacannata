import type { AppointmentStatus, DateKey, DepositStatus, ReportType } from '@/domain';
import type { QueryParams } from './http-client';

/**
 * Fábrica central de query keys de TanStack Query.
 * Mantenerlas en un solo lugar evita typos y permite invalidar por prefijo (`queryKeys.appointments.all`).
 */
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  catalog: {
    all: ['catalog'] as const,
    categories: ['catalog', 'categories'] as const,
    services: (filters: { categoryId?: string; search?: string } = {}) =>
      ['catalog', 'services', filters] as const,
    service: (id: string) => ['catalog', 'service', id] as const,
    treatment: (id: string) => ['catalog', 'treatment', id] as const,
  },
  availability: {
    all: ['availability'] as const,
    slots: (params: { serviceId: string; date: DateKey; providerId?: string }) =>
      ['availability', 'slots', params] as const,
    nextSlots: (params: QueryParams) => ['availability', 'next-slots', params] as const,
  },
  appointments: {
    all: ['appointments'] as const,
    list: (params: {
      from: string;
      to: string;
      providerId?: string;
      status?: AppointmentStatus[];
      search?: string;
    }) => ['appointments', 'list', params] as const,
    detail: (id: string) => ['appointments', 'detail', id] as const,
    guest: (token: string) => ['appointments', 'guest', token] as const,
    mine: ['appointments', 'mine'] as const,
  },
  agenda: {
    all: ['agenda'] as const,
    day: (date: DateKey) => ['agenda', 'day', date] as const,
  },
  deposits: {
    all: ['deposits'] as const,
    inbox: (status: DepositStatus) => ['deposits', 'inbox', status] as const,
    receipt: (depositId: string) => ['deposits', 'receipt', depositId] as const,
  },
  staff: {
    all: ['staff'] as const,
    profile: (scope: string) => ['staff', scope, 'profile'] as const,
    weekly: (scope: string) => ['staff', scope, 'weekly'] as const,
    exceptions: (scope: string, range: { from?: string; to?: string }) =>
      ['staff', scope, 'exceptions', range] as const,
  },
  recommendations: {
    all: ['recommendations'] as const,
    questionnaire: ['recommendations', 'questionnaire'] as const,
    mine: ['recommendations', 'mine'] as const,
  },
  admin: {
    services: ['admin', 'services'] as const,
    service: (id: string) => ['admin', 'services', id] as const,
    categories: ['admin', 'categories'] as const,
    treatments: ['admin', 'treatments'] as const,
    treatment: (id: string) => ['admin', 'treatments', id] as const,
    providers: ['admin', 'providers'] as const,
    clients: (search: string) => ['admin', 'clients', search] as const,
    client: (id: string) => ['admin', 'client', id] as const,
    dashboard: ['admin', 'dashboard'] as const,
    report: (type: ReportType, from: DateKey, to: DateKey) => ['admin', 'report', type, from, to] as const,
  },
};
