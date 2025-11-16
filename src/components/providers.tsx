'use client';

import { SessionProvider } from 'next-auth/react';
import { SessionSync } from '@/components/session-sync';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionSync>
        {children}
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </SessionSync>
    </SessionProvider>
  );
}

