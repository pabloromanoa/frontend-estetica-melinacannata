import { computeDepositAmount, computeRemainingAmount, formatARS, roundMoney } from './money';

describe('money', () => {
  it('formatea pesos sin decimales por defecto', () => {
    expect(formatARS(7000)).toBe('$7.000');
    expect(formatARS(1234567)).toBe('$1.234.567');
    expect(formatARS(0)).toBe('$0');
  });

  it('formatea con decimales cuando se pide', () => {
    expect(formatARS(7000, { withDecimals: true })).toBe('$7.000,00');
    expect(formatARS(10.5, { withDecimals: true })).toBe('$10,50');
  });

  it('respeta decimales significativos y negativos', () => {
    expect(formatARS(10.5)).toBe('$10,5');
    expect(formatARS(-1500)).toBe('-$1.500');
  });

  it('redondea a centavos', () => {
    expect(roundMoney(10.005)).toBe(10.01);
    expect(roundMoney(3.14159)).toBe(3.14);
  });

  it('calcula seña del 50% y saldo', () => {
    expect(computeDepositAmount(22000)).toBe(11000);
    expect(computeDepositAmount(15001)).toBe(7500.5);
    expect(computeRemainingAmount(22000, 7000)).toBe(15000);
  });
});
