import type { LoginInput, RegisterInput, RegisterResult, SessionUser } from '@/domain';
import { httpClient, isApiError } from '@/shared/api';

export const authApi = {
  /** GET /auth/me — devuelve null si no hay sesión (401). */
  async me(): Promise<SessionUser | null> {
    try {
      return await httpClient.get<SessionUser>('/auth/me');
    } catch (error) {
      if (isApiError(error) && error.isUnauthenticated) return null;
      throw error;
    }
  },
  login: (input: LoginInput) => httpClient.post<SessionUser>('/auth/login', input),
  register: (input: RegisterInput) => httpClient.post<RegisterResult>('/auth/register', input),
  logout: () => httpClient.post<void>('/auth/logout'),
};
