import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { makeSlot } from '@/test/fixtures';
import { CONTIGUOUS_LABEL, SlotPicker } from './SlotPicker';

describe('SlotPicker', () => {
  const contiguous = makeSlot({
    startAt: '2026-10-25T17:30:00.000Z',
    endAt: '2026-10-25T19:00:00.000Z',
    contiguous: true,
  });
  const regular = makeSlot({ startAt: '2026-10-25T20:30:00.000Z', endAt: '2026-10-25T22:00:00.000Z' });

  it('marca "Turno continuo sin demoras" sólo en los slots contiguos', () => {
    render(<SlotPicker slots={[contiguous, regular]} selectedKey={null} onSelect={() => {}} />);
    expect(screen.getAllByText(CONTIGUOUS_LABEL, { exact: false })).toHaveLength(1);
    const options = screen.getAllByRole('radio');
    expect(options).toHaveLength(2);
    expect(options[0]?.closest('label')).toHaveTextContent(CONTIGUOUS_LABEL);
    expect(options[1]?.closest('label')).not.toHaveTextContent(CONTIGUOUS_LABEL);
  });

  it('muestra el badge Recomendado, la selección y notifica el cambio', async () => {
    const onSelect = vi.fn();
    render(
      <SlotPicker
        slots={[contiguous, regular]}
        selectedKey={contiguous.startAt}
        recommendedKey={contiguous.startAt}
        onSelect={onSelect}
        showDate
      />,
    );
    expect(screen.getByText('Recomendado')).toBeInTheDocument();
    expect(screen.getByText('Seleccionado')).toBeInTheDocument();
    expect(screen.getByText(/Domingo 25 de Octubre • 14:30 hs/)).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText(/17:30 hs/));
    expect(onSelect).toHaveBeenCalledWith(regular);
  });

  it('muestra un estado vacío', () => {
    render(<SlotPicker slots={[]} selectedKey={null} onSelect={() => {}} emptyMessage="Probá otro día" />);
    expect(screen.getByText('Probá otro día')).toBeInTheDocument();
  });
});
