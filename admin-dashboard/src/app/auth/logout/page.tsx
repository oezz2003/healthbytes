'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();
  
  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
      } finally {
        // Redirect to login page after logout
        router.push('/auth/login');
      }
    };
    
    performLogout();
  }, [logout, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
        <h2 className="mt-6 text-xl font-medium text-gray-900">تسجيل الخروج...</h2>
      </div>
    </div>
  );
} 
 
 
 
 