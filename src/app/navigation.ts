import {
  BarChart3,
  CalendarDays,
  CalendarRange,
  ClipboardCheck,
  Clock,
  ExternalLink,
  FileText,
  Layers,
  LayoutDashboard,
  ListChecks,
  Sparkles,
  Tags,
  UserRound,
  Users,
  WandSparkles,
  type LucideIcon,
} from 'lucide-react';
import type { Role } from '@/domain';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  roles: readonly Role[];
  /** Muestra el badge de señas pendientes. */
  badge?: 'pendingDeposits';
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

const STAFF: readonly Role[] = ['PROVIDER', 'ADMIN'];
const ADMIN: readonly Role[] = ['ADMIN'];

/** Menú del panel. ADMIN ve todo; PROVIDER sólo la sección clínica. */
export const STAFF_NAVIGATION: readonly NavSection[] = [
  {
    title: 'Gestión clínica',
    items: [
      { to: '/panel/agenda', label: 'Agenda Diaria', icon: CalendarDays, roles: STAFF },
      { to: '/panel/mi-agenda', label: 'Agenda Semanal', icon: CalendarRange, roles: STAFF },
      { to: '/panel/nueva-reserva', label: 'Nueva Reserva', icon: WandSparkles, roles: STAFF },
      {
        to: '/panel/senas',
        label: 'Control de Señas',
        icon: FileText,
        roles: STAFF,
        badge: 'pendingDeposits',
      },
      { to: '/panel/disponibilidad', label: 'Disponibilidad Semanal', icon: Clock, roles: STAFF },
      { to: '/panel/turnos', label: 'Seguimiento Cliente', icon: ExternalLink, roles: STAFF },
    ],
  },
  {
    title: 'Administración',
    items: [
      { to: '/panel/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ADMIN },
      { to: '/panel/servicios', label: 'Servicios', icon: Sparkles, roles: ADMIN },
      { to: '/panel/categorias', label: 'Categorías', icon: Tags, roles: ADMIN },
      { to: '/panel/tratamientos', label: 'Tratamientos', icon: Layers, roles: ADMIN },
      { to: '/panel/prestadores', label: 'Prestadores', icon: UserRound, roles: ADMIN },
      { to: '/panel/clientes', label: 'Clientes', icon: Users, roles: ADMIN },
      { to: '/panel/informes', label: 'Informes', icon: BarChart3, roles: ADMIN },
    ],
  },
];

export function navigationFor(roles: readonly Role[]): NavSection[] {
  return STAFF_NAVIGATION.map((section) => ({
    ...section,
    items: section.items.filter((item) => item.roles.some((role) => roles.includes(role))),
  })).filter((section) => section.items.length > 0);
}

export const CLIENT_NAVIGATION = [
  { to: '/mi-cuenta', label: 'Mis turnos', icon: ListChecks },
  { to: '/mi-cuenta/recomendaciones', label: 'Mis recomendaciones', icon: ClipboardCheck },
] as const;
