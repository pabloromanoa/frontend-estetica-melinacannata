import { useMemo, useState } from 'react';
import { SUGGESTED_SLOTS_DAYS, SUGGESTED_SLOTS_LIMIT } from '@/config/constants';
import {
  buildBookingMessage,
  buildGuestLink,
  buildWhatsAppUrl,
  pickRecommendedSlot,
  resolveSlotProvider,
  slotKey,
  toDateKey,
  type AvailableSlot,
  type CreateAppointmentResult,
  type DateKey,
  type GuestData,
} from '@/domain';
import { useAuth } from '@/features/auth';
import { useServices } from '@/features/catalog';
import { useDaySlots, useNextSlots } from './useAvailability';
import { useCreateAppointment } from './useCreateAppointment';

export const STAFF_BOOKING_STEPS = [
  'Paciente y Servicio',
  'Confirmación de Horario',
  'Resumen y Liquidación',
] as const;
export type SlotMode = 'suggested' | 'date';

/** Estado y casos de uso de "Nueva Reserva" del panel (capa de aplicación). */
export function useStaffBookingDraft() {
  const { user, isAdmin } = useAuth();
  /** Un PROVIDER que no es ADMIN reserva siempre en su propia agenda. */
  const lockedProviderId = !isAdmin ? (user?.providerId ?? null) : null;

  const services = useServices();
  const [patient, setPatient] = useState<GuestData | null>(null);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [providerId, setProviderId] = useState<string | null>(lockedProviderId);
  const [editing, setEditing] = useState(true);
  const [slotMode, setSlotMode] = useState<SlotMode>('suggested');
  const [date, setDate] = useState<DateKey>(() => toDateKey(new Date()));
  const [slot, setSlot] = useState<AvailableSlot | null>(null);
  const create = useCreateAppointment();
  const created: CreateAppointmentResult | undefined = create.data;

  const service = services.data?.find((item) => item.id === serviceId);
  const effectiveProviderId = lockedProviderId ?? providerId ?? undefined;
  const ready = Boolean(patient && service);
  const suggested = useNextSlots({
    serviceId: ready ? (serviceId ?? undefined) : undefined,
    providerId: effectiveProviderId,
    days: SUGGESTED_SLOTS_DAYS,
    limit: SUGGESTED_SLOTS_LIMIT,
  });
  const daySlots = useDaySlots({
    serviceId: ready && slotMode === 'date' ? (serviceId ?? undefined) : undefined,
    date,
    providerId: effectiveProviderId,
  });
  const slots = slotMode === 'suggested' ? suggested : daySlots;
  const recommended = useMemo(() => pickRecommendedSlot(slots.data ?? []), [slots.data]);

  const step: 1 | 2 | 3 = !ready || editing ? 1 : slot ? 3 : 2;
  const selectedProvider = slot ? resolveSlotProvider(slot, effectiveProviderId ?? null) : undefined;

  const message = useMemo(() => {
    if (!patient || !service || !slot) return '';
    const appointment = created?.appointment;
    return buildBookingMessage({
      clientFirstName: patient.firstName,
      serviceName: service.name,
      startAt: appointment?.startAt ?? slot.startAt,
      depositAmount: appointment?.depositAmount ?? service.depositAmount,
      bankDetails: appointment?.provider.bankDetails ?? null,
      providerName: appointment?.provider.displayName ?? selectedProvider?.displayName,
      privateLink: created?.guestAccessToken
        ? buildGuestLink(window.location.origin, created.guestAccessToken)
        : null,
    });
  }, [patient, service, slot, created, selectedProvider]);

  const resetSelection = () => {
    setSlot(null);
    create.reset();
  };

  return {
    isAdmin,
    lockedProviderId,
    services,
    service,
    patient,
    editing,
    step,
    slotMode,
    date,
    slot,
    slots,
    recommendedKey: recommended ? slotKey(recommended) : null,
    providerId: effectiveProviderId ?? null,
    selectedProvider,
    create,
    created,
    message,
    whatsappUrl: patient ? buildWhatsAppUrl(patient.phone, message) : '',
    setPatient: (value: GuestData) => {
      setPatient(value);
      resetSelection();
      if (serviceId) setEditing(false);
    },
    setService: (id: string) => {
      setServiceId(id || null);
      if (!lockedProviderId) setProviderId(null);
      resetSelection();
    },
    setProvider: (id: string | null) => {
      setProviderId(id);
      resetSelection();
    },
    finishEditing: () => setEditing(false),
    edit: () => {
      setEditing(true);
      resetSelection();
    },
    setSlotMode: (mode: SlotMode) => {
      setSlotMode(mode);
      resetSelection();
    },
    setDate: (value: DateKey) => {
      setDate(value);
      resetSelection();
    },
    selectSlot: (value: AvailableSlot) => {
      setSlot(value);
      create.reset();
    },
    confirm: () => {
      if (!patient || !service || !slot) return;
      create.mutate({
        serviceId: service.id,
        startAt: slot.startAt,
        providerId: selectedProvider?.id,
        guest: patient,
      });
    },
  };
}

export type StaffBookingDraft = ReturnType<typeof useStaffBookingDraft>;
