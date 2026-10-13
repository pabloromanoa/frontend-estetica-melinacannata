import { makeSlot, providerFixture } from '@/test/fixtures';
import {
  filterSlotsByProvider,
  groupSlotsByDate,
  pickRecommendedSlot,
  resolveSlotProvider,
  slotDurationMinutes,
  slotKey,
  sortSlots,
} from './slots';

const other = { ...providerFixture, id: 'prov-2', displayName: 'Julieta Díaz' };

describe('slots', () => {
  const late = makeSlot({
    startAt: '2026-10-25T20:30:00.000Z',
    endAt: '2026-10-25T22:00:00.000Z',
    contiguous: true,
  });
  const early = makeSlot({ startAt: '2026-10-25T12:00:00.000Z', endAt: '2026-10-25T13:30:00.000Z' });
  const nextDay = makeSlot({
    startAt: '2026-10-26T02:00:00.000Z',
    endAt: '2026-10-26T03:00:00.000Z',
    providers: [other],
  });

  it('ordena y agrupa por día del negocio', () => {
    expect(sortSlots([late, early]).map(slotKey)).toEqual([early.startAt, late.startAt]);
    const groups = groupSlotsByDate([nextDay, late, early]);
    // 2026-10-26T02:00Z es todavía 25/10 a las 23:00 en Buenos Aires
    expect(groups).toHaveLength(1);
    expect(groups[0]?.date).toBe('2026-10-25');
    expect(groups[0]?.slots).toHaveLength(3);
  });

  it('recomienda el primer turno continuo, si no el más próximo', () => {
    expect(pickRecommendedSlot([early, late])).toBe(late);
    expect(pickRecommendedSlot([early])).toBe(early);
    expect(pickRecommendedSlot([])).toBeNull();
  });

  it('filtra por prestador y resuelve el prestador a enviar', () => {
    expect(filterSlotsByProvider([early, nextDay], 'prov-2')).toEqual([nextDay]);
    expect(filterSlotsByProvider([early, nextDay], null)).toHaveLength(2);
    expect(resolveSlotProvider(early, null)).toEqual(providerFixture);
    expect(resolveSlotProvider(makeSlot({ providers: [providerFixture, other] }), null)).toBeUndefined();
    expect(resolveSlotProvider(makeSlot({ providers: [providerFixture, other] }), 'prov-2')).toEqual(other);
  });

  it('calcula duración', () => {
    expect(slotDurationMinutes(early)).toBe(90);
  });
});
