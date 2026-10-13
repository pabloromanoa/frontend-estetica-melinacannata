import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface StepperProps {
  steps: readonly string[];
  /** Índice 0-based del paso actual. */
  current: number;
  className?: string;
}

export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <ol className={cn('flex flex-wrap items-center gap-2 text-sm', className)} aria-label="Progreso">
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step} className="flex items-center gap-2" aria-current={active ? 'step' : undefined}>
            <span
              className={cn(
                'grid size-7 place-items-center rounded-full text-xs font-semibold',
                done && 'bg-success-bg text-success',
                active && 'bg-primary text-on-primary',
                !done && !active && 'bg-surface-sunken text-ink-soft',
              )}
            >
              {done ? <Check className="size-4" aria-hidden /> : index + 1}
            </span>
            <span className={cn(active ? 'font-semibold text-ink' : 'text-ink-soft')}>{step}</span>
            {index < steps.length - 1 && <span className="mx-1 h-px w-6 bg-border-strong" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
