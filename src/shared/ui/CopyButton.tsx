import { Check, Copy } from 'lucide-react';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';
import { Button } from './Button';
import type { ButtonSize, ButtonVariant } from './button-styles';

interface CopyButtonProps {
  value: string;
  label?: string;
  /** Qué se copia, para lectores de pantalla (ej. "alias"). */
  description?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function CopyButton({
  value,
  label = 'Copiar',
  description,
  variant = 'secondary',
  size = 'sm',
  className,
}: CopyButtonProps) {
  const { copied, failed, copy } = useCopyToClipboard();
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => void copy(value)}
      aria-label={description ? `${label} ${description}` : undefined}
      leftIcon={copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
    >
      <span aria-live="polite">{copied ? 'Copiado' : failed ? 'No se pudo copiar' : label}</span>
    </Button>
  );
}
