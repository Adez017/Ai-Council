'use client';

import { ReactNode } from 'react';
import { Sidebar } from './sidebar';

interface AuthenticatedLayoutProps {
  children: ReactNode;
  onRestartTour?: () => void;
}

export function AuthenticatedLayout({ children, onRestartTour }: AuthenticatedLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar onRestartTour={onRestartTour} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
