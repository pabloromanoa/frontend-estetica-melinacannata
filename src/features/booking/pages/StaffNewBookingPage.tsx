import { CalendarCheck } from 'lucide-react';
import { Badge, PageHeader } from '@/shared/ui';
import { PatientServiceCard } from '../components/PatientServiceCard';
import { SettlementCard } from '../components/SettlementCard';
import { SuggestedSlotsCard } from '../components/SuggestedSlotsCard';
import { STAFF_BOOKING_STEPS, useStaffBookingDraft } from '../hooks/useStaffBookingDraft';

/** "Nueva Reserva" del panel (prototipo nueva-reserva). */
export function StaffNewBookingPage() {
  const draft = useStaffBookingDraft();
  return (
    <>
      <PageHeader
        title="Nueva Reserva"
        icon={<CalendarCheck className="size-7" />}
        description="Configuración ágil del turno con asignación de profesional y envío de seña."
        actions={
          <span className="flex items-center gap-2 text-sm text-ink-soft">
            Paso {draft.step} de 3:
            <Badge tone="neutral" className="bg-surface-sunken text-sm text-ink">
              {STAFF_BOOKING_STEPS[draft.step - 1]}
            </Badge>
          </span>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <PatientServiceCard draft={draft} />
          <SuggestedSlotsCard draft={draft} />
        </div>
        <SettlementCard draft={draft} />
      </div>
    </>
  );
}
