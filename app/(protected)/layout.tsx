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
import { usePartnerStore } from '../core/stores/partner-store';
import { PartnerRealTimeChanges } from '../core/realtime-changes/partner-changes';
import { ClientRealTimeChanges } from '../core/realtime-changes/client-changes';
import { useClientStore } from '../core/stores/client-store';
import { ConsultantRealTimeChanges } from '../core/realtime-changes/consultant-changes';
import { useConsultantStore } from '../core/stores/consultant-store';
import { ConsultantAssignmentRealTimeChanges } from '../core/realtime-changes/assignment-changes';
import { useAssignmentStore } from '../core/stores/assignment-store';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { setIsAuthenticated, setEmail } = useAuthStore();

  const {
    allPartners,
    deleteStorePartner,
    addStorePartner,
    updateStorePartner,
  } = usePartnerStore();

  const { allClients, deleteStoreClient, addStoreClient, updateStoreClient } =
    useClientStore();

  const {
    allConsultants,
    deleteStoreConsultant,
    addStoreConsultant,
    updateStoreConsultant,
  } = useConsultantStore();

  const {
    consultantAssignments,
    deleteStoreAssignment,
    addAssignment,
    updateAssignment,
  } = useAssignmentStore();

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
        setEmail(user?.email || null);
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

  useEffect(() => {
    // Create separate channels for each subscription
    const partnerChannel = supabase.channel('partner-changes');
    const clientChannel = supabase.channel('client-changes');
    const consultantChannel = supabase.channel('consultant-changes');
    const assignmentChannel = supabase.channel('assignment-changes');

    PartnerRealTimeChanges(
      partnerChannel,
      {
        deleteStorePartner,
        addStorePartner,
        updateStorePartner,
      },
      allPartners
    );
    ClientRealTimeChanges(
      clientChannel,
      {
        deleteStoreClient,
        addStoreClient,
        updateStoreClient,
      },
      allClients
    );
    ConsultantRealTimeChanges(
      consultantChannel,
      {
        deleteStoreConsultant,
        addStoreConsultant,
        updateStoreConsultant,
      },
      allConsultants
    );
    ConsultantAssignmentRealTimeChanges(
      assignmentChannel,
      {
        deleteStoreAssignment,
        addAssignment,
        updateAssignment,
      },
      consultantAssignments
    );

    // Subscribe all channels
    partnerChannel.subscribe();
    clientChannel.subscribe();
    consultantChannel.subscribe();
    assignmentChannel.subscribe();

    // Cleanup all channels
    return () => {
      supabase.removeChannel(partnerChannel);
      supabase.removeChannel(clientChannel);
      supabase.removeChannel(consultantChannel);
      supabase.removeChannel(assignmentChannel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
