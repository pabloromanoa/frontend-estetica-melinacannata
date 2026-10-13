import { AVAILABILITY_GRID_END, AVAILABILITY_GRID_START, SLOT_GRID_MINUTES } from '@/config/constants';
import { minutesToTime, timeToMinutes } from './dates';
import type { DayOfWeek, TimeOfDay, WeeklyAvailabilityRange } from './types';

/**
 * Matriz de disponibilidad semanal: 7 filas (0 = domingo … 6 = sábado), cada una con un booleano
 * por bloque de `stepMinutes` entre `start` y `end`. Es inmutable: todas las operaciones devuelven una nueva.
 */
export type AvailabilityMatrix = readonly (readonly boolean[])[];

export interface MatrixGrid {
  start: TimeOfDay;
  end: TimeOfDay;
  stepMinutes: number;
}

export const DEFAULT_GRID: MatrixGrid = {
  start: AVAILABILITY_GRID_START,
  end: AVAILABILITY_GRID_END,
  stepMinutes: SLOT_GRID_MINUTES,
};

export const DAYS_OF_WEEK: readonly DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];
/** Orden de visualización: lunes a sábado; el domingo es opcional y va al final. */
export const DISPLAY_DAYS: readonly DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0];

const MINUTES_PER_HOUR = 60;

export function slotCount(grid: MatrixGrid): number {
  return Math.max(0, Math.floor((timeToMinutes(grid.end) - timeToMinutes(grid.start)) / grid.stepMinutes));
}

/** Etiquetas `HH:mm` del inicio de cada bloque. */
export function slotLabels(grid: MatrixGrid): TimeOfDay[] {
  const startMinutes = timeToMinutes(grid.start);
  return Array.from({ length: slotCount(grid) }, (_, i) =>
    minutesToTime(startMinutes + i * grid.stepMinutes),
  );
}

export function createEmptyMatrix(grid: MatrixGrid = DEFAULT_GRID): AvailabilityMatrix {
  return DAYS_OF_WEEK.map(() => Array.from({ length: slotCount(grid) }, () => false));
}

/**
 * Rangos → matriz. Un bloque queda disponible si está completamente cubierto por algún rango.
 * Los rangos fuera de la grilla se recortan.
 */
export function rangesToMatrix(
  ranges: readonly WeeklyAvailabilityRange[],
  grid: MatrixGrid = DEFAULT_GRID,
): AvailabilityMatrix {
  const gridStart = timeToMinutes(grid.start);
  const matrix = createEmptyMatrix(grid).map((row) => [...row]);
  for (const range of ranges) {
    const row = matrix[range.dayOfWeek];
    if (!row) continue;
    const from = timeToMinutes(range.startTime);
    const to = timeToMinutes(range.endTime);
    row.forEach((_, index) => {
      const slotStart = gridStart + index * grid.stepMinutes;
      const slotEnd = slotStart + grid.stepMinutes;
      if (slotStart >= from && slotEnd <= to) row[index] = true;
    });
  }
  return matrix;
}

/** Matriz → rangos: cada tramo consecutivo de bloques disponibles es un rango. Ordenado por día y hora. */
export function matrixToRanges(
  matrix: AvailabilityMatrix,
  grid: MatrixGrid = DEFAULT_GRID,
): WeeklyAvailabilityRange[] {
  const gridStart = timeToMinutes(grid.start);
  const ranges: WeeklyAvailabilityRange[] = [];
  matrix.forEach((row, day) => {
    let runStart: number | null = null;
    const close = (endIndex: number): void => {
      if (runStart === null) return;
      ranges.push({
        dayOfWeek: day as DayOfWeek,
        startTime: minutesToTime(gridStart + runStart * grid.stepMinutes),
        endTime: minutesToTime(gridStart + endIndex * grid.stepMinutes),
      });
      runStart = null;
    };
    row.forEach((available, index) => {
      if (available && runStart === null) runStart = index;
      if (!available) close(index);
    });
    close(row.length);
  });
  return ranges;
}

/** Fija el valor de un bloque (para clic y arrastre). */
export function setCell(
  matrix: AvailabilityMatrix,
  day: DayOfWeek,
  index: number,
  value: boolean,
): AvailabilityMatrix {
  if (matrix[day]?.[index] === value) return matrix;
  return matrix.map((row, d) => (d === day ? row.map((cell, i) => (i === index ? value : cell)) : row));
}

export function toggleCell(matrix: AvailabilityMatrix, day: DayOfWeek, index: number): AvailabilityMatrix {
  return setCell(matrix, day, index, !matrix[day]?.[index]);
}

/** Marca como disponible/no disponible el rango [from, to) en los días indicados. */
export function fillRange(
  matrix: AvailabilityMatrix,
  days: readonly DayOfWeek[],
  from: TimeOfDay,
  to: TimeOfDay,
  value: boolean,
  grid: MatrixGrid = DEFAULT_GRID,
): AvailabilityMatrix {
  const gridStart = timeToMinutes(grid.start);
  const fromMin = timeToMinutes(from);
  const toMin = timeToMinutes(to);
  return matrix.map((row, day) => {
    if (!days.includes(day as DayOfWeek)) return row;
    return row.map((cell, index) => {
      const slotStart = gridStart + index * grid.stepMinutes;
      return slotStart >= fromMin && slotStart + grid.stepMinutes <= toMin ? value : cell;
    });
  });
}

/** Horas disponibles de un día (ej. 7.5). */
export function availableHours(
  matrix: AvailabilityMatrix,
  day: DayOfWeek,
  grid: MatrixGrid = DEFAULT_GRID,
): number {
  const blocks = matrix[day]?.filter(Boolean).length ?? 0;
  return (blocks * grid.stepMinutes) / MINUTES_PER_HOUR;
}

export function hasAvailability(matrix: AvailabilityMatrix, day: DayOfWeek): boolean {
  return matrix[day]?.some(Boolean) ?? false;
}

export function matricesEqual(a: AvailabilityMatrix, b: AvailabilityMatrix): boolean {
  return (
    a.length === b.length &&
    a.every((row, d) => row.length === b[d]?.length && row.every((v, i) => v === b[d]?.[i]))
  );
}

/** Detecta rangos que no encajan en la grilla de 30 min (se perderían al editar con la matriz). */
export function findMisalignedRanges(
  ranges: readonly WeeklyAvailabilityRange[],
  grid: MatrixGrid = DEFAULT_GRID,
): WeeklyAvailabilityRange[] {
  const gridStart = timeToMinutes(grid.start);
  const gridEnd = timeToMinutes(grid.end);
  return ranges.filter((range) => {
    const from = timeToMinutes(range.startTime);
    const to = timeToMinutes(range.endTime);
    const aligned = (from - gridStart) % grid.stepMinutes === 0 && (to - gridStart) % grid.stepMinutes === 0;
    return !aligned || from < gridStart || to > gridEnd;
  });
}
