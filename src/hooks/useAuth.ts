import { useContext } from 'react';

import { AuthContext } from '@/contexts/auth';
import type { AuthContextType } from '@/contexts/auth';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return context;
}
