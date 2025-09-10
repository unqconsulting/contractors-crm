'use client';

import { supabase } from '@/lib/supabase/supabaseClient';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { clearStores } from '@/app/utilities/helpers/helpers';

export function LogoutButton() {
  const router = useRouter();
  const logout = async () => {
    await supabase.auth.signOut();
    clearStores();
    router.push('/auth/login');
  };

  return (
    <Button className="mt-0" onClick={logout}>
      Logout
    </Button>
  );
}
