import { useQuery } from '@tanstack/react-query';
import type { DateKey } from '@/domain';
import { queryKeys } from '@/shared/api';
import { agendaApi } from '../api/agenda-api';

export function useAgendaDay(date: DateKey) {
  return useQuery({ queryKey: queryKeys.agenda.day(date), queryFn: () => agendaApi.day(date) });
}
