import type { AgendaDay, DateKey } from '@/domain';
import { httpClient } from '@/shared/api';

export const agendaApi = {
  day: (date: DateKey) => httpClient.get<AgendaDay>('/agenda/day', { query: { date } }),
};
