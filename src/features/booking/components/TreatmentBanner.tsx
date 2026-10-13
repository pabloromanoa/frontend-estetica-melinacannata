import { Route } from 'lucide-react';
import type { TreatmentStep } from '@/domain';
import { Alert } from '@/shared/ui';

export function TreatmentBanner({ treatmentName, step }: { treatmentName: string; step: TreatmentStep }) {
  return (
    <Alert tone="primary" title={`Tratamiento: ${treatmentName}`}>
      <span className="flex items-center gap-2">
        <Route className="size-4 text-primary" aria-hidden />
        Servicio {step.stepIndex + 1} de {step.totalSteps}: <strong>{step.service.name}</strong>. Cada
        servicio se reserva con su propio turno y seña.
      </span>
    </Alert>
  );
}
