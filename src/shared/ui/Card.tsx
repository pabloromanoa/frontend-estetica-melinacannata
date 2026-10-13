import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export function Card({ className, ...rest }: ComponentProps<'section'>) {
  return <section className={cn('rounded-2xl bg-surface p-5 shadow-card md:p-6', className)} {...rest} />;
}

interface CardHeaderProps {
  title: ReactNode;
  icon?: ReactNode;
  /** Número de paso (círculo) como en "Nueva Reserva". */
  step?: number;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
  titleId?: string;
}

export function CardHeader({ title, icon, step, subtitle, actions, className, titleId }: CardHeaderProps) {
  return (
    <header
      className={cn(
        'mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {step !== undefined && (
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-sunken text-xs font-semibold text-ink-soft">
            {step}
          </span>
        )}
        {icon && (
          <span className="shrink-0 text-primary" aria-hidden>
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h2 id={titleId} className="truncate text-lg font-semibold text-ink">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-ink-soft">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

/** Bloque beige interno (como "TRATAMIENTO", "FECHA & HORARIO" en Seguimiento). */
export function InfoTile({
  icon,
  label,
  title,
  detail,
}: {
  icon?: ReactNode;
  label: string;
  title: ReactNode;
  detail?: ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-xl bg-surface-muted p-4">
      {icon && (
        <span className="mt-0.5 text-primary" aria-hidden>
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</p>
        <p className="text-lg text-ink">{title}</p>
        {detail && <p className="text-sm text-ink-soft">{detail}</p>}
      </div>
    </div>
  );
}

/** Fila etiqueta/valor. */
export function KeyValue({
  label,
  value,
  mono,
  emphasis,
}: {
  label: ReactNode;
  value: ReactNode;
  mono?: boolean;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2 last:border-0">
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd
        className={cn(
          'text-right text-sm text-ink',
          mono && 'font-mono text-xs',
          emphasis && 'font-semibold text-primary',
        )}
      >
        {value}
      </dd>
    </div>
  );
}
