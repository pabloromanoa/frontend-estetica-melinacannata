import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeAppointment, makeDeposit } from '@/test/fixtures';
import { CancelAppointmentModal } from './CancelAppointmentModal';

describe('CancelAppointmentModal', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  const paid = makeAppointment({
    status: 'DEPOSIT_PAID',
    startAt: '2026-10-25T17:30:00.000Z',
    deposit: makeDeposit({ status: 'VERIFIED' }),
  });

  it('avisa devolución de seña con 24 h o más de anticipación', () => {
    vi.useFakeTimers({ now: new Date('2026-10-24T17:30:00.000Z'), toFake: ['Date'] });
    render(
      <CancelAppointmentModal
        open
        onClose={vi.fn()}
        appointment={paid}
        requireReason={false}
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.getByRole('dialog')).toHaveTextContent('Corresponde devolución de la seña');
  });

  it('avisa pérdida de seña con menos de 24 h', () => {
    vi.useFakeTimers({ now: new Date('2026-10-24T18:00:00.000Z'), toFake: ['Date'] });
    render(
      <CancelAppointmentModal
        open
        onClose={vi.fn()}
        appointment={paid}
        requireReason={false}
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.getByRole('dialog')).toHaveTextContent('Se pierde la seña');
  });

  it('exige motivo al staff antes de confirmar', async () => {
    const onConfirm = vi.fn();
    render(
      <CancelAppointmentModal
        open
        onClose={vi.fn()}
        appointment={paid}
        requireReason
        onConfirm={onConfirm}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Sí, cancelar turno' }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.getByText('Indicá el motivo de la cancelación.')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText(/Motivo/), 'Paciente enferma');
    await userEvent.click(screen.getByRole('button', { name: 'Sí, cancelar turno' }));
    expect(onConfirm).toHaveBeenCalledWith('Paciente enferma');
  });

  it('el cliente puede cancelar sin motivo y cerrar con Esc', async () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(
      <CancelAppointmentModal
        open
        onClose={onClose}
        appointment={paid}
        requireReason={false}
        onConfirm={onConfirm}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Sí, cancelar turno' }));
    expect(onConfirm).toHaveBeenCalledWith(undefined);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
