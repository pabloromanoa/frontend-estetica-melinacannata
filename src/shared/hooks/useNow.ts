import { useEffect, useState } from 'react';
import { CLOCK_TICK_MS } from '@/config/constants';

/** Fecha actual que se re-renderiza cada `intervalMs` (para countdowns y relojes). */
export function useNow(intervalMs: number = CLOCK_TICK_MS): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
