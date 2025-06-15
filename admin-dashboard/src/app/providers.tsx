'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from '@/contexts/ToastContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import initializeFirebase from '@/lib/firebase/initializeFirebase';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [isDataReady, setIsDataReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initFirebase = async () => {
      try {
        await initializeFirebase();
        console.log('✅ تم تهيئة البيانات الوهمية بنجاح');
        setIsDataReady(true);
      } catch (err) {
        console.error('خطأ في تهيئة البيانات:', err);
        setError('فشل في تهيئة بيانات التطبيق');
        setIsDataReady(true); // المتابعة على أي حال
      }
    };

    initFirebase();
  }, []);

  if (!isDataReady && !error) {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  if (error) {
    console.warn('يستمر التطبيق رغم خطأ تهيئة البيانات:', error);
  }

  return (
    <ToastProvider>
      <NotificationProvider>
        <AuthProvider>{children}</AuthProvider>
      </NotificationProvider>
    </ToastProvider>
  );
} 