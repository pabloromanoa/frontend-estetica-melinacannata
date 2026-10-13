import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MIN_PASSWORD_LENGTH } from '@/config/constants';
import type { CreateProviderInput, Provider, UpdateProviderInput } from '@/domain';
import { emailField, nameField } from '@/shared/lib/schemas';
import { Button, Checkbox, fieldA11y, FormField, Input, Textarea } from '@/shared/ui';

const optionalText = z.string().trim().max(500, 'Es demasiado largo.');
const optionalUrl = z.union([z.literal(''), z.url('Ingresá una URL válida.')]);

const profileSchema = z.object({
  displayName: nameField('el nombre visible'),
  specialty: optionalText,
  bio: optionalText,
  avatarUrl: optionalUrl,
  isActive: z.boolean(),
});

const createSchema = profileSchema.extend({
  firstName: nameField('el nombre'),
  lastName: nameField('el apellido'),
  email: emailField,
  password: z.string().min(MIN_PASSWORD_LENGTH, `Mínimo ${MIN_PASSWORD_LENGTH} caracteres.`),
});

/** En edición las credenciales no se envían, así que no se validan (mismo tipo de formulario). */
const editSchema = profileSchema.extend({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
});

type FormValues = z.infer<typeof createSchema>;

const blankToUndefined = (value: string) => (value.trim() ? value.trim() : undefined);

interface ProviderFormProps {
  provider?: Provider;
  isSubmitting: boolean;
  onCreate: (input: CreateProviderInput) => void;
  onUpdate: (input: UpdateProviderInput) => void;
}

/** Alta (crea usuario con rol PROVIDER) o edición de perfil. El rol ADMIN nunca se asigna desde acá. */
export function ProviderForm({ provider, isSubmitting, onCreate, onUpdate }: ProviderFormProps) {
  const isEdit = Boolean(provider);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    defaultValues: {
      displayName: provider?.displayName ?? '',
      specialty: provider?.specialty ?? '',
      bio: provider?.bio ?? '',
      avatarUrl: provider?.avatarUrl ?? '',
      isActive: provider?.isActive ?? true,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const submit = (values: FormValues) => {
    const profile = {
      displayName: values.displayName,
      specialty: blankToUndefined(values.specialty),
      bio: blankToUndefined(values.bio),
      avatarUrl: blankToUndefined(values.avatarUrl),
    };
    if (isEdit) onUpdate({ ...profile, isActive: values.isActive });
    else
      onCreate({
        ...profile,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });
  };

  const text = (name: keyof FormValues, label: string, type = 'text', required = false) => {
    const id = `provider-${name}`;
    const error = errors[name]?.message;
    return (
      <FormField label={label} htmlFor={id} error={error} required={required}>
        <Input type={type} {...fieldA11y(id, error)} {...register(name)} />
      </FormField>
    );
  };

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="grid gap-4 md:grid-cols-2">
      {!isEdit && (
        <>
          {text('firstName', 'Nombre', 'text', true)}
          {text('lastName', 'Apellido', 'text', true)}
          {text('email', 'Email de acceso', 'email', true)}
          {text('password', 'Contraseña inicial', 'password', true)}
        </>
      )}
      {text('displayName', 'Nombre visible', 'text', true)}
      {text('specialty', 'Especialidad')}
      {text('avatarUrl', 'URL de la foto', 'url')}
      <FormField label="Bio" htmlFor="provider-bio" error={errors.bio?.message} className="md:col-span-2">
        <Textarea {...fieldA11y('provider-bio', errors.bio?.message)} {...register('bio')} />
      </FormField>
      {isEdit && (
        <Checkbox label="Activa (aparece en el catálogo y recibe turnos)" {...register('isActive')} />
      )}
      <div className="md:col-span-2">
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? 'Guardar cambios' : 'Crear prestador'}
        </Button>
      </div>
    </form>
  );
}
