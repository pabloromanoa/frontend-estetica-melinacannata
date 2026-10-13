import type { ReactNode } from 'react';
import { Card } from '@/shared/ui';

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-xl py-10">
      <Card>
        <h1 className="text-2xl font-semibold text-ink">{title}</h1>
        {subtitle && <p className="mt-1 mb-6 text-ink-soft">{subtitle}</p>}
        {children}
        {footer && (
          <div className="mt-6 border-t border-border pt-4 text-center text-sm text-ink-soft">{footer}</div>
        )}
      </Card>
    </div>
  );
}
