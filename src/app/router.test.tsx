import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import type { AgendaDay, SessionUser } from '@/domain';
import { AuthProvider } from '@/features/auth';
import { makeAppointment, makeService, providerFixture } from '@/test/fixtures';
import { createQueryClient } from './query-client';
import { routes } from './router';

type Handler = (url: URL) => { status: number; body?: unknown };

function stubApi(handler: Handler) {
  vi.stubGlobal(
    'fetch',
    vi.fn((input: RequestInfo | URL) => {
      const url = new URL(String(input));
      const { status, body } = handler(url);
      return Promise.resolve(
        new Response(body === undefined ? null : JSON.stringify(body), {
          status,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    }),
  );
}

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <QueryClientProvider client={createQueryClient()}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>,
  );
  return router;
}

const unauthenticated = {
  status: 401,
  body: { error: { code: 'UNAUTHENTICATED', message: 'Iniciá sesión' } },
};

describe('router (smoke)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('muestra el catálogo público sin sesión', async () => {
    stubApi((url) => {
      if (url.pathname.endsWith('/auth/me')) return unauthenticated;
      if (url.pathname.endsWith('/catalog/categories'))
        return { status: 200, body: { data: [{ id: 'cat-1', name: 'Uñas', isActive: true }] } };
      if (url.pathname.endsWith('/catalog/services')) return { status: 200, body: { data: [makeService()] } };
      return { status: 404 };
    });
    renderAt('/');
    expect(await screen.findByRole('heading', { name: 'Nuestros servicios' })).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: 'Manicuría Rusa' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ingresar' })).toBeInTheDocument();
  });

  it('redirige al login si un invitado entra al panel', async () => {
    stubApi(() => unauthenticated);
    const router = renderAt('/panel/agenda');
    expect(await screen.findByRole('heading', { name: 'Ingresar' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/ingresar');
  });

  it('un PROVIDER ve la agenda diaria con sus turnos y sin el menú de administración', async () => {
    const user: SessionUser = {
      id: 'u1',
      email: 'c@v.com',
      firstName: 'Camila',
      lastName: 'Vega',
      roles: ['PROVIDER'],
      providerId: 'prov-1',
      clientId: null,
    };
    const agenda: AgendaDay = {
      date: '2026-10-25',
      providers: [
        {
          ...providerFixture,
          workingRanges: [{ startTime: '09:00', endTime: '18:00' }],
          appointments: [makeAppointment({ status: 'DEPOSIT_PAID', holdExpiresAt: null })],
        },
      ],
      summary: { appointments: 1, capacityMinutes: 540, bookedMinutes: 90, pendingDeposits: 0, freeGaps: 2 },
    };
    stubApi((url) => {
      if (url.pathname.endsWith('/auth/me')) return { status: 200, body: { data: user } };
      if (url.pathname.endsWith('/agenda/day')) return { status: 200, body: { data: agenda } };
      if (url.pathname.endsWith('/deposits'))
        return { status: 200, body: { data: [], meta: { total: 0, pendingAmount: 0 } } };
      if (url.pathname.includes('/catalog/')) return { status: 200, body: { data: [] } };
      return { status: 404 };
    });
    renderAt('/panel/agenda?fecha=2026-10-25');
    expect(await screen.findByText('Florencia Benítez')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Florencia Benítez, Manicuría Rusa, 14:30 - 16:00 \(90m\), Señado/ }),
    ).toHaveTextContent('Seña OK');
    expect(screen.getByText('Resumen del Día')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Agenda Diaria/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Informes/ })).not.toBeInTheDocument();
    expect(screen.getByText('Domingo 25 de Octubre')).toBeInTheDocument();
  });
});
