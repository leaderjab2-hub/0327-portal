'use client';

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import MswProvider from '@/components/MswProvider';
import { useEffect, useState } from 'react';

export function Providers({ children, initialUser }: { children: React.ReactNode, initialUser: any }) {
  return (
    <MswProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <AuthProvider initialUser={initialUser}>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </MswProvider>
  );
}
