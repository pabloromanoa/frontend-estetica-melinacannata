import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export type ButtonVariant =
  'primary' | 'secondary' | 'soft' | 'ghost' | 'danger' | 'destructive' | 'success' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover shadow-card',
  secondary: 'bg-surface text-ink border border-border hover:bg-surface-muted',
  soft: 'bg-surface-sunken text-ink hover:bg-sidebar-active',
  ghost: 'text-ink hover:bg-surface-muted',
  danger: 'text-danger hover:bg-danger-bg',
  destructive: 'bg-danger text-on-primary hover:opacity-90 shadow-card',
  success: 'bg-success-strong text-on-primary hover:bg-success',
  link: 'text-primary hover:underline px-0',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-5 text-base gap-2 rounded-xl',
};

export interface StyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function buttonClasses(
  { variant = 'primary', size = 'md', fullWidth }: StyleProps,
  extra?: string,
): string {
  return cn(
    'inline-flex items-center justify-center font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth && 'w-full',
    extra,
  );
}

export const ICON_SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'size-8 rounded-lg',
  md: 'size-10 rounded-xl',
  lg: 'size-12 rounded-full',
};
