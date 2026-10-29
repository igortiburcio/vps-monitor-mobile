import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { apiFetch, ApiError, setAuthToken, signIn as signInRequest } from '../api/client';
import type { MeResponse, SessionUser } from '../api/types';
import { storage } from '../lib/storage';

const TOKEN_KEY = 'vps-monitor.token';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  status: AuthStatus;
  user: SessionUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<SessionUser | null>(null);

  // Restaura a sessão salva e valida contra a API
  useEffect(() => {
    let active = true;

    async function restore() {
      const stored = await storage.get(TOKEN_KEY);
      if (!stored) {
        if (active) setStatus('unauthenticated');
        return;
      }

      setAuthToken(stored);

      try {
        const me = await apiFetch<MeResponse>('/api/v1/me');
        if (!active) return;
        setUser(me.user);
        setStatus('authenticated');
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          await storage.remove(TOKEN_KEY);
          setAuthToken(null);
        }
        if (active) setStatus('unauthenticated');
      }
    }

    void restore();

    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { token, user: signedUser } = await signInRequest(email, password);

    setAuthToken(token);
    await storage.set(TOKEN_KEY, token);
    setUser(signedUser);
    setStatus('authenticated');
  }, []);

  const signOut = useCallback(async () => {
    setAuthToken(null);
    await storage.remove(TOKEN_KEY);
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, signIn, signOut }),
    [status, user, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro de AuthProvider');

  return context;
}
