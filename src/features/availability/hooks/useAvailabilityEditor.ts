import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AFTERNOON_PRESET, MORNING_PRESET } from '@/config/constants';
import {
  createEmptyMatrix,
  DAYS_OF_WEEK,
  fillRange,
  findMisalignedRanges,
  hasAvailability,
  matricesEqual,
  matrixToRanges,
  rangesToMatrix,
  setCell,
  type AvailabilityMatrix,
  type DayOfWeek,
  type WeeklyAvailabilityRange,
} from '@/domain';

const SUNDAY: DayOfWeek = 0;

/**
 * Estado de edición de la matriz semanal (clic y arrastre). Toda la conversión matriz ⇄ rangos
 * vive en `domain/availability-matrix`; acá sólo se orquesta la interacción.
 */
export function useAvailabilityEditor(serverRanges: readonly WeeklyAvailabilityRange[] | undefined) {
  const initial = useMemo(
    () => (serverRanges ? rangesToMatrix(serverRanges) : createEmptyMatrix()),
    [serverRanges],
  );
  const [matrix, setMatrix] = useState<AvailabilityMatrix>(initial);
  const [includeSunday, setIncludeSunday] = useState(false);
  const paint = useRef<boolean | null>(null);

  useEffect(() => {
    setMatrix(initial);
    setIncludeSunday(hasAvailability(initial, SUNDAY));
  }, [initial]);

  useEffect(() => {
    const stop = () => {
      paint.current = null;
    };
    window.addEventListener('pointerup', stop);
    return () => window.removeEventListener('pointerup', stop);
  }, []);

  const startPaint = useCallback((day: DayOfWeek, index: number) => {
    setMatrix((current) => {
      const value = !current[day]?.[index];
      paint.current = value;
      return setCell(current, day, index, value);
    });
  }, []);

  const continuePaint = useCallback((day: DayOfWeek, index: number) => {
    const value = paint.current;
    if (value === null) return;
    setMatrix((current) => setCell(current, day, index, value));
  }, []);

  const workDays = DAYS_OF_WEEK.filter((day) => day !== SUNDAY || includeSunday);

  return {
    matrix,
    dirty: !matricesEqual(matrix, initial),
    includeSunday,
    misaligned: serverRanges ? findMisalignedRanges(serverRanges) : [],
    startPaint,
    continuePaint,
    toggleSunday: (value: boolean) => {
      setIncludeSunday(value);
      if (!value) setMatrix((current) => fillRange(current, [SUNDAY], '00:00', '23:59', false));
    },
    applyMornings: () =>
      setMatrix((current) => fillRange(current, workDays, MORNING_PRESET.start, MORNING_PRESET.end, true)),
    applyAfternoons: () =>
      setMatrix((current) =>
        fillRange(current, workDays, AFTERNOON_PRESET.start, AFTERNOON_PRESET.end, true),
      ),
    reset: () => setMatrix(initial),
    toRanges: () =>
      matrixToRanges(includeSunday ? matrix : fillRange(matrix, [SUNDAY], '00:00', '23:59', false)),
  };
}

export type AvailabilityEditor = ReturnType<typeof useAvailabilityEditor>;
