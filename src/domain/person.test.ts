import { buildGuestLink, clientToGuest, hasAnyRole, hasRole, homePathFor, initials, isStaff } from './person';

describe('person', () => {
  it('calcula iniciales', () => {
    expect(initials('Florencia Benítez')).toBe('FB');
    expect(initials('  ana ')).toBe('A');
    expect(initials('Dra. Melina Cannata López')).toBe('DM');
  });

  it('evalúa roles', () => {
    const admin = { roles: ['PROVIDER', 'ADMIN'] as const };
    expect(hasRole({ roles: [...admin.roles] }, 'ADMIN')).toBe(true);
    expect(hasRole(null, 'ADMIN')).toBe(false);
    expect(hasAnyRole({ roles: ['CLIENT'] }, ['ADMIN', 'PROVIDER'])).toBe(false);
    expect(isStaff({ roles: ['PROVIDER'] })).toBe(true);
  });

  it('decide la ruta de inicio por rol', () => {
    expect(homePathFor({ roles: ['ADMIN'] })).toBe('/panel/agenda');
    expect(homePathFor({ roles: ['CLIENT'] })).toBe('/mi-cuenta');
    expect(homePathFor(null)).toBe('/');
  });

  it('arma el enlace privado del invitado', () => {
    expect(buildGuestLink('https://turnos.test/', 'a b')).toBe('https://turnos.test/turno/a%20b');
  });

  it('convierte un cliente existente en datos guest sin campos extra', () => {
    const client = {
      id: 'c1',
      firstName: 'Ana',
      lastName: 'Paz',
      dni: '30111222',
      phone: '1144445555',
      email: null,
      hasAccount: true,
    };
    expect(clientToGuest(client)).toEqual({
      firstName: 'Ana',
      lastName: 'Paz',
      dni: '30111222',
      phone: '1144445555',
    });
    expect(clientToGuest({ ...client, email: 'a@p.com' })).toHaveProperty('email', 'a@p.com');
  });
});
