"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { activityLogService, ActivityType, ActivitySeverity } from '@/lib/activity';
import { UserRole } from '@/types';
import { AdminUser, Permission } from '@/lib/auth/types';
import { ADMIN_USERS, ADMIN_CREDENTIALS } from '@/lib/auth/data';

// Auth context type
export interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasPermission: (allowedRoles: string[] | Permission[]) => boolean;
  updateProfile: (userData: Partial<AdminUser>) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

// Create auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
  hasPermission: () => false,
  updateProfile: async () => {},
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
  const router = useRouter();

  // Check for user on load
  useEffect(() => {
    // Check for user info in local storage
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        Cookies.set('isAuthenticated', 'true', { secure: true });
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
        localStorage.removeItem('auth_user');
        Cookies.remove('isAuthenticated');
      }
    }
    
    // End loading state after check
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user in mock data
      const foundUser = ADMIN_USERS.find(
        u => u.email === email && ADMIN_CREDENTIALS[u.email] === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Update last login
      foundUser.lastLogin = Date.now();
      
      // Set user state
      setUser(foundUser);
      
      // Save user info in local storage
      localStorage.setItem('auth_user', JSON.stringify(foundUser));
      Cookies.set('isAuthenticated', 'true', { secure: true });
      
      // Log login activity
      activityLogService.logActivity({
        userId: foundUser.id,
        userName: foundUser.name,
        userRole: foundUser.role,
        type: ActivityType.LOGIN,
        description: `User ${foundUser.name} logged in successfully`,
        severity: ActivitySeverity.INFO,
        userAgent: navigator.userAgent
      });
      
      console.log(`✅ Logged in as ${foundUser.name}`);
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (userData: Partial<AdminUser>) => {
    try {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      // Update user data
      const updatedUser = { ...user, ...userData, updatedAt: Date.now() };
      setUser(updatedUser);
      
      // Save to local storage
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      
      // Update in ADMIN_USERS array (for mock persistence)
      const userIndex = ADMIN_USERS.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        ADMIN_USERS[userIndex] = { ...ADMIN_USERS[userIndex], ...userData, updatedAt: Date.now() };
      }
      
      // Log profile update
      activityLogService.logActivity({
        userId: updatedUser.id,
        userName: updatedUser.name,
        userRole: updatedUser.role,
        type: ActivityType.PROFILE_UPDATE,
        description: `User profile updated: ${updatedUser.name}`,
        severity: ActivitySeverity.INFO,
        userAgent: navigator.userAgent
      });
      
      console.log(`✅ Profile updated for ${updatedUser.name}`);
      
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update password function
  const updatePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      // Check old password
      if (ADMIN_CREDENTIALS[user.email] !== oldPassword) {
        throw new Error('Current password is incorrect');
      }
      
      // Update password
      ADMIN_CREDENTIALS[user.email] = newPassword;
      
      // Log password change
      activityLogService.logActivity({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        type: ActivityType.PASSWORD_CHANGE,
        description: `Password changed for user: ${user.name}`,
        severity: ActivitySeverity.INFO,
        userAgent: navigator.userAgent
      });
      
      console.log(`✅ Password updated for ${user.name}`);
      return true;
      
    } catch (error) {
      console.error('Password update error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (user) {
        // Log logout activity
        activityLogService.logActivity({
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          type: ActivityType.LOGOUT,
          description: `User ${user.name} logged out`,
          severity: ActivitySeverity.INFO,
          userAgent: navigator.userAgent
        });
      }
      
      setUser(null);
      localStorage.removeItem('auth_user');
      Cookies.remove('isAuthenticated');
      
      console.log('✅ Logged out successfully');
      
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Check permissions
  const hasPermission = (allowedRoles: string[] | Permission[]): boolean => {
    if (!user) return false;
    
    // Super Admin has all permissions
    if (user.role === 'Super Admin') return true;
    
    // Check if user has any of the allowed roles/permissions
    return allowedRoles.some(role => {
      if (typeof role === 'string') {
        return user.permissions.includes(role as any);
      } else {
        return user.permissions.includes(role);
      }
    });
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission,
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