'use client';

import { useSyncSession } from '@/hooks/use-sync-session';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { session, status } = useSyncSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}

