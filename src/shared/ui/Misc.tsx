import type { ReactNode } from 'react';
import { initials } from '@/domain';
import { cn } from '@/shared/lib/cn';

const AVATAR_SIZES = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-14 text-base' } as const;

export function Avatar({
  name,
  src,
  size = 'md',
  className,
}: {
  name: string;
  src?: string | null;
  size?: keyof typeof AVATAR_SIZES;
  className?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('shrink-0 rounded-full object-cover', AVATAR_SIZES[size], className)}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-primary-soft font-semibold text-primary',
        AVATAR_SIZES[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  icon,
  actions,
  aside,
}: {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
      <div className="min-w-0">
        <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight text-ink">
          {icon && (
            <span className="text-primary" aria-hidden>
              {icon}
            </span>
          )}
          {title}
          {aside}
        </h1>
        {description && <p className="mt-1 text-ink-soft">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}

/** Tarjeta KPI ("TURNOS HOY 18 / 22 cupos"). */
export function StatCard({
  label,
  value,
  suffix,
  icon,
  tone = 'neutral',
}: {
  label: string;
  value: ReactNode;
  suffix?: ReactNode;
  icon?: ReactNode;
  tone?: 'neutral' | 'warning';
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface p-5 shadow-card">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="text-4xl font-semibold text-ink">{value}</span>
          {suffix && <span className="text-sm text-ink-soft">{suffix}</span>}
        </p>
      </div>
      {icon && (
        <span
          aria-hidden
          className={cn(
            'grid size-12 place-items-center rounded-xl',
            tone === 'warning' ? 'bg-warning-bg text-warning' : 'bg-surface-sunken text-primary',
          )}
        >
          {icon}
        </span>
      )}
    </div>
  );
}

/** Tooltip simple (hover y foco). Útil para explicar controles deshabilitados. */
export function Tooltip({ content, children }: { content: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex" tabIndex={0} aria-label={content}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-56 -translate-x-1/2 rounded-lg bg-ink px-3 py-1.5 text-xs text-on-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100"
      >
        {content}
      </span>
    </span>
  );
}

/** Texto sólo para lectores de pantalla. */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}
