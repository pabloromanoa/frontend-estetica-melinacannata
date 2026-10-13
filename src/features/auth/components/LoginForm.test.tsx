import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('valida con zod antes de enviar', async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(await screen.findByText('Ingresá un email válido.')).toBeInTheDocument();
    expect(screen.getByText('Ingresá tu contraseña.')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toHaveAttribute('aria-invalid', 'true');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('rechaza un email mal formado', async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText(/Email/), 'no-es-email');
    await userEvent.type(screen.getByLabelText(/Contraseña/), 'secreta123');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(await screen.findByText('Ingresá un email válido.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('envía credenciales válidas', async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText(/Email/), 'melina@estetica.com');
    await userEvent.type(screen.getByLabelText(/Contraseña/), 'secreta123');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(onSubmit).toHaveBeenCalledWith(
      { email: 'melina@estetica.com', password: 'secreta123' },
      expect.anything(),
    );
  });

  it('muestra el error del servidor', () => {
    render(<LoginForm onSubmit={vi.fn()} errorMessage="Credenciales inválidas" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Credenciales inválidas');
  });
});
