"use client";

import { RowndProvider } from '@rownd/react';
import { ReactNode } from 'react';

interface RowndProviderWrapperProps {
  children: ReactNode;
}

export function RowndProviderWrapper({ children }: RowndProviderWrapperProps) {
  return (
    <RowndProvider
      appKey="key_jhion5486ej4fglv94oyrfgq"
    >
      {children}
    </RowndProvider>
  );
}
