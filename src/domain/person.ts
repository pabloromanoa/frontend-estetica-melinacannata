import type { ClientSummary, GuestData, Role, SessionUser } from './types';

/** "Florencia Benítez" → "FB". */
export function initials(fullName: string): string {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

export function hasRole(user: Pick<SessionUser, 'roles'> | null | undefined, role: Role): boolean {
  return user?.roles.includes(role) ?? false;
}

export function hasAnyRole(
  user: Pick<SessionUser, 'roles'> | null | undefined,
  roles: readonly Role[],
): boolean {
  return roles.some((role) => hasRole(user, role));
}

export function isStaff(user: Pick<SessionUser, 'roles'> | null | undefined): boolean {
  return hasAnyRole(user, ['PROVIDER', 'ADMIN']);
}

export const ROLE_LABEL: Record<Role, string> = {
  CLIENT: 'Cliente',
  PROVIDER: 'Profesional',
  ADMIN: 'Administración',
};

/** Ruta de inicio según el rol (staff → panel, cliente → portal). */
export function homePathFor(user: Pick<SessionUser, 'roles'> | null | undefined): string {
  if (isStaff(user)) return '/panel/agenda';
  if (hasRole(user, 'CLIENT')) return '/mi-cuenta';
  return '/';
}

/** Arma el enlace privado del invitado: `${origin}/turno/{token}`. */
export function buildGuestLink(origin: string, token: string): string {
  return `${origin.replace(/\/+$/, '')}/turno/${encodeURIComponent(token)}`;
}

/** Paciente existente → datos `guest` del contrato (sólo los campos permitidos). */
export function clientToGuest(client: ClientSummary): GuestData {
  const { firstName, lastName, dni, phone, email } = client;
  return email ? { firstName, lastName, dni, phone, email } : { firstName, lastName, dni, phone };
}
