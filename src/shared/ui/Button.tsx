import type { ComponentProps } from 'react';
import { Link, type LinkProps } from 'react-router';
import { cn } from '@/shared/lib/cn';
import {
  buttonClasses,
  ICON_SIZE_CLASSES,
  VARIANT_CLASSES,
  type ButtonSize,
  type ButtonVariant,
  type StyleProps,
} from './button-styles';
import { Spinner } from './Spinner';

type ButtonProps = ComponentProps<'button'> & StyleProps & { loading?: boolean };

export function Button({
  variant,
  size,
  fullWidth,
  leftIcon,
  rightIcon,
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, fullWidth }, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner size="sm" label="Procesando" /> : leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}

type ButtonLinkProps = LinkProps & StyleProps;

/** Link con estética de botón (navegación, no acciones). */
export function ButtonLink({
  variant,
  size,
  fullWidth,
  leftIcon,
  rightIcon,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={buttonClasses({ variant, size, fullWidth }, className)} {...rest}>
      {leftIcon}
      {children}
      {rightIcon}
    </Link>
  );
}

type IconButtonProps = Omit<ComponentProps<'button'>, 'aria-label'> & {
  /** Obligatorio: los botones sólo-ícono necesitan nombre accesible. */
  'aria-label': string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function IconButton({
  variant = 'ghost',
  size = 'md',
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        VARIANT_CLASSES[variant],
        ICON_SIZE_CLASSES[size],
        className,
      )}
      {...rest}
    />
  );
}
