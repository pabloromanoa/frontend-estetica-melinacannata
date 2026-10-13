import { createContext } from 'react';
import type { Role, SessionUser } from '@/domain';

export interface AuthContextValue {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isStaff: boolean;
  isAdmin: boolean;
  isProvider: boolean;
  isClient: boolean;
  hasRole: (role: Role) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
