import { z } from 'zod';
import { MIN_PASSWORD_LENGTH } from '@/config/constants';
import { dniField, emailField, nameField, phoneField } from '@/shared/lib/schemas';

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Ingresá tu contraseña.'),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    lastName: nameField('tu apellido'),
    firstName: nameField('tu nombre'),
    dni: dniField,
    phone: phoneField,
    email: emailField,
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden.',
  });

export type RegisterFormInput = z.input<typeof registerSchema>;
export type RegisterFormOutput = z.output<typeof registerSchema>;
