import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { timeToMinutes, toDateKey, type NewAvailabilityException } from '@/domain';
import { Button, Checkbox, fieldA11y, FormField, Input, Select } from '@/shared/ui';

const TIME = /^\d{2}:\d{2}$/;

const schema = z
  .object({
    date: z.string().min(1, 'Elegí la fecha.'),
    type: z.enum(['UNAVAILABLE', 'AVAILABLE']),
    allDay: z.boolean(),
    startTime: z.string(),
    endTime: z.string(),
    reason: z.string().trim().max(200),
  })
  .superRefine((values, ctx) => {
    const needsRange = values.type === 'AVAILABLE' || !values.allDay;
    if (!needsRange) return;
    if (!TIME.test(values.startTime))
      ctx.addIssue({ code: 'custom', path: ['startTime'], message: 'Indicá la hora de inicio.' });
    if (!TIME.test(values.endTime))
      ctx.addIssue({ code: 'custom', path: ['endTime'], message: 'Indicá la hora de fin.' });
    else if (
      TIME.test(values.startTime) &&
      timeToMinutes(values.endTime) <= timeToMinutes(values.startTime)
    ) {
      ctx.addIssue({ code: 'custom', path: ['endTime'], message: 'Tiene que ser posterior al inicio.' });
    }
  });

type Values = z.infer<typeof schema>;

/** Convierte el formulario al payload del contrato (UNAVAILABLE + todo el día ⇒ horas null). */
function toExceptionPayload(values: Values): NewAvailabilityException {
  const allDay = values.type === 'UNAVAILABLE' && values.allDay;
  return {
    date: values.date,
    type: values.type,
    startTime: allDay ? null : values.startTime,
    endTime: allDay ? null : values.endTime,
    reason: values.reason || null,
  };
}

export function ExceptionForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (input: NewAvailabilityException) => void;
  isSubmitting: boolean;
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { date: '', type: 'UNAVAILABLE', allDay: true, startTime: '', endTime: '', reason: '' },
  });
  const type = watch('type');
  const allDay = watch('allDay');
  const showRange = type === 'AVAILABLE' || !allDay;

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => {
        onSubmit(toExceptionPayload(values));
        reset();
      })}
      className="grid gap-3 md:grid-cols-2"
    >
      <FormField label="Fecha" htmlFor="exc-date" error={errors.date?.message} required>
        <Input
          type="date"
          min={toDateKey(new Date())}
          {...fieldA11y('exc-date', errors.date?.message)}
          {...register('date')}
        />
      </FormField>
      <FormField label="Tipo" htmlFor="exc-type">
        <Select id="exc-type" {...register('type')}>
          <option value="UNAVAILABLE">No disponible</option>
          <option value="AVAILABLE">Disponible excepcionalmente</option>
        </Select>
      </FormField>
      {type === 'UNAVAILABLE' && (
        <Checkbox label="Todo el día" className="md:col-span-2" {...register('allDay')} />
      )}
      {showRange && (
        <>
          <FormField label="Desde" htmlFor="exc-start" error={errors.startTime?.message} required>
            <Input
              type="time"
              step={1800}
              {...fieldA11y('exc-start', errors.startTime?.message)}
              {...register('startTime')}
            />
          </FormField>
          <FormField label="Hasta" htmlFor="exc-end" error={errors.endTime?.message} required>
            <Input
              type="time"
              step={1800}
              {...fieldA11y('exc-end', errors.endTime?.message)}
              {...register('endTime')}
            />
          </FormField>
        </>
      )}
      <FormField label="Motivo (opcional)" htmlFor="exc-reason" className="md:col-span-2">
        <Input
          id="exc-reason"
          placeholder="Ej.: capacitación, feriado, jornada extendida…"
          {...register('reason')}
        />
      </FormField>
      <div className="md:col-span-2">
        <Button type="submit" variant="secondary" loading={isSubmitting}>
          Agregar excepción
        </Button>
      </div>
    </form>
  );
}
