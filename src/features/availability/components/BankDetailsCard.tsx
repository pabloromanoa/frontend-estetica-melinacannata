import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wallet } from 'lucide-react';
import { z } from 'zod';
import { hasTransferData, type BankDetails } from '@/domain';
import { getErrorMessage } from '@/shared/api';
import { Alert, Badge, Button, Card, CardHeader, fieldA11y, FormField, Input } from '@/shared/ui';

const CBU_PATTERN = /^\d{22}$/;
const CUIL_PATTERN = /^\d{2}-?\d{8}-?\d$/;

const schema = z.object({
  alias: z.string().trim().max(40, 'Máximo 40 caracteres.'),
  cbu: z.union([z.literal(''), z.string().trim().regex(CBU_PATTERN, 'El CBU/CVU tiene 22 dígitos.')]),
  holder: z.string().trim().max(120),
  cuil: z.union([z.literal(''), z.string().trim().regex(CUIL_PATTERN, 'Formato: 27-12345678-4.')]),
  bankName: z.string().trim().max(80),
});

type Values = z.infer<typeof schema>;
const toNullable = (value: string): string | null => (value.trim() ? value.trim() : null);

interface BankDetailsCardProps {
  bankDetails: BankDetails;
  onSave: (bank: BankDetails) => void;
  isSaving: boolean;
  error: unknown;
  saved: boolean;
}

const FIELDS: Array<{ name: keyof Values; label: string; mono?: boolean }> = [
  { name: 'alias', label: 'Alias', mono: true },
  { name: 'cbu', label: 'CBU / CVU', mono: true },
  { name: 'holder', label: 'Titular' },
  { name: 'cuil', label: 'CUIL', mono: true },
  { name: 'bankName', label: 'Banco / Entidad' },
];

/** "Datos de Seña": cuenta a la que los pacientes transfieren. */
export function BankDetailsCard({ bankDetails, onSave, isSaving, error, saved }: BankDetailsCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    values: {
      alias: bankDetails.alias ?? '',
      cbu: bankDetails.cbu ?? '',
      holder: bankDetails.holder ?? '',
      cuil: bankDetails.cuil ?? '',
      bankName: bankDetails.bankName ?? '',
    },
  });
  const submit = (values: Values) =>
    onSave({
      alias: toNullable(values.alias),
      cbu: toNullable(values.cbu),
      holder: toNullable(values.holder),
      cuil: toNullable(values.cuil),
      bankName: toNullable(values.bankName),
    });

  return (
    <Card className="p-5">
      <CardHeader
        title="Datos de Seña"
        icon={<Wallet className="size-5" />}
        actions={
          hasTransferData(bankDetails) ? (
            <Badge tone="warning">Activo</Badge>
          ) : (
            <Badge tone="danger">Incompleto</Badge>
          )
        }
      />
      <form noValidate onSubmit={handleSubmit(submit)} className="space-y-3">
        {FIELDS.map((field) => {
          const id = `bank-${field.name}`;
          const message = errors[field.name]?.message;
          return (
            <FormField key={field.name} label={field.label} htmlFor={id} error={message}>
              <Input
                className={field.mono ? 'font-mono' : undefined}
                {...fieldA11y(id, message)}
                {...register(field.name)}
              />
            </FormField>
          );
        })}
        {Boolean(error) && <Alert tone="danger">{getErrorMessage(error)}</Alert>}
        {saved && <Alert tone="success">Datos de seña publicados.</Alert>}
        <Button type="submit" size="lg" fullWidth loading={isSaving}>
          Guardar y Publicar
        </Button>
      </form>
    </Card>
  );
}
