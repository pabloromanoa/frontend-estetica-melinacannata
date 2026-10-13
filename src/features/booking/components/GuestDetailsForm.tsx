import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { GuestData } from '@/domain';
import { guestSchema, toGuestPayload, type GuestFormInput, type GuestFormValues } from '@/shared/lib/schemas';
import { Button, fieldA11y, FormField, Input } from '@/shared/ui';

interface GuestDetailsFormProps {
  onSubmit: (guest: GuestData) => void;
  defaultValues?: Partial<GuestFormInput>;
  submitLabel: string;
  isSubmitting?: boolean;
  idPrefix?: string;
}

const FIELDS: Array<{
  name: keyof GuestFormInput;
  label: string;
  type?: string;
  autoComplete?: string;
  required: boolean;
}> = [
  { name: 'lastName', label: 'Apellido', autoComplete: 'family-name', required: true },
  { name: 'firstName', label: 'Nombre', autoComplete: 'given-name', required: true },
  { name: 'dni', label: 'DNI', required: true },
  { name: 'phone', label: 'Teléfono (WhatsApp)', type: 'tel', autoComplete: 'tel', required: true },
  { name: 'email', label: 'Email (opcional)', type: 'email', autoComplete: 'email', required: false },
];

/** Datos del invitado / paciente: apellido, nombre, DNI, teléfono y email opcional. */
export function GuestDetailsForm({
  onSubmit,
  defaultValues,
  submitLabel,
  isSubmitting,
  idPrefix = 'guest',
}: GuestDetailsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestFormInput, unknown, GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: { lastName: '', firstName: '', dni: '', phone: '', email: '', ...defaultValues },
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => onSubmit(toGuestPayload(values)))}
      className="grid gap-4 sm:grid-cols-2"
    >
      {FIELDS.map((field) => {
        const id = `${idPrefix}-${field.name}`;
        const error = errors[field.name]?.message;
        return (
          <FormField
            key={field.name}
            label={field.label}
            htmlFor={id}
            error={error}
            required={field.required}
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
      <Button type="submit" size="lg" loading={isSubmitting} className="sm:col-span-2">
        {submitLabel}
      </Button>
    </form>
  );
}
