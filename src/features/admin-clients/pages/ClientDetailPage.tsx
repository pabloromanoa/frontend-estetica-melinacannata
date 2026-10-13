import { useParams } from 'react-router';
import { MessageCircle, UserRound } from 'lucide-react';
import { buildWhatsAppUrl } from '@/domain';
import {
  Badge,
  buttonClasses,
  Card,
  CardHeader,
  ErrorState,
  KeyValue,
  LoadingBlock,
  PageHeader,
} from '@/shared/ui';
import { AppointmentHistoryTable } from '../components/AppointmentHistoryTable';
import { useClientDetail } from '../hooks/useClients';

export function ClientDetailPage() {
  const { clientId } = useParams();
  const { data: client, isLoading, isError, error, refetch } = useClientDetail(clientId);
  if (isLoading) return <LoadingBlock />;
  if (isError || !client) return <ErrorState error={error} onRetry={() => void refetch()} />;

  return (
    <>
      <PageHeader
        title={`${client.firstName} ${client.lastName}`}
        icon={<UserRound className="size-7" />}
        aside={client.hasAccount ? <Badge tone="success">Registrado</Badge> : <Badge>Invitado</Badge>}
        actions={
          <a
            href={buildWhatsAppUrl(client.phone, '')}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ variant: 'secondary' })}
          >
            <MessageCircle className="size-4" aria-hidden /> Abrir chat
          </a>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Card className="h-fit">
          <CardHeader title="Ficha" />
          <dl>
            <KeyValue label="DNI" value={client.dni} />
            <KeyValue label="Teléfono" value={client.phone} />
            <KeyValue label="Email" value={client.email ?? '—'} />
            <KeyValue label="Turnos" value={client.appointments.length} />
          </dl>
        </Card>
        <Card>
          <CardHeader title="Historial de turnos" />
          <AppointmentHistoryTable appointments={client.appointments} />
        </Card>
      </div>
    </>
  );
}
