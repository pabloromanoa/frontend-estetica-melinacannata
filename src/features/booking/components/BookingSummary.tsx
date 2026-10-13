import {
  computeRemainingAmount,
  formatARS,
  formatDateTimeLong,
  type AvailableSlot,
  type Service,
} from '@/domain';
import { KeyValue } from '@/shared/ui';

interface BookingSummaryProps {
  service: Service;
  slot: AvailableSlot;
  providerName: string;
}

export function BookingSummary({ service, slot, providerName }: BookingSummaryProps) {
  return (
    <dl className="rounded-2xl bg-surface-muted px-4 py-2">
      <KeyValue label="Servicio" value={service.name} />
      <KeyValue label="Fecha y horario" value={formatDateTimeLong(slot.startAt)} />
      <KeyValue label="Profesional" value={providerName} />
      <KeyValue label="Precio" value={formatARS(service.price)} />
      <KeyValue label="Seña para confirmar (50%)" value={formatARS(service.depositAmount)} emphasis />
      <KeyValue
        label="Saldo a abonar en el centro"
        value={formatARS(computeRemainingAmount(service.price, service.depositAmount))}
      />
    </dl>
  );
}
