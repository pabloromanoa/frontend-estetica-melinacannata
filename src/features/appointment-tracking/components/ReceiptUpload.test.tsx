import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MAX_RECEIPT_BYTES } from '@/domain';
import { ReceiptUpload } from './ReceiptUpload';

function fileOfSize(name: string, type: string, size: number): File {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

describe('ReceiptUpload', () => {
  const user = userEvent.setup({ applyAccept: false });

  it('rechaza archivos que no son PDF', async () => {
    const onUpload = vi.fn();
    render(<ReceiptUpload onUpload={onUpload} />);
    await user.upload(
      screen.getByLabelText('Comprobante de transferencia en PDF'),
      fileOfSize('foto.jpg', 'image/jpeg', 1000),
    );
    expect(screen.getByRole('alert')).toHaveTextContent('El comprobante tiene que ser un archivo PDF.');
    expect(screen.getByRole('button', { name: 'Enviar comprobante' })).toBeDisabled();
  });

  it('rechaza PDFs de más de 5 MB', async () => {
    render(<ReceiptUpload onUpload={vi.fn()} />);
    await user.upload(
      screen.getByLabelText('Comprobante de transferencia en PDF'),
      fileOfSize('c.pdf', 'application/pdf', MAX_RECEIPT_BYTES + 1),
    );
    expect(screen.getByRole('alert')).toHaveTextContent('El archivo supera el máximo de 5 MB.');
    expect(screen.getByRole('button', { name: 'Enviar comprobante' })).toBeDisabled();
  });

  it('envía un PDF válido', async () => {
    const onUpload = vi.fn();
    render(<ReceiptUpload onUpload={onUpload} />);
    const file = fileOfSize('comprobante.pdf', 'application/pdf', 2048);
    await user.upload(screen.getByLabelText('Comprobante de transferencia en PDF'), file);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('comprobante.pdf')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Enviar comprobante' }));
    expect(onUpload).toHaveBeenCalledWith(file);
  });

  it('muestra el error del servidor', () => {
    render(<ReceiptUpload onUpload={vi.fn()} errorMessage="Venció el tiempo de reserva" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Venció el tiempo de reserva');
  });
});
