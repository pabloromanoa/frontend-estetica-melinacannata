import type { ComponentType } from 'react';
import { createBrowserRouter, Navigate, Outlet, type RouteObject } from 'react-router';
import { LoadingBlock } from '@/shared/ui';
import { RequireRole } from './guards';
import { NotFoundPage, RouteError } from './RouteError';
import { PublicShell } from './shells/PublicShell';
import { StaffShell } from './shells/StaffShell';

/** Carga diferida por feature (code splitting): cada página se importa desde el barrel de su feature. */
const page = (load: () => Promise<ComponentType>): Pick<RouteObject, 'lazy'> => ({
  lazy: async () => ({ Component: await load() }),
});

const publicRoutes: RouteObject[] = [
  { index: true, ...page(() => import('@/features/catalog').then((m) => m.CatalogPage)) },
  {
    path: 'servicios/:serviceId',
    ...page(() => import('@/features/catalog').then((m) => m.ServiceDetailPage)),
  },
  {
    path: 'tratamientos/:treatmentId',
    ...page(() => import('@/features/catalog').then((m) => m.TreatmentDetailPage)),
  },
  { path: 'reservar', ...page(() => import('@/features/booking').then((m) => m.BookingWizardPage)) },
  {
    path: 'recomendame',
    ...page(() => import('@/features/recommendations').then((m) => m.RecommendationPage)),
  },
  {
    path: 'turno/:token',
    ...page(() => import('@/features/guest-access').then((m) => m.GuestAppointmentPage)),
  },
  { path: 'ingresar', ...page(() => import('@/features/auth').then((m) => m.LoginPage)) },
  { path: 'registro', ...page(() => import('@/features/auth').then((m) => m.RegisterPage)) },
  {
    path: 'mi-cuenta',
    element: <RequireRole roles={['CLIENT']} />,
    children: [
      { index: true, ...page(() => import('@/features/client-portal').then((m) => m.MyAppointmentsPage)) },
      {
        path: 'turnos/:appointmentId',
        ...page(() => import('@/features/client-portal').then((m) => m.ClientAppointmentPage)),
      },
      {
        path: 'recomendaciones',
        ...page(() => import('@/features/client-portal').then((m) => m.MyRecommendationsPage)),
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
];

const adminRoutes: RouteObject[] = [
  { path: 'dashboard', ...page(() => import('@/features/admin-dashboard').then((m) => m.DashboardPage)) },
  { path: 'servicios', ...page(() => import('@/features/admin-catalog').then((m) => m.ServicesAdminPage)) },
  {
    path: 'servicios/nuevo',
    ...page(() => import('@/features/admin-catalog').then((m) => m.ServiceFormPage)),
  },
  {
    path: 'servicios/:serviceId',
    ...page(() => import('@/features/admin-catalog').then((m) => m.ServiceFormPage)),
  },
  { path: 'categorias', ...page(() => import('@/features/admin-catalog').then((m) => m.CategoriesPage)) },
  {
    path: 'tratamientos',
    ...page(() => import('@/features/admin-catalog').then((m) => m.TreatmentsAdminPage)),
  },
  {
    path: 'tratamientos/nuevo',
    ...page(() => import('@/features/admin-catalog').then((m) => m.TreatmentFormPage)),
  },
  {
    path: 'tratamientos/:treatmentId',
    ...page(() => import('@/features/admin-catalog').then((m) => m.TreatmentFormPage)),
  },
  { path: 'prestadores', ...page(() => import('@/features/admin-providers').then((m) => m.ProvidersPage)) },
  {
    path: 'prestadores/nuevo',
    ...page(() => import('@/features/admin-providers').then((m) => m.ProviderFormPage)),
  },
  {
    path: 'prestadores/:providerId',
    ...page(() => import('@/features/admin-providers').then((m) => m.ProviderFormPage)),
  },
  { path: 'clientes', ...page(() => import('@/features/admin-clients').then((m) => m.ClientsPage)) },
  {
    path: 'clientes/:clientId',
    ...page(() => import('@/features/admin-clients').then((m) => m.ClientDetailPage)),
  },
  { path: 'informes', ...page(() => import('@/features/reports').then((m) => m.ReportsPage)) },
];

const staffRoutes: RouteObject[] = [
  { index: true, element: <Navigate to="agenda" replace /> },
  { path: 'agenda', ...page(() => import('@/features/agenda').then((m) => m.AgendaDayPage)) },
  { path: 'mi-agenda', ...page(() => import('@/features/agenda').then((m) => m.MyWeekPage)) },
  { path: 'nueva-reserva', ...page(() => import('@/features/booking').then((m) => m.StaffNewBookingPage)) },
  { path: 'senas', ...page(() => import('@/features/deposits').then((m) => m.DepositsPage)) },
  {
    path: 'disponibilidad',
    ...page(() => import('@/features/availability').then((m) => m.AvailabilityPage)),
  },
  {
    path: 'turnos',
    ...page(() => import('@/features/appointment-tracking').then((m) => m.AppointmentsSearchPage)),
  },
  {
    path: 'turnos/:appointmentId',
    ...page(() => import('@/features/appointment-tracking').then((m) => m.StaffAppointmentPage)),
  },
  { element: <RequireRole roles={['ADMIN']} />, children: adminRoutes },
  { path: '*', element: <NotFoundPage /> },
];

export const routes: RouteObject[] = [
  {
    element: <Outlet />,
    errorElement: <RouteError />,
    hydrateFallbackElement: <LoadingBlock />,
    children: [
      { path: '/', element: <PublicShell />, errorElement: <RouteError />, children: publicRoutes },
      {
        path: '/panel',
        element: (
          <RequireRole roles={['PROVIDER', 'ADMIN']}>
            <StaffShell />
          </RequireRole>
        ),
        errorElement: <RouteError />,
        children: staffRoutes,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
