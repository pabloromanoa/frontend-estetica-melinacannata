import { Clock, Pencil } from 'lucide-react';
import { clientToGuest, formatARS } from '@/domain';
import { ClientSearchBox } from '@/features/admin-clients';
import { Avatar, Button, Card, CardHeader, FormField, Select } from '@/shared/ui';
import type { StaffBookingDraft } from '../hooks/useStaffBookingDraft';
import { GuestDetailsForm } from './GuestDetailsForm';

/** Paso 1 de "Nueva Reserva": paciente (existente o nuevo) + servicio + profesional. */
export function PatientServiceCard({ draft }: { draft: StaffBookingDraft }) {
  const { service, patient } = draft;
  const showSummary = !draft.editing && patient && service;

  return (
    <Card>
      <CardHeader
        step={1}
        title="Paciente y Servicio"
        actions={
          showSummary ? (
            <Button
              variant="link"
              size="sm"
              leftIcon={<Pencil className="size-4" aria-hidden />}
              onClick={draft.edit}
            >
              Modificar
            </Button>
          ) : undefined
        }
      />
      {showSummary ? (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-surface-muted p-4">
            <Avatar
              name={`${patient.firstName} ${patient.lastName}`}
              className="bg-warning-bg text-primary"
            />
            <div>
              <p className="font-semibold text-ink">
                {patient.firstName} {patient.lastName}
              </p>
              <p className="text-sm text-ink-soft">{patient.phone}</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-muted p-4">
            <div className="min-w-0">
              <p className="truncate font-semibold text-ink">{service.name}</p>
              <p className="flex items-center gap-1 text-sm text-ink-soft">
                <Clock className="size-3.5" aria-hidden /> {service.durationMinutes} min
              </p>
            </div>
            <p className="text-lg font-semibold text-ink">{formatARS(service.price)}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Servicio" htmlFor="nb-service" required>
              <Select
                id="nb-service"
                value={service?.id ?? ''}
                onChange={(e) => draft.setService(e.target.value)}
              >
                <option value="">Elegí un servicio…</option>
                {draft.services.data?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.durationMinutes} min · {formatARS(item.price)}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField
              label="Profesional"
              htmlFor="nb-provider"
              hint={draft.lockedProviderId ? 'Reservás en tu propia agenda.' : undefined}
            >
              <Select
                id="nb-provider"
                value={draft.providerId ?? ''}
                disabled={Boolean(draft.lockedProviderId) || !service}
                onChange={(e) => draft.setProvider(e.target.value || null)}
              >
                <option value="">Sin preferencia</option>
                {service?.providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.displayName}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
          {draft.isAdmin && <ClientSearchBox onPick={(client) => draft.setPatient(clientToGuest(client))} />}
          {patient && (
            <p className="text-sm text-ink-soft">
              Paciente seleccionado:{' '}
              <strong className="text-ink">
                {patient.firstName} {patient.lastName}
              </strong>{' '}
              (DNI {patient.dni})
            </p>
          )}
          <div>
            <p className="mb-3 text-sm font-medium text-ink">
              {draft.isAdmin ? 'O cargá un paciente nuevo' : 'Datos del paciente'}
            </p>
            <GuestDetailsForm
              key={patient?.dni ?? 'new'}
              idPrefix="nb-patient"
              defaultValues={patient ? { ...patient, email: patient.email ?? '' } : undefined}
              submitLabel={service ? 'Continuar' : 'Guardar paciente'}
              onSubmit={draft.setPatient}
            />
          </div>
          {patient && service && (
            <Button variant="secondary" onClick={draft.finishEditing}>
              Ver horarios
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
