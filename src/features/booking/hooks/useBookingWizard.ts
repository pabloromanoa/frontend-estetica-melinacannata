import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import {
  getTreatmentStep,
  nextTreatmentStepIndex,
  pickRecommendedSlot,
  slotKey,
  toDateKey,
  type AvailableSlot,
  type DateKey,
  type Service,
} from '@/domain';
import { useService, useTreatment } from '@/features/catalog';
import { useDaySlots } from './useAvailability';

export const WIZARD_STEPS = ['Servicio', 'Profesional', 'Fecha y horario', 'Confirmación'] as const;
export type WizardStep = 0 | 1 | 2 | 3;

/**
 * Estado del wizard de reserva (capa de aplicación).
 * Servicio / prestador / tratamiento viven en la URL (permite "Repetir turno" y links desde el catálogo);
 * fecha y horario elegidos, en estado local.
 */
export function useBookingWizard() {
  const [params, setParams] = useSearchParams();
  const treatmentId = params.get('treatmentId');
  const treatmentStepIndex = Number(params.get('step') ?? 0);
  const recommendationId = params.get('recommendationId') ?? undefined;
  const providerId = params.get('providerId');

  const treatment = useTreatment(treatmentId);
  const treatmentStep = treatment.data ? getTreatmentStep(treatment.data, treatmentStepIndex) : null;
  const serviceId = treatmentStep?.service.id ?? params.get('serviceId');
  const serviceQuery = useService(treatmentStep ? null : serviceId);
  const service: Service | undefined = treatmentStep?.service ?? serviceQuery.data;

  const initialStep: WizardStep = serviceId || treatmentId ? (providerId ? 2 : 1) : 0;
  const [step, setStep] = useState<WizardStep>(initialStep);
  const [date, setDate] = useState<DateKey>(() => toDateKey(new Date()));
  const [slot, setSlot] = useState<AvailableSlot | null>(null);

  const slots = useDaySlots({ serviceId: serviceId ?? undefined, date, providerId: providerId ?? undefined });
  const recommendedKey = useMemo(() => {
    const recommended = pickRecommendedSlot(slots.data ?? []);
    return recommended ? slotKey(recommended) : null;
  }, [slots.data]);

  const setParam = (key: string, value: string | null) =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );

  const nextTreatmentParams = (): string | null => {
    if (!treatment.data || !treatmentId) return null;
    const nextIndex = nextTreatmentStepIndex(treatment.data, treatmentStepIndex);
    if (nextIndex === null) return null;
    const query = new URLSearchParams({ treatmentId, step: String(nextIndex) });
    if (recommendationId) query.set('recommendationId', recommendationId);
    return query.toString();
  };

  return {
    step,
    goTo: setStep,
    service,
    serviceLoading: serviceQuery.isLoading || treatment.isLoading,
    treatment: treatment.data ?? null,
    treatmentStep,
    recommendationId,
    providerId,
    date,
    slot,
    slots,
    recommendedKey,
    chooseService: (selected: Service) => {
      setParam('serviceId', selected.id);
      setParam('providerId', null);
      setSlot(null);
      setStep(1);
    },
    chooseProvider: (id: string | null) => {
      setParam('providerId', id);
      setSlot(null);
      setStep(2);
    },
    chooseDate: (value: DateKey) => {
      setDate(value);
      setSlot(null);
    },
    chooseSlot: setSlot,
    resetSlot: () => {
      setSlot(null);
      setStep(2);
      void slots.refetch();
    },
    nextTreatmentParams,
  };
}
