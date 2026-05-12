'use client';

import { useEffect } from 'react';
import BottomNav from '@/components/layout/BottomNav';
import AIButton from '@/components/AIButton';
import { useApp } from '@/context/AppContext';

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  const { setRole } = useApp();

  useEffect(() => {
    setRole('consumer');
  }, [setRole]);

  return (
    <>
      {children}
      <AIButton />
      <BottomNav />
    </>
  );
}
