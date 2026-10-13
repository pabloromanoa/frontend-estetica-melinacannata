import { toDateKey } from '@/domain';
import { Card, CardHeader, ErrorState, FormField, Input, LoadingBlock, Tabs } from '@/shared/ui';
import type { SlotMode, StaffBookingDraft } from '../hooks/useStaffBookingDraft';
import { SlotPicker } from './SlotPicker';

const MODES = [
  { id: 'suggested', label: 'Próximos días' },
  { id: 'date', label: 'Elegir fecha' },
] as const satisfies ReadonlyArray<{ id: SlotMode; label: string }>;

/** Paso 2 de "Nueva Reserva": horarios sugeridos (badge "Recomendado" y "Turno continuo sin demoras"). */
export function SuggestedSlotsCard({ draft }: { draft: StaffBookingDraft }) {
  const provider = draft.service?.providers.find((p) => p.id === draft.providerId);
  const ready = Boolean(draft.patient && draft.service && !draft.editing);
  return (
    <Card aria-disabled={!ready} className={ready ? undefined : 'opacity-60'}>
      <CardHeader
        step={2}
        title="Horarios Disponibles Sugeridos"
        actions={
          provider ? (
            <span className="text-sm text-ink-soft">
              {provider.displayName}
              {provider.specialty ? ` • ${provider.specialty}` : ''}
            </span>
          ) : undefined
        }
      />
      {!ready ? (
        <p className="text-sm text-ink-soft">Completá paciente y servicio para ver horarios.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-end gap-4">
            <Tabs
              label="Modo de búsqueda"
              items={MODES}
              value={draft.slotMode}
              onChange={draft.setSlotMode}
            />
            {draft.slotMode === 'date' && (
              <FormField label="Fecha" htmlFor="nb-date">
                <Input
                  id="nb-date"
                  type="date"
                  min={toDateKey(new Date())}
                  value={draft.date}
                  onChange={(e) => e.target.value && draft.setDate(e.target.value)}
                />
              </FormField>
            )}
          </div>
          {draft.slots.isLoading && <LoadingBlock label="Buscando horarios…" />}
          {draft.slots.isError && (
            <ErrorState error={draft.slots.error} onRetry={() => void draft.slots.refetch()} />
          )}
          {draft.slots.data && (
            <SlotPicker
              name="nb-slot"
              slots={draft.slots.data}
              selectedKey={draft.slot?.startAt ?? null}
              recommendedKey={draft.recommendedKey}
              onSelect={draft.selectSlot}
              showDate={draft.slotMode === 'suggested'}
              showProviders={!draft.providerId}
            />
          )}
        </div>
      )}
    </Card>
  );
}
