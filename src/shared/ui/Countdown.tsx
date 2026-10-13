import { useEffect, useRef } from 'react';
import { Timer } from 'lucide-react';
import { COUNTDOWN_TICK_MS } from '@/config/constants';
import { formatCountdown, holdProgress, secondsRemaining, type IsoDateTime } from '@/domain';
import { useNow } from '@/shared/hooks/useNow';
import { cn } from '@/shared/lib/cn';

interface CountdownProps {
  expiresAt: IsoDateTime | null;
  onExpire?: () => void;
  label?: string;
  className?: string;
}

/** Cuenta regresiva del bloqueo de 5 minutos. Llama a `onExpire` una única vez al llegar a 0. */
export function Countdown({
  expiresAt,
  onExpire,
  label = 'Tiempo para adjuntar el comprobante',
  className,
}: CountdownProps) {
  const now = useNow(COUNTDOWN_TICK_MS);
  const seconds = secondsRemaining(expiresAt, now);
  const fired = useRef(false);

  useEffect(() => {
    if (seconds === 0 && !fired.current) {
      fired.current = true;
      onExpire?.();
    }
  }, [seconds, onExpire]);

  const progress = holdProgress(seconds);
  const LOW_PROGRESS = 0.2;
  const urgent = progress < LOW_PROGRESS;
  return (
    <div className={cn('rounded-xl bg-surface-muted p-4', className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm text-ink-soft">
          <Timer className="size-4" aria-hidden />
          {label}
        </span>
        <span
          role="timer"
          aria-live="off"
          className={cn('font-mono text-xl font-semibold', urgent ? 'text-danger' : 'text-primary')}
        >
          {formatCountdown(seconds)}
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-sunken" aria-hidden>
        <div
          className={cn('h-full rounded-full transition-all', urgent ? 'bg-danger' : 'bg-primary')}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
