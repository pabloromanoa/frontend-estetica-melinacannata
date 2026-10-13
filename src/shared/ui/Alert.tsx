import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import type { Tone } from '@/domain';
import { cn } from '@/shared/lib/cn';
import { TONE_ALERT_CLASSES } from '@/shared/lib/tone-classes';

const ICONS: Partial<Record<Tone, ReactNode>> = {
  success: <CheckCircle2 className="size-5" />,
  danger: <AlertCircle className="size-5" />,
  warning: <AlertCircle className="size-5" />,
};

export function Alert({
  tone = 'neutral',
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-xl border p-4 text-sm', TONE_ALERT_CLASSES[tone], className)}
    >
      <span className="mt-0.5 shrink-0" aria-hidden>
        {ICONS[tone] ?? <Info className="size-5" />}
      </span>
      <div className="min-w-0 space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="text-ink">{children}</div>}
      </div>
    </div>
  );
}
