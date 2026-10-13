import { formatCountdown, holdProgress, isHoldExpired, secondsRemaining } from './hold-timer';

describe('hold-timer', () => {
  const expiresAt = '2026-10-24T17:17:00.000Z';

  it('calcula segundos restantes redondeando hacia arriba', () => {
    expect(secondsRemaining(expiresAt, new Date('2026-10-24T17:12:00.000Z'))).toBe(300);
    expect(secondsRemaining(expiresAt, new Date('2026-10-24T17:16:59.500Z'))).toBe(1);
  });

  it('nunca devuelve negativos y trata null como vencido', () => {
    expect(secondsRemaining(expiresAt, new Date('2026-10-24T17:20:00.000Z'))).toBe(0);
    expect(secondsRemaining(null, new Date())).toBe(0);
    expect(isHoldExpired(null, new Date())).toBe(true);
  });

  it('vence exactamente al llegar a holdExpiresAt', () => {
    expect(isHoldExpired(expiresAt, new Date('2026-10-24T17:16:59.000Z'))).toBe(false);
    expect(isHoldExpired(expiresAt, new Date('2026-10-24T17:17:00.000Z'))).toBe(true);
  });

  it('formatea mm:ss', () => {
    expect(formatCountdown(300)).toBe('05:00');
    expect(formatCountdown(59)).toBe('00:59');
    expect(formatCountdown(-3)).toBe('00:00');
  });

  it('calcula el progreso restante', () => {
    expect(holdProgress(300)).toBe(1);
    expect(holdProgress(150)).toBe(0.5);
    expect(holdProgress(999)).toBe(1);
    expect(holdProgress(-1)).toBe(0);
  });
});
