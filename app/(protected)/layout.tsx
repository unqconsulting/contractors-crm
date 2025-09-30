'use client';

import '../globals.css';
import { AuthButton } from '@/components/auth-button';
import { ThemeSwitcher } from '@/components/theme-switcher';
import Navbar from '@/components/ui/navbar';
import { AuthProvider } from '@/app/providers/authProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
