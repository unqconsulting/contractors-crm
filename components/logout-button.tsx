'use client';

import { supabase } from '@/lib/supabase/supabaseClient';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    router.push('/auth/login');
    await supabase.auth.signOut();
  };

  return (
    <Button className="mt-0" onClick={logout}>
      Logout
    </Button>
  );
}
