import { CheckCircle2, MessageSquareText } from 'lucide-react';
import { computeRemainingAmount, formatARS } from '@/domain';
import { getErrorMessage } from '@/shared/api';
import { useCopyToClipboard } from '@/shared/hooks';
import { Alert, Button, ButtonLink, Card, CardHeader, CopyButton, KeyValue } from '@/shared/ui';
import type { StaffBookingDraft } from '../hooks/useStaffBookingDraft';

/** Paso 3 de "Nueva Reserva": liquidación, alias, mensaje armado y WhatsApp. */
export function SettlementCard({ draft }: { draft: StaffBookingDraft }) {
  const { service, created, create } = draft;
  const { copy, copied } = useCopyToClipboard();
  const price = created?.appointment.price ?? service?.price ?? 0;
  const deposit = created?.appointment.depositAmount ?? service?.depositAmount ?? 0;
  const alias =
    created?.appointment.provider.bankDetails.alias ?? created?.appointment.provider.bankDetails.cbu;

  const openWhatsApp = async () => {
    await copy(draft.message);
    window.open(draft.whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="h-fit lg:sticky lg:top-28">
      <CardHeader step={3} title="Resumen y Liquidación" />
      <dl className="rounded-xl bg-surface-muted px-3 py-1">
        <KeyValue label="Tratamiento" value={formatARS(price)} />
        <KeyValue
          label={<span className="text-primary">Seña para confirmar</span>}
          value={formatARS(deposit)}
          emphasis
        />
        <KeyValue label="Saldo restante en salón" value={formatARS(computeRemainingAmount(price, deposit))} />
      </dl>
      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-surface-muted p-3">
        <div className="min-w-0">
          <p className="text-xs text-ink-soft">Alias de transferencia</p>
          <p className="truncate font-mono text-sm font-semibold text-ink">
            {alias ?? 'Se muestra al confirmar la reserva'}
          </p>
        </div>
        {alias && <CopyButton value={alias} description="alias" />}
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <label htmlFor="nb-message" className="text-ink-soft">
            Mensaje para el cliente
          </label>
          {created && (
            <span className="flex items-center gap-1 text-ink-soft">
              <CheckCircle2 className="size-4" aria-hidden /> Listo
            </span>
          )}
        </div>
        <textarea
          id="nb-message"
          readOnly
          value={draft.message || 'El mensaje se arma al elegir paciente, servicio y horario.'}
          rows={6}
          className="w-full resize-none rounded-xl bg-surface-muted p-3 text-sm text-ink"
        />
      </div>
      {created && (
        <Alert tone="success" className="mt-4">
          Reserva #{created.appointment.code} creada. El horario queda bloqueado 5 minutos hasta recibir el
          comprobante.
        </Alert>
      )}
      {create.isError && (
        <Alert tone="danger" className="mt-4">
          {getErrorMessage(create.error)}
        </Alert>
      )}
      <div className="mt-4 space-y-2">
        <Button
          fullWidth
          size="lg"
          disabled={!draft.slot || Boolean(created)}
          loading={create.isPending}
          onClick={draft.confirm}
          leftIcon={<CheckCircle2 className="size-5" aria-hidden />}
        >
          Confirmar y Guardar Reserva
        </Button>
        <Button
          fullWidth
          variant="soft"
          disabled={!created}
          onClick={() => void openWhatsApp()}
          leftIcon={<MessageSquareText className="size-4" aria-hidden />}
        >
          {copied ? 'Mensaje copiado' : 'Copiar mensaje y abrir WhatsApp'}
        </Button>
        {created && (
          <ButtonLink to={`/panel/turnos/${created.appointment.id}`} variant="secondary" fullWidth>
            Ver seguimiento del turno
          </ButtonLink>
        )}
        <ButtonLink to="/panel/agenda" variant="ghost" fullWidth className="text-ink-soft">
          Volver a la agenda
        </ButtonLink>
      </div>
    </Card>
  );
}
