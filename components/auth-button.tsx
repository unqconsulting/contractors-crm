import { useAuthStore } from '@/app/core/stores/auth-store';
import { LogoutButton } from './logout-button';

export function AuthButton() {
  const { email } = useAuthStore();

  return email ? (
    <div className="flex items-center justify-end w-full gap-4 mt-2 mb-4 mr-2">
      <span className="hidden lg:block">Hey, {email}!</span>
      <LogoutButton />
    </div>
  ) : undefined;
}
