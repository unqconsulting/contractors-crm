// providers/AuthProvider.tsx
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/supabaseClient';
import { User } from '@supabase/supabase-js';
import { LoadingSpinner } from '@/components/ui/spinner';

interface AuthContextType {
  user: User | null;
  providerLoading: boolean;
  setProviderLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  providerLoading: true,
  setProviderLoading: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [providerLoading, setProviderLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;
        if (session) {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          setUser(user);
          setProviderLoading(false);
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/login');
      }
    };
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
        setProviderLoading(false);
      } else {
        setUser(null);
        router.push('/auth/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return providerLoading ? (
    <LoadingSpinner />
  ) : (
    <AuthContext.Provider value={{ user, providerLoading, setProviderLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
