import type { ReactNode } from 'react';
import {
  DEPOSIT_STATUS_META,
  getStatusMeta,
  type AppointmentStatus,
  type DepositStatus,
  type Tone,
} from '@/domain';
import { cn } from '@/shared/lib/cn';
import { TONE_BADGE_CLASSES, TONE_SOFT_BADGE_CLASSES } from '@/shared/lib/tone-classes';

interface BadgeProps {
  tone?: Tone;
  /** `soft` = fondo claro; `solid` = como "Seña Pend." del prototipo. */
  appearance?: 'soft' | 'solid';
  children: ReactNode;
  className?: string;
}

export function Badge({ tone = 'neutral', appearance = 'soft', children, className }: BadgeProps) {
  const classes = appearance === 'solid' ? TONE_BADGE_CLASSES[tone] : TONE_SOFT_BADGE_CLASSES[tone];
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold',
        classes,
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Badge de estado del turno: "Seña OK", "Seña Pend.", "Por validar"… (`full` muestra la etiqueta larga). */
export function StatusBadge({
  status,
  full = false,
  className,
}: {
  status: AppointmentStatus;
  full?: boolean;
  className?: string;
}) {
  const meta = getStatusMeta(status);
  return (
    <Badge tone={meta.tone} appearance="solid" className={className}>
      {full ? meta.label : meta.badge}
    </Badge>
  );
}

export function DepositStatusBadge({ status }: { status: DepositStatus }) {
  const meta = DEPOSIT_STATUS_META[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}
