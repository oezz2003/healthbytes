'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContextType, AdminUser } from './types';
import { 
  login as authLogin,
  logout as authLogout,
  checkAuth,
  updateProfile as authUpdateProfile,
  updatePassword as authUpdatePassword,
  hasPermission as checkPermission,
  hasRole as checkRole
} from './authService';
import { Permission } from './types';
import { UserRole } from '@/types';

// Create auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  login: async () => { throw new Error('Not implemented'); },
  logout: () => {},
  hasPermission: () => false,
  hasRole: () => false,
  updateProfile: async () => { throw new Error('Not implemented'); },
  updatePassword: async () => false
});

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

// AuthProvider props
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check authentication on load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = checkAuth();
        setUser(currentUser);
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Authentication failed to initialize');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const loggedInUser = await authLogin(email, password);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authLogout();
    setUser(null);
    router.push('/auth/login');
  };

  // Update profile function
  const updateProfile = async (userData: Partial<AdminUser>) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await authUpdateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      setError(err.message || 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update password function
  const updatePassword = async (oldPassword: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authUpdatePassword(oldPassword, newPassword);
      return result;
    } catch (err: any) {
      setError(err.message || 'Password update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has permission
  const hasPermission = (permission: Permission | Permission[]) => {
    return checkPermission(user, permission);
  };

  // Check if user has role
  const hasRole = (role: UserRole | UserRole[]) => {
    return checkRole(user, role);
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
    hasRole,
    updateProfile,
    updatePassword
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 
 
 
 
 