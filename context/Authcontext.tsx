// context/AuthContext.tsx
import { bootstrapAuth } from '@/scripts/bootstrapLogin';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

const AuthContext = createContext<{ state: AuthState }>({ state: 'loading' });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>('loading');

  useEffect(() => {
    checkToken();
  }, []);

  async function checkToken() {
    try {
      const token = await bootstrapAuth();
      // optionally validate token with your backend here
      setState(token ? 'authenticated' : 'unauthenticated');
    } catch {
      setState('unauthenticated');
    }
  }

  return <AuthContext.Provider value={{ state }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);