'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/lib/store';

/**
 * Custom hook to sync NextAuth session with Zustand store
 * This ensures consistent state across the application
 */
export function useSyncSession() {
  const { data: session, status } = useSession();
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user) {
      // Sync session to Zustand store
      setSession(session);
    } else {
      // Clear store if no session
      clearSession();
    }
  }, [session, status, setSession, clearSession]);

  return { session, status };
}

