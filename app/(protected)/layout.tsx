'use client';

import '../globals.css';
import { AuthButton } from '@/components/auth-button';
import { ThemeSwitcher } from '@/components/theme-switcher';
import Navbar from '@/components/ui/navbar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';
import { useAuthStore } from '../core/stores/auth-store';
import { LoadingSpinner } from '@/components/ui/spinner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { setIsAuthenticated, setEmail } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth error:', error);
          router.push('/auth/login');
          return;
        }
        setIsAuthenticated(!!session);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        console.log('user', user);
        setEmail(user?.email || null);
        console.log('session', session);
        if (!session) {
          router.push('/auth/login');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/login');
      }
    };

    checkAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      if (!session) {
        router.push('/auth/login');
      } else {
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full border-b flex justify-between">
        <Navbar />
        <AuthButton />
      </header>
      <main className="flex-1">
        <div className="m-10">{children}</div>
      </main>
      <footer className="w-full border-t mx-auto text-center text-xs gap-8 py-16">
        <ThemeSwitcher />
      </footer>
    </div>
  );
}
