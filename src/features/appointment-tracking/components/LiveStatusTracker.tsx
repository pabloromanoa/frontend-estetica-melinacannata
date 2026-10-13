import type { ReactNode } from 'react';
import { Check, Hourglass, TrendingUp, X } from 'lucide-react';
import { buildPaymentTracker, formatTime, type Appointment, type TrackerStepState } from '@/domain';
import { cn } from '@/shared/lib/cn';
import { Badge, Card, CardHeader } from '@/shared/ui';

const STATE_ICON: Record<TrackerStepState, ReactNode> = {
  done: <Check className="size-3.5" />,
  current: <Hourglass className="size-3.5" />,
  failed: <X className="size-3.5" />,
  upcoming: null,
};

const STATE_DOT: Record<TrackerStepState, string> = {
  done: 'bg-success-strong text-on-primary',
  current: 'bg-pending text-on-primary',
  failed: 'bg-danger text-on-primary',
  upcoming: 'border-2 border-border-strong bg-surface',
};

const STATE_TEXT: Record<TrackerStepState, string> = {
  done: 'text-ink',
  current: 'font-semibold text-pending',
  failed: 'font-semibold text-danger',
  upcoming: 'text-ink-faint',
};

const STATE_LABEL: Record<TrackerStepState, string> = {
  done: 'completado',
  current: 'en curso',
  failed: 'interrumpido',
  upcoming: 'pendiente',
};

/** "Estado en Vivo": tracker de 4 pasos derivado del estado del turno. */
export function LiveStatusTracker({ appointment }: { appointment: Appointment }) {
  const tracker = buildPaymentTracker(appointment);
  return (
    <Card>
      <CardHeader
        title="Estado en Vivo"
        icon={<TrendingUp className="size-5" />}
        actions={
          <Badge tone={tracker.halted ? 'danger' : 'warning'}>
            Paso {tracker.currentStep} de {tracker.totalSteps}
          </Badge>
        }
      />
      <ol className="space-y-4" aria-label="Progreso de la reserva">
        {tracker.steps.map((step) => (
          <li
            key={step.index}
            className="flex items-start gap-3"
            aria-current={step.state === 'current' ? 'step' : undefined}
          >
            <span
              className={cn(
                'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full',
                STATE_DOT[step.state],
              )}
              aria-hidden
            >
              {STATE_ICON[step.state]}
            </span>
            <div className="min-w-0 flex-1">
              <p className={STATE_TEXT[step.state]}>
                {step.title}
                <span className="sr-only"> ({STATE_LABEL[step.state]})</span>
              </p>
              {step.description && <p className="text-sm text-ink-soft">{step.description}</p>}
            </div>
            {step.timestamp && <span className="text-sm text-ink-soft">{formatTime(step.timestamp)} hs</span>}
          </li>
        ))}
      </ol>
    </Card>
  );
}
