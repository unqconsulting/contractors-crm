'use client';

import { supabase } from '@/lib/supabase/supabaseClient';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();
  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <Button className="mt-0" onClick={logout}>
      Logout
    </Button>
  );
}
