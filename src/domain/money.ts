import { BUSINESS_LOCALE, DEPOSIT_RATE } from '@/config/constants';

const CENTS = 100;

const integerFormatter = new Intl.NumberFormat(BUSINESS_LOCALE, { maximumFractionDigits: 2 });
const decimalFormatter = new Intl.NumberFormat(BUSINESS_LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Redondea a 2 decimales (centavos), como define el contrato. */
export function roundMoney(amount: number): number {
  return Math.round(amount * CENTS) / CENTS;
}

/**
 * Formatea un monto en pesos argentinos: `$7.000` o `$7.000,00` con `withDecimals`.
 * Se arma a mano (en lugar de `style: 'currency'`) para evitar el espacio duro que agrega Intl.
 */
export function formatARS(amount: number, options: { withDecimals?: boolean } = {}): string {
  const formatter = options.withDecimals ? decimalFormatter : integerFormatter;
  const sign = amount < 0 ? '-' : '';
  return `${sign}$${formatter.format(Math.abs(roundMoney(amount)))}`;
}

/** Seña esperada para un precio (50%). El backend devuelve `depositAmount`; esto sirve para previsualizar. */
export function computeDepositAmount(price: number): number {
  return roundMoney(price * DEPOSIT_RATE);
}

export function computeRemainingAmount(price: number, depositAmount: number): number {
  return roundMoney(price - depositAmount);
}
