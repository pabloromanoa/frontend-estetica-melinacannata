import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Service, Treatment, TreatmentInput } from '@/domain';
import { parseTags } from '@/shared/lib/schemas';
import { Button, Checkbox, fieldA11y, FormField, Input, Textarea } from '@/shared/ui';
import { OrderedServicesField } from './OrderedServicesField';

const schema = z.object({
  name: z.string().trim().min(2, 'Ingresá el nombre.'),
  description: z.string().trim().max(1000),
  serviceIds: z.array(z.string()).min(1, 'Agregá al menos un servicio.'),
  tagsText: z.string(),
  isActive: z.boolean(),
});
type Values = z.infer<typeof schema>;

interface TreatmentFormProps {
  treatment?: Treatment;
  services: readonly Service[];
  isSubmitting: boolean;
  onSubmit: (input: TreatmentInput) => void;
}

export function TreatmentForm({ treatment, services, isSubmitting, onSubmit }: TreatmentFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: treatment?.name ?? '',
      description: treatment?.description ?? '',
      serviceIds: treatment?.services.map((s) => s.id) ?? [],
      tagsText: treatment?.recommendationTags.join(', ') ?? '',
      isActive: treatment?.isActive ?? true,
    },
  });
  const submit = ({ tagsText, description, ...values }: Values) =>
    onSubmit({ ...values, description: description || undefined, recommendationTags: parseTags(tagsText) });

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="space-y-4">
      <FormField label="Nombre" htmlFor="treatment-name" error={errors.name?.message} required>
        <Input {...fieldA11y('treatment-name', errors.name?.message)} {...register('name')} />
      </FormField>
      <FormField label="Descripción" htmlFor="treatment-description">
        <Textarea id="treatment-description" {...register('description')} />
      </FormField>
      <Controller
        control={control}
        name="serviceIds"
        render={({ field }) => (
          <OrderedServicesField
            services={services}
            value={field.value}
            onChange={field.onChange}
            error={errors.serviceIds?.message}
          />
        )}
      />
      <FormField label="Tags para el recomendador" htmlFor="treatment-tags" hint="Separados por coma.">
        <Input id="treatment-tags" {...register('tagsText')} />
      </FormField>
      <Checkbox label="Tratamiento activo" {...register('isActive')} />
      <Button type="submit" loading={isSubmitting}>
        {treatment ? 'Guardar cambios' : 'Crear tratamiento'}
      </Button>
    </form>
  );
}
