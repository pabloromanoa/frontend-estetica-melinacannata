import { useSearchParams } from 'react-router';
import { toDateKey, type DateKey } from '@/domain';

const DATE_PARAM = 'fecha';
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Fecha seleccionada (agenda / topbar), guardada en `?fecha=YYYY-MM-DD` para que sea compartible. */
export function useDateParam(): { date: DateKey; today: DateKey; isToday: boolean } {
  const [params] = useSearchParams();
  const today = toDateKey(new Date());
  const raw = params.get(DATE_PARAM);
  const date = raw && DATE_PATTERN.test(raw) ? raw : today;
  return { date, today, isToday: date === today };
}

export const DATE_SEARCH_PARAM = DATE_PARAM;
