import { navigationFor } from './navigation';

describe('navigationFor', () => {
  it('PROVIDER ve sólo la gestión clínica', () => {
    const sections = navigationFor(['PROVIDER']);
    expect(sections).toHaveLength(1);
    expect(sections[0]?.items.map((i) => i.label)).toEqual([
      'Agenda Diaria',
      'Agenda Semanal',
      'Nueva Reserva',
      'Control de Señas',
      'Disponibilidad Semanal',
      'Seguimiento Cliente',
    ]);
  });

  it('ADMIN ve todo', () => {
    const sections = navigationFor(['ADMIN']);
    expect(sections).toHaveLength(2);
    expect(sections[1]?.items.some((i) => i.to === '/panel/informes')).toBe(true);
  });

  it('CLIENT no ve el panel', () => {
    expect(navigationFor(['CLIENT'])).toEqual([]);
  });
});
