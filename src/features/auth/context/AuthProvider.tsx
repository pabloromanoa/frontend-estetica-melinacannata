import { useMemo, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hasRole, isStaff, type Role } from '@/domain';
import { queryKeys } from '@/shared/api';
import { authApi } from '../api/auth-api';
import { AuthContext, type AuthContextValue } from './auth-context';

/**
 * La sesión vive en una cookie HttpOnly: el front NO guarda tokens.
 * El estado de sesión se obtiene de GET /auth/me y se cachea con TanStack Query.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user = null, isLoading } = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authApi.me,
    staleTime: Infinity,
    retry: false,
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      isStaff: isStaff(user),
      isAdmin: hasRole(user, 'ADMIN'),
      isProvider: hasRole(user, 'PROVIDER'),
      isClient: hasRole(user, 'CLIENT'),
      hasRole: (role: Role) => hasRole(user, role),
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
