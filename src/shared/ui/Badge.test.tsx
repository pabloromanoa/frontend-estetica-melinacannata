import { render, screen } from '@testing-library/react';
import { DepositStatusBadge, StatusBadge } from './Badge';

describe('StatusBadge', () => {
  it.each([
    ['DEPOSIT_PAID', 'Seña OK', 'bg-success-bg'],
    ['CREATED', 'Seña Pend.', 'bg-danger'],
    ['PAYMENT_INFORMED', 'Por validar', 'bg-pending'],
    ['FINISHED', 'Finalizado', 'bg-neutral-bg'],
  ] as const)('%s muestra "%s" con el tono del prototipo', (status, text, toneClass) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(text)).toHaveClass(toneClass);
  });

  it('muestra la etiqueta completa con `full`', () => {
    render(<StatusBadge status="PAYMENT_INFORMED" full />);
    expect(screen.getByText('Pago informado')).toBeInTheDocument();
  });

  it('muestra el estado de la seña', () => {
    render(<DepositStatusBadge status="REJECTED" />);
    expect(screen.getByText('Rechazada')).toHaveClass('text-danger');
  });
});
