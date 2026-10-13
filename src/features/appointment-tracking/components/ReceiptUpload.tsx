import { useId, useState, type ChangeEvent, type FormEvent } from 'react';
import { FileUp } from 'lucide-react';
import { MAX_RECEIPT_MB, RECEIPT_MIME_TYPE } from '@/config/constants';
import { formatFileSize, validateReceiptFile } from '@/domain';
import { Alert, Button } from '@/shared/ui';

interface ReceiptUploadProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
  errorMessage?: string | null;
  disabled?: boolean;
}

/** Adjuntar comprobante: sólo PDF de hasta 5 MB (validado en el cliente antes de enviar). */
export function ReceiptUpload({ onUpload, isUploading = false, errorMessage, disabled }: ReceiptUploadProps) {
  const inputId = useId();
  const [file, setFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    const result = validateReceiptFile(selected);
    setFile(result.ok ? selected : null);
    setValidationError(result.ok ? null : result.error);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (file) onUpload(file);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label
        htmlFor={inputId}
        className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface-muted p-5 text-center text-sm text-ink-soft hover:border-primary"
      >
        <FileUp className="size-6 text-primary" aria-hidden />
        <span className="font-semibold text-ink">{file ? file.name : 'Adjuntar comprobante (PDF)'}</span>
        <span>{file ? formatFileSize(file.size) : `Máximo ${MAX_RECEIPT_MB} MB`}</span>
      </label>
      <input
        id={inputId}
        type="file"
        accept={`${RECEIPT_MIME_TYPE},.pdf`}
        className="sr-only"
        onChange={onChange}
        disabled={disabled || isUploading}
        aria-label="Comprobante de transferencia en PDF"
      />
      {validationError && <Alert tone="danger">{validationError}</Alert>}
      {errorMessage && <Alert tone="danger">{errorMessage}</Alert>}
      <Button type="submit" fullWidth disabled={!file || disabled} loading={isUploading}>
        Enviar comprobante
      </Button>
    </form>
  );
}
