import type { Tone } from '@/domain';

/** Traducción de tonos del dominio a utilidades del tema. */
export const TONE_BADGE_CLASSES: Record<Tone, string> = {
  success: 'bg-success-bg text-success',
  danger: 'bg-danger text-on-primary',
  warning: 'bg-warning-bg text-warning',
  pending: 'bg-pending text-on-primary',
  neutral: 'bg-neutral-bg text-ink-soft',
  primary: 'bg-primary-soft text-primary',
};

export const TONE_SOFT_BADGE_CLASSES: Record<Tone, string> = {
  success: 'bg-success-bg text-success',
  danger: 'bg-danger-bg text-danger',
  warning: 'bg-warning-bg text-warning',
  pending: 'bg-warning-bg text-pending',
  neutral: 'bg-neutral-bg text-ink-soft',
  primary: 'bg-primary-soft text-primary',
};

/** Tarjetas de turnos en la agenda (fondo + borde izquierdo). */
export const TONE_CARD_CLASSES: Record<Tone, string> = {
  success: 'bg-success-bg/60 border-l-success-strong',
  danger: 'bg-danger-bg border-l-danger',
  warning: 'bg-warning-bg border-l-warning',
  pending: 'bg-pending-bg border-l-pending',
  neutral: 'bg-neutral-bg border-l-ink-faint',
  primary: 'bg-primary-soft border-l-primary',
};

export const TONE_ALERT_CLASSES: Record<Tone, string> = {
  success: 'bg-success-bg text-success border-success/20',
  danger: 'bg-danger-bg text-danger border-danger/20',
  warning: 'bg-warning-bg text-warning border-warning/20',
  pending: 'bg-pending-bg text-pending border-pending/20',
  neutral: 'bg-surface-muted text-ink-soft border-border',
  primary: 'bg-primary-soft text-primary border-primary/20',
};

/** Colores como variables CSS del tema (para librerías que reciben colores por prop, ej. FullCalendar). */
export const TONE_CSS_VARS: Record<Tone, { background: string; border: string; text: string }> = {
  success: {
    background: 'var(--color-success-bg)',
    border: 'var(--color-success-strong)',
    text: 'var(--color-success)',
  },
  danger: {
    background: 'var(--color-danger-bg)',
    border: 'var(--color-danger)',
    text: 'var(--color-danger)',
  },
  warning: {
    background: 'var(--color-warning-bg)',
    border: 'var(--color-warning)',
    text: 'var(--color-warning)',
  },
  pending: {
    background: 'var(--color-pending-bg)',
    border: 'var(--color-pending)',
    text: 'var(--color-pending)',
  },
  neutral: {
    background: 'var(--color-neutral-bg)',
    border: 'var(--color-ink-faint)',
    text: 'var(--color-ink-soft)',
  },
  primary: {
    background: 'var(--color-primary-soft)',
    border: 'var(--color-primary)',
    text: 'var(--color-primary)',
  },
};
