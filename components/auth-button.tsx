import { LogoutButton } from './logout-button';
import { useAuth } from '@/app/providers/authProvider';

export function AuthButton() {
  const { user } = useAuth();
  return (
    <div className="flex items-center justify-end w-full gap-4 mt-2 mb-4 mr-2">
      <span className="hidden lg:block">
        {user ? `Hey, ${user.email}!` : ''}
      </span>
      <LogoutButton />
    </div>
  );
}
