import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { RegisterInput } from '@/domain';
import { Alert, Button, fieldA11y, FormField, Input } from '@/shared/ui';
import { registerSchema, type RegisterFormInput, type RegisterFormOutput } from '../schemas';

interface RegisterFormProps {
  onSubmit: (values: RegisterInput) => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

const FIELDS: Array<{
  name: keyof RegisterFormInput;
  label: string;
  type?: string;
  autoComplete?: string;
  hint?: string;
}> = [
  { name: 'lastName', label: 'Apellido', autoComplete: 'family-name' },
  { name: 'firstName', label: 'Nombre', autoComplete: 'given-name' },
  {
    name: 'dni',
    label: 'DNI',
    autoComplete: 'off',
    hint: 'Sin puntos. Lo usamos para vincular reservas anteriores.',
  },
  { name: 'phone', label: 'Teléfono (WhatsApp)', type: 'tel', autoComplete: 'tel' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'password', label: 'Contraseña', type: 'password', autoComplete: 'new-password' },
  { name: 'confirmPassword', label: 'Repetí la contraseña', type: 'password', autoComplete: 'new-password' },
];

export function RegisterForm({ onSubmit, isSubmitting = false, errorMessage }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput, unknown, RegisterFormOutput>({ resolver: zodResolver(registerSchema) });

  const submit = ({ confirmPassword: _confirm, ...values }: RegisterFormOutput) => onSubmit(values);

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="grid gap-4 sm:grid-cols-2">
      {errorMessage && (
        <Alert tone="danger" className="sm:col-span-2">
          {errorMessage}
        </Alert>
      )}
      {FIELDS.map((field) => {
        const id = `register-${field.name}`;
        const error = errors[field.name]?.message;
        return (
          <FormField
            key={field.name}
            label={field.label}
            htmlFor={id}
            error={error}
            hint={field.hint}
            required
          >
            <Input
              type={field.type ?? 'text'}
              autoComplete={field.autoComplete}
              {...fieldA11y(id, error)}
              {...register(field.name)}
            />
          </FormField>
        );
      })}
      <Button type="submit" size="lg" fullWidth loading={isSubmitting} className="sm:col-span-2">
        Crear cuenta
      </Button>
    </form>
  );
}
