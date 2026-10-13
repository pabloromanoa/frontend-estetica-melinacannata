import { toDateKey } from './dates';
import type { AvailableSlot, DateKey, ProviderSummary } from './types';

export function sortSlots(slots: readonly AvailableSlot[]): AvailableSlot[] {
  return [...slots].sort((a, b) => a.startAt.localeCompare(b.startAt));
}

export interface SlotGroup {
  date: DateKey;
  slots: AvailableSlot[];
}

/** Agrupa por día (zona del negocio) manteniendo el orden cronológico. */
export function groupSlotsByDate(slots: readonly AvailableSlot[]): SlotGroup[] {
  const groups = new Map<DateKey, AvailableSlot[]>();
  for (const slot of sortSlots(slots)) {
    const key = toDateKey(slot.startAt);
    groups.set(key, [...(groups.get(key) ?? []), slot]);
  }
  return [...groups.entries()].map(([date, items]) => ({ date, slots: items }));
}

/** Slot recomendado: el primero "continuo sin demoras"; si no hay, el más próximo. */
export function pickRecommendedSlot(slots: readonly AvailableSlot[]): AvailableSlot | null {
  const sorted = sortSlots(slots);
  return sorted.find((slot) => slot.contiguous) ?? sorted[0] ?? null;
}

export function slotKey(slot: Pick<AvailableSlot, 'startAt'>): string {
  return slot.startAt;
}

/** Filtra los horarios en los que puede atender un prestador puntual. */
export function filterSlotsByProvider(
  slots: readonly AvailableSlot[],
  providerId: string | null,
): AvailableSlot[] {
  if (!providerId) return [...slots];
  return slots.filter((slot) => slot.providers.some((provider) => provider.id === providerId));
}

/**
 * Prestador a enviar al reservar: el elegido si atiende ese horario; si no hubo preferencia y sólo hay uno
 * disponible, ese; si hay varios, `undefined` (el backend asigna aleatoriamente).
 */
export function resolveSlotProvider(
  slot: AvailableSlot,
  preferredProviderId: string | null,
): ProviderSummary | undefined {
  if (preferredProviderId) return slot.providers.find((provider) => provider.id === preferredProviderId);
  return slot.providers.length === 1 ? slot.providers[0] : undefined;
}

export function slotDurationMinutes(slot: Pick<AvailableSlot, 'startAt' | 'endAt'>): number {
  const MS_PER_MINUTE = 60_000;
  return Math.round((new Date(slot.endAt).getTime() - new Date(slot.startAt).getTime()) / MS_PER_MINUTE);
}
