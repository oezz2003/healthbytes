'use client';

import { useContext } from 'react';
import { AuthContext, AuthProvider, AuthContextType } from '@/components/providers/AuthProvider';

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Re-export AuthProvider and AuthContext
export { AuthProvider, AuthContext };
export type { AuthContextType };

export default useAuth;