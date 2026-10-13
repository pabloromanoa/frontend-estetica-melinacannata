import type { ReactNode } from 'react';
import { MessageSquareText } from 'lucide-react';
import { BUSINESS_NAME } from '@/config/constants';
import type { Appointment } from '@/domain';
import { AppointmentDetailCard } from './AppointmentDetailCard';
import { LiveStatusTracker } from './LiveStatusTracker';
import { ReceiptSection, type ReceiptSectionProps } from './ReceiptSection';
import { TransferDetailsCard } from './TransferDetailsCard';

interface AppointmentTrackingViewProps extends Omit<ReceiptSectionProps, 'appointment'> {
  appointment: Appointment;
  banner?: ReactNode;
  actions?: ReactNode;
  showClient?: boolean;
  contactHref?: string;
}

/**
 * Composición "Seguimiento" (prototipo seguimiento-cliente), compartida por staff, cliente e invitado.
 * Es presentacional: cada página decide qué acciones habilita.
 */
export function AppointmentTrackingView({
  appointment,
  banner,
  actions,
  showClient,
  contactHref,
  ...receipt
}: AppointmentTrackingViewProps) {
  return (
    <div className="space-y-6">
      {banner}
      <div className="grid gap-6 lg:grid-cols-2">
        <AppointmentDetailCard appointment={appointment} showClient={showClient} actions={actions} />
        <div className="space-y-6">
          <TransferDetailsCard appointment={appointment}>
            <ReceiptSection appointment={appointment} {...receipt} />
          </TransferDetailsCard>
          <LiveStatusTracker appointment={appointment} />
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-2 text-sm text-ink-soft">
        <span>Pago seguro • {BUSINESS_NAME} Salud & Estética</span>
        {contactHref && (
          <a
            href={contactHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary"
          >
            <MessageSquareText className="size-4" aria-hidden /> ¿Dudas con tu turno? Hablar con secretaría
          </a>
        )}
      </div>
    </div>
  );
}
