import { WHATSAPP_BASE_URL, WHATSAPP_COUNTRY_PREFIX } from '@/config/constants';
import { formatDateTimeLong } from './dates';
import { formatARS } from './money';
import type { BankDetails, IsoDateTime } from './types';

export interface BookingMessageInput {
  clientFirstName: string;
  serviceName: string;
  startAt: IsoDateTime;
  depositAmount: number;
  bankDetails: BankDetails | null;
  providerName?: string;
  /** Enlace privado `/turno/:token` para invitados. */
  privateLink?: string | null;
}

/** Arma el mensaje que el staff envía al cliente para pedir la seña. */
export function buildBookingMessage(input: BookingMessageInput): string {
  const lines: string[] = [
    `¡Hola ${input.clientFirstName}! Tu turno para ${input.serviceName} quedó agendado el ${formatDateTimeLong(input.startAt)}${
      input.providerName ? ` con ${input.providerName}` : ''
    }.`,
  ];
  const alias = input.bankDetails?.alias;
  const cbu = input.bankDetails?.cbu;
  const destination = alias ? `al alias ${alias}` : cbu ? `al CBU ${cbu}` : 'a la cuenta que te indicamos';
  lines.push(
    `Para confirmar tu lugar, solicitamos una seña de ${formatARS(input.depositAmount)} ${destination}.`,
  );
  if (input.bankDetails?.holder) lines.push(`Titular: ${input.bankDetails.holder}.`);
  if (input.privateLink) {
    lines.push(`Adjuntá el comprobante en PDF desde este enlace: ${input.privateLink}`);
  } else {
    lines.push('Cuando transfieras, envianos el comprobante en PDF por este medio.');
  }
  lines.push('¡Gracias!');
  return lines.join('\n');
}

/**
 * Normaliza un teléfono argentino al formato internacional que usa wa.me (549 + área + número).
 * Quita el 0 de larga distancia y el 15 cuando viene en formato local.
 */
export function normalizeArgentinePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('549')) return digits;
  if (digits.startsWith('54')) return `${WHATSAPP_COUNTRY_PREFIX}${digits.slice(2)}`;
  digits = digits.replace(/^0/, '');
  // Formato local "11 15 4829 1102": el 15 va después del código de área (2 a 4 dígitos).
  const LOCAL_LENGTH_WITH_15 = 12;
  if (digits.length === LOCAL_LENGTH_WITH_15) {
    const match = /^(\d{2,4})15(\d{6,8})$/.exec(digits);
    if (match) digits = `${match[1]}${match[2]}`;
  }
  return `${WHATSAPP_COUNTRY_PREFIX}${digits}`;
}

/** Link `https://wa.me/<tel>?text=<mensaje>`; sin teléfono abre el selector de contacto de WhatsApp. */
export function buildWhatsAppUrl(phone: string | null | undefined, message: string): string {
  const normalized = phone ? normalizeArgentinePhone(phone) : '';
  const path = normalized ? `/${normalized}` : '/';
  return `${WHATSAPP_BASE_URL}${path}?text=${encodeURIComponent(message)}`;
}
