import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  computeDepositAmount,
  formatARS,
  type Category,
  type Provider,
  type Service,
  type ServiceInput,
} from '@/domain';
import { parseTags } from '@/shared/lib/schemas';
import { Button, Checkbox, CheckboxGroup, fieldA11y, FormField, Input, Textarea } from '@/shared/ui';
import { DateListField } from './DateListField';

const MIN_DURATION = 5;
const minutes = (label: string, min = 0) =>
  z
    .number({ error: `Ingresá ${label}.` })
    .int('Usá minutos enteros.')
    .min(min, `Mínimo ${min} minutos.`);

const schema = z.object({
  name: z.string().trim().min(2, 'Ingresá el nombre.'),
  description: z.string().trim().max(1000),
  imageUrl: z.union([z.literal(''), z.url('Ingresá una URL válida.')]),
  durationMinutes: minutes('la duración', MIN_DURATION),
  price: z.number({ error: 'Ingresá el precio.' }).min(0, 'El precio no puede ser negativo.'),
  prepMinutes: minutes('la preparación'),
  cleanupMinutes: minutes('la limpieza'),
  categoryIds: z.array(z.string()),
  providerIds: z.array(z.string()),
  tagsText: z.string(),
  specificDates: z.array(z.string()),
  isActive: z.boolean(),
});

type Values = z.infer<typeof schema>;

interface ServiceFormProps {
  service?: Service;
  categories: readonly Category[];
  providers: readonly Provider[];
  isSubmitting: boolean;
  onSubmit: (input: ServiceInput) => void;
}

export function ServiceForm({ service, categories, providers, isSubmitting, onSubmit }: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: service?.name ?? '',
      description: service?.description ?? '',
      imageUrl: service?.imageUrl ?? '',
      durationMinutes: service?.durationMinutes ?? 60,
      price: service?.price ?? 0,
      prepMinutes: service?.prepMinutes ?? 0,
      cleanupMinutes: service?.cleanupMinutes ?? 0,
      categoryIds: service?.categories.map((c) => c.id) ?? [],
      providerIds: service?.providers.map((p) => p.id) ?? [],
      tagsText: service?.recommendationTags.join(', ') ?? '',
      specificDates: service?.specificDates ?? [],
      isActive: service?.isActive ?? true,
    },
  });
  const price = watch('price');

  const submit = ({ tagsText, description, imageUrl, ...values }: Values) =>
    onSubmit({
      ...values,
      description: description || undefined,
      imageUrl: imageUrl || undefined,
      recommendationTags: parseTags(tagsText),
    });

  const field = (name: 'name' | 'imageUrl', label: string, required = false) => (
    <FormField label={label} htmlFor={`svc-${name}`} error={errors[name]?.message} required={required}>
      <Input {...fieldA11y(`svc-${name}`, errors[name]?.message)} {...register(name)} />
    </FormField>
  );
  const numeric = (
    name: 'durationMinutes' | 'price' | 'prepMinutes' | 'cleanupMinutes',
    label: string,
    hint?: string,
  ) => (
    <FormField label={label} htmlFor={`svc-${name}`} error={errors[name]?.message} hint={hint} required>
      <Input
        type="number"
        min={0}
        {...fieldA11y(`svc-${name}`, errors[name]?.message)}
        {...register(name, { valueAsNumber: true })}
      />
    </FormField>
  );

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="grid gap-4 md:grid-cols-2">
      {field('name', 'Nombre', true)}
      {field('imageUrl', 'URL de imagen')}
      <FormField label="Descripción" htmlFor="svc-description" className="md:col-span-2">
        <Textarea id="svc-description" {...register('description')} />
      </FormField>
      {numeric('durationMinutes', 'Duración (min)', 'Tiempo de atención (lo que ve el cliente).')}
      {numeric(
        'price',
        'Precio (ARS)',
        Number.isFinite(price) ? `Seña (50%): ${formatARS(computeDepositAmount(price))}` : undefined,
      )}
      {numeric('prepMinutes', 'Preparación (min)', 'Bloquea agenda antes del turno.')}
      {numeric('cleanupMinutes', 'Limpieza (min)', 'Bloquea agenda después del turno.')}
      <Controller
        control={control}
        name="categoryIds"
        render={({ field: f }) => (
          <CheckboxGroup
            legend="Categorías"
            items={categories}
            getId={(c) => c.id}
            getLabel={(c) => `${c.name}${c.isActive ? '' : ' (inactiva)'}`}
            value={f.value}
            onChange={f.onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="providerIds"
        render={({ field: f }) => (
          <CheckboxGroup
            legend="Profesionales que lo prestan"
            items={providers}
            getId={(p) => p.id}
            getLabel={(p) => p.displayName}
            value={f.value}
            onChange={f.onChange}
          />
        )}
      />
      <FormField
        label="Tags para el recomendador"
        htmlFor="svc-tags"
        hint="Separados por coma. Ej.: piel seca, relajación, antiage"
        className="md:col-span-2"
      >
        <Input id="svc-tags" {...register('tagsText')} />
      </FormField>
      <div className="md:col-span-2">
        <Controller
          control={control}
          name="specificDates"
          render={({ field: f }) => <DateListField value={f.value} onChange={f.onChange} />}
        />
      </div>
      <Checkbox label="Servicio activo (visible en el catálogo)" {...register('isActive')} />
      <div className="md:col-span-2">
        <Button type="submit" loading={isSubmitting}>
          {service ? 'Guardar cambios' : 'Crear servicio'}
        </Button>
      </div>
    </form>
  );
}
