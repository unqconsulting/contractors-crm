import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  clearAuth: () => void;
  email: string | null;
  setEmail: (email: string | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      setIsAuthenticated: (auth: boolean) => set({ isAuthenticated: auth }),
      clearAuth: () => set({ isAuthenticated: false, email: null }),
      email: null,
      setEmail: (email: string | null) => set({ email }),
    }),
    {
      name: 'auth-storage', // unique name
    }
  )
);
