import { Link2 } from 'lucide-react';
import { Alert, CopyButton } from '@/shared/ui';

/** Recordatorio para el invitado: este enlace privado es la única forma de volver a su turno. */
export function GuestLinkBanner({ link }: { link: string }) {
  return (
    <Alert tone="primary" title="Guardá este enlace privado">
      <p>
        Con este enlace podés ver el estado de tu turno, adjuntar el comprobante o cancelarlo. No lo
        compartas.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="flex min-w-0 items-center gap-2 rounded-lg bg-surface px-3 py-1.5 font-mono text-xs text-ink">
          <Link2 className="size-4 shrink-0 text-primary" aria-hidden />
          <span className="truncate">{link}</span>
        </span>
        <CopyButton value={link} label="Copiar enlace" />
      </div>
    </Alert>
  );
}
