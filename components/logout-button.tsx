'use client';

import { supabase } from '@/lib/supabase/supabaseClient';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/core/stores/auth-store';

export function LogoutButton() {
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const logout = async () => {
    await supabase.auth.signOut();
    clearAuth();
    router.push('/auth/login');
  };

  return (
    <Button className="mt-0" onClick={logout}>
      Logout
    </Button>
  );
}
