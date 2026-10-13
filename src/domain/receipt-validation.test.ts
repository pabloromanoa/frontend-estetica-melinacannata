import { formatFileSize, MAX_RECEIPT_BYTES, validateReceiptFile } from './receipt-validation';

describe('receipt-validation', () => {
  const pdf = (size: number, type = 'application/pdf', name = 'comprobante.pdf') => ({ name, type, size });

  it('acepta un PDF dentro del límite (incluye exactamente 5 MB)', () => {
    expect(validateReceiptFile(pdf(1024))).toEqual({ ok: true });
    expect(validateReceiptFile(pdf(MAX_RECEIPT_BYTES))).toEqual({ ok: true });
  });

  it('acepta extensión .pdf cuando el navegador no informa el tipo', () => {
    expect(validateReceiptFile(pdf(10, '', 'COMPROBANTE.PDF')).ok).toBe(true);
  });

  it('rechaza archivos que no son PDF', () => {
    expect(validateReceiptFile(pdf(10, 'image/jpeg', 'foto.jpg'))).toEqual({
      ok: false,
      error: 'El comprobante tiene que ser un archivo PDF.',
    });
    expect(validateReceiptFile(pdf(10, '', 'archivo.txt')).ok).toBe(false);
  });

  it('rechaza archivos de más de 5 MB o vacíos', () => {
    expect(validateReceiptFile(pdf(MAX_RECEIPT_BYTES + 1))).toEqual({
      ok: false,
      error: 'El archivo supera el máximo de 5 MB.',
    });
    expect(validateReceiptFile(pdf(0)).ok).toBe(false);
    expect(validateReceiptFile(null).ok).toBe(false);
  });

  it('formatea tamaños', () => {
    expect(formatFileSize(350 * 1024)).toBe('350 KB');
    expect(formatFileSize(10)).toBe('1 KB');
    expect(formatFileSize(1.25 * 1024 * 1024)).toBe('1,3 MB');
  });
});
