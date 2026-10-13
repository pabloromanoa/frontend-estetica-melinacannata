import { Download } from 'lucide-react';
import { useObjectUrl } from '@/shared/hooks/useObjectUrl';
import { buttonClasses } from './button-styles';
import { LoadingBlock } from './Spinner';
import { ErrorState } from './States';
import { Modal } from './Modal';

interface PdfViewerModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  blob: Blob | undefined;
  isLoading: boolean;
  error: unknown;
  onRetry?: () => void;
  fileName?: string;
}

/** Visor de PDF: recibe el Blob (descargado con credenciales) y lo muestra con una blob URL. */
export function PdfViewerModal({
  open,
  onClose,
  title,
  blob,
  isLoading,
  error,
  onRetry,
  fileName = 'comprobante.pdf',
}: PdfViewerModalProps) {
  const url = useObjectUrl(open ? blob : null);
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="xl"
      footer={
        url ? (
          <a href={url} download={fileName} className={buttonClasses({ variant: 'secondary' })}>
            <Download className="size-4" aria-hidden />
            Descargar
          </a>
        ) : undefined
      }
    >
      {isLoading && <LoadingBlock label="Cargando comprobante…" />}
      {Boolean(error) && !isLoading && (
        <ErrorState error={error} onRetry={onRetry} title="No pudimos abrir el comprobante" />
      )}
      {url && !isLoading && (
        <object
          data={url}
          type="application/pdf"
          className="h-[70vh] w-full rounded-xl border border-border"
          aria-label={title}
        >
          <iframe src={url} title={title} className="h-[70vh] w-full rounded-xl" />
        </object>
      )}
    </Modal>
  );
}
