'use client';

import { useSyncSession } from '@/hooks/use-sync-session';

/**
 * Component that syncs NextAuth session to Zustand store
 * Must be inside SessionProvider
 */
export function SessionSync({ children }: { children: React.ReactNode }) {
  // This hook syncs the session to Zustand
  useSyncSession();
  
  return <>{children}</>;
}

