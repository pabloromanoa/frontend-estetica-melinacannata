import { z } from 'zod';

/** Reglas de validación de datos personales compartidas entre registro, reserva de invitado y panel. */
const DNI_PATTERN = /^\d{7,8}$/;
const PHONE_PATTERN = /^\+?[\d\s()-]{8,20}$/;

export const nameField = (label: string) =>
  z.string().trim().min(2, `Ingresá ${label}.`).max(80, 'Es demasiado largo.');

export const dniField = z
  .string()
  .trim()
  .transform((value) => value.replace(/\./g, ''))
  .pipe(z.string().regex(DNI_PATTERN, 'El DNI debe tener 7 u 8 números (sin puntos).'));

export const phoneField = z
  .string()
  .trim()
  .regex(PHONE_PATTERN, 'Ingresá un teléfono válido (con código de área).');

export const emailField = z.email('Ingresá un email válido.');

export const optionalEmailField = z.union([z.literal(''), z.email('Ingresá un email válido.')]);

/** Datos del paciente/invitado (POST /appointments → guest). */
export const guestSchema = z.object({
  lastName: nameField('el apellido'),
  firstName: nameField('el nombre'),
  dni: dniField,
  phone: phoneField,
  email: optionalEmailField,
});

export type GuestFormInput = z.input<typeof guestSchema>;
export type GuestFormValues = z.output<typeof guestSchema>;

/** Convierte los valores del formulario al payload del contrato (email vacío ⇒ omitido). */
export function toGuestPayload(values: GuestFormValues): {
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  email?: string;
} {
  const { email, ...rest } = values;
  return email ? { ...rest, email } : rest;
}

/** Texto separado por comas → lista sin vacíos ni duplicados. */
export function parseTags(text: string): string[] {
  return [
    ...new Set(
      text
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ];
}
