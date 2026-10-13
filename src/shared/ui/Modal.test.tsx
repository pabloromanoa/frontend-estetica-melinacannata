import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal', () => {
  it('es un diálogo accesible, enfoca adentro y cierra con Esc', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Confirmar">
        <button type="button">Acción</button>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Confirmar' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('no renderiza nada cerrado', () => {
    render(
      <Modal open={false} onClose={vi.fn()} title="X">
        contenido
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
