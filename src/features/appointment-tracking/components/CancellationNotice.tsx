import type { CancellationAssessment } from '@/domain';
import { Alert } from '@/shared/ui';

/** Aviso de política de cancelación (≥24 h devolución / <24 h pierde la seña), mostrado ANTES de confirmar. */
export function CancellationNotice({ assessment }: { assessment: CancellationAssessment }) {
  return (
    <Alert tone={assessment.tone === 'neutral' ? 'warning' : assessment.tone} title={assessment.title}>
      {assessment.message}
    </Alert>
  );
}
