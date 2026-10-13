import type { WeeklyAvailabilityRange } from './types';
import {
  availableHours,
  createEmptyMatrix,
  DEFAULT_GRID,
  fillRange,
  findMisalignedRanges,
  hasAvailability,
  matricesEqual,
  matrixToRanges,
  rangesToMatrix,
  setCell,
  slotCount,
  slotLabels,
  toggleCell,
  type MatrixGrid,
} from './availability-matrix';

const grid: MatrixGrid = { start: '08:00', end: '22:00', stepMinutes: 30 };

describe('availability-matrix', () => {
  it('genera la grilla de bloques de 30 min', () => {
    expect(slotCount(grid)).toBe(28);
    expect(slotLabels(grid).slice(0, 3)).toEqual(['08:00', '08:30', '09:00']);
    expect(createEmptyMatrix(grid)).toHaveLength(7);
    expect(slotCount(DEFAULT_GRID)).toBe(30);
  });

  it('ida y vuelta con rangos partidos (08:00-13:00 y 14:00-21:00)', () => {
    const ranges: WeeklyAvailabilityRange[] = [
      { dayOfWeek: 1, startTime: '08:00', endTime: '13:00' },
      { dayOfWeek: 1, startTime: '14:00', endTime: '21:00' },
      { dayOfWeek: 6, startTime: '09:00', endTime: '14:00' },
    ];
    const matrix = rangesToMatrix(ranges, grid);
    expect(matrix[1]?.filter(Boolean)).toHaveLength(24);
    expect(matrix[1]?.[10]).toBe(false); // 13:00
    expect(matrix[1]?.[11]).toBe(false); // 13:30
    expect(matrix[1]?.[12]).toBe(true); // 14:00
    expect(matrixToRanges(matrix, grid)).toEqual(ranges);
    expect(availableHours(matrix, 1, grid)).toBe(12);
    expect(availableHours(matrix, 6, grid)).toBe(5);
  });

  it('un rango hasta el final de la grilla se cierra correctamente', () => {
    const ranges: WeeklyAvailabilityRange[] = [{ dayOfWeek: 0, startTime: '20:00', endTime: '22:00' }];
    expect(matrixToRanges(rangesToMatrix(ranges, grid), grid)).toEqual(ranges);
  });

  it('recorta rangos fuera de la grilla y no marca bloques parciales', () => {
    const matrix = rangesToMatrix(
      [
        { dayOfWeek: 2, startTime: '06:00', endTime: '09:00' },
        { dayOfWeek: 3, startTime: '10:15', endTime: '11:00' },
      ],
      grid,
    );
    expect(matrixToRanges(matrix, grid)).toEqual([
      { dayOfWeek: 2, startTime: '08:00', endTime: '09:00' },
      { dayOfWeek: 3, startTime: '10:30', endTime: '11:00' },
    ]);
  });

  it('una matriz vacía no genera rangos', () => {
    expect(matrixToRanges(createEmptyMatrix(grid), grid)).toEqual([]);
    expect(hasAvailability(createEmptyMatrix(grid), 1)).toBe(false);
  });

  it('alterna y fija bloques de forma inmutable', () => {
    const empty = createEmptyMatrix(grid);
    const toggled = toggleCell(empty, 1, 0);
    expect(toggled[1]?.[0]).toBe(true);
    expect(empty[1]?.[0]).toBe(false);
    expect(toggleCell(toggled, 1, 0)[1]?.[0]).toBe(false);
    expect(setCell(toggled, 1, 0, true)).toBe(toggled);
    expect(setCell(toggled, 2, 3, true)[2]?.[3]).toBe(true);
  });

  it('aplica presets de mañana/tarde a varios días', () => {
    const filled = fillRange(createEmptyMatrix(grid), [1, 2], '08:00', '13:00', true, grid);
    expect(matrixToRanges(filled, grid)).toEqual([
      { dayOfWeek: 1, startTime: '08:00', endTime: '13:00' },
      { dayOfWeek: 2, startTime: '08:00', endTime: '13:00' },
    ]);
    const cleared = fillRange(filled, [1], '08:00', '10:00', false, grid);
    expect(matrixToRanges(cleared, grid)[0]).toEqual({ dayOfWeek: 1, startTime: '10:00', endTime: '13:00' });
  });

  it('compara matrices', () => {
    const a = createEmptyMatrix(grid);
    expect(matricesEqual(a, createEmptyMatrix(grid))).toBe(true);
    expect(matricesEqual(a, toggleCell(a, 0, 0))).toBe(false);
  });

  it('detecta rangos no alineados o fuera de grilla', () => {
    const ranges: WeeklyAvailabilityRange[] = [
      { dayOfWeek: 1, startTime: '08:00', endTime: '13:00' },
      { dayOfWeek: 1, startTime: '14:15', endTime: '18:00' },
      { dayOfWeek: 2, startTime: '07:00', endTime: '09:00' },
    ];
    expect(findMisalignedRanges(ranges, grid)).toHaveLength(2);
  });
});
