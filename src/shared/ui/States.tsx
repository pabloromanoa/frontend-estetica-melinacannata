import type { ReactNode } from 'react';
import { CircleAlert, Inbox } from 'lucide-react';
import { getErrorMessage } from '@/shared/api/api-error';
import { Button } from './Button';

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border-strong px-6 py-12 text-center">
      <span className="text-ink-faint" aria-hidden>
        {icon ?? <Inbox className="size-8" />}
      </span>
      <p className="font-semibold text-ink">{title}</p>
      {description && <p className="max-w-md text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({
  error,
  onRetry,
  title = 'No pudimos cargar la información',
}: {
  error: unknown;
  onRetry?: () => void;
  title?: string;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-danger-bg px-6 py-10 text-center"
    >
      <CircleAlert className="size-8 text-danger" aria-hidden />
      <p className="font-semibold text-ink">{title}</p>
      <p className="text-sm text-ink-soft">{getErrorMessage(error)}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-2">
          Reintentar
        </Button>
      )}
    </div>
  );
}
