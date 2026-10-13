import { BYTES_PER_MB, MAX_RECEIPT_MB, RECEIPT_MIME_TYPE } from '@/config/constants';

export type ReceiptValidation = { ok: true } | { ok: false; error: string };

interface FileLike {
  name: string;
  type: string;
  size: number;
}

export const MAX_RECEIPT_BYTES = MAX_RECEIPT_MB * BYTES_PER_MB;

/** Valida el comprobante en el cliente: sólo PDF y hasta 5 MB (el backend vuelve a validar). */
export function validateReceiptFile(file: FileLike | null | undefined): ReceiptValidation {
  if (!file) return { ok: false, error: 'Seleccioná el comprobante en PDF.' };
  const isPdf =
    file.type === RECEIPT_MIME_TYPE || (file.type === '' && file.name.toLowerCase().endsWith('.pdf'));
  if (!isPdf) return { ok: false, error: 'El comprobante tiene que ser un archivo PDF.' };
  if (file.size === 0) return { ok: false, error: 'El archivo está vacío.' };
  if (file.size > MAX_RECEIPT_BYTES) {
    return { ok: false, error: `El archivo supera el máximo de ${MAX_RECEIPT_MB} MB.` };
  }
  return { ok: true };
}

/** "1,2 MB" / "350 KB". */
export function formatFileSize(bytes: number): string {
  const KB = 1024;
  if (bytes < BYTES_PER_MB) return `${Math.max(1, Math.round(bytes / KB))} KB`;
  return `${(bytes / BYTES_PER_MB).toFixed(1).replace('.', ',')} MB`;
}
