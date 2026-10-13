import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

const CONTROL_CLASSES =
  'w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-surface-muted aria-[invalid=true]:border-danger';

interface FormFieldProps {
  label: ReactNode;
  htmlFor: string;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

/** Envoltorio con label asociado (`htmlFor`), ayuda y error accesible. */
export function FormField({ label, htmlFor, error, hint, required, children, className }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {required && (
          <span className="text-danger" aria-hidden>
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="text-xs text-ink-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({ className, ...rest }: ComponentProps<'input'>) {
  return <input className={cn(CONTROL_CLASSES, 'h-10', className)} {...rest} />;
}

export function Textarea({ className, rows = 3, ...rest }: ComponentProps<'textarea'>) {
  return <textarea rows={rows} className={cn(CONTROL_CLASSES, 'py-2', className)} {...rest} />;
}

export function Select({ className, children, ...rest }: ComponentProps<'select'>) {
  return (
    <select className={cn(CONTROL_CLASSES, 'h-10 pr-8', className)} {...rest}>
      {children}
    </select>
  );
}

export function Checkbox({
  label,
  description,
  className,
  ...rest
}: ComponentProps<'input'> & { label: ReactNode; description?: ReactNode }) {
  return (
    <label className={cn('flex cursor-pointer items-start gap-3 text-sm text-ink', className)}>
      <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-primary" {...rest} />
      <span className="min-w-0 flex-1">
        {label}
        {description && <span className="block text-xs text-ink-soft">{description}</span>}
      </span>
    </label>
  );
}
