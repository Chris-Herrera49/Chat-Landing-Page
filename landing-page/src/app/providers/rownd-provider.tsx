"use client";

import { RowndProvider } from '@rownd/react';
import { ReactNode } from 'react';

interface RowndProviderWrapperProps {
  children: ReactNode;
}

export function RowndProviderWrapper({ children }: RowndProviderWrapperProps) {
  return (
    <RowndProvider
      appKey={process.env.NEXT_PUBLIC_ROWND_APP_KEY || "haha"}
    >
      {children}
    </RowndProvider>
  );
}
