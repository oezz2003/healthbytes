import crypto from 'crypto';
import { UserSession } from './types';

// دالة لتشفير كلمة المرور (في بيئة حقيقية نستخدم خوارزمية أقوى مثل bcrypt)
export const hashPassword = (password: string): string => {
  // In a real app, use bcrypt or similar
  // This is a simple hash for demo purposes only
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
};

// دالة للتحقق من تطابق كلمة المرور مع القيمة المشفرة
export const comparePassword = (password: string, hash: string): boolean => {
  // In a real app, use bcrypt.compare or similar
  const passwordHash = hashPassword(password);
  return passwordHash === hash;
};

// دالة لإنشاء رمز مميز للجلسة
export const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// دالة لتخزين جلسة المستخدم في التخزين المحلي
export const saveSession = (session: UserSession): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_session', JSON.stringify(session));
  }
};

// دالة لاسترجاع جلسة المستخدم من التخزين المحلي
export const getSession = (): UserSession | null => {
  if (typeof window !== 'undefined') {
    const sessionStr = localStorage.getItem('auth_session');
    if (sessionStr) {
      try {
        return JSON.parse(sessionStr);
      } catch (e) {
        console.error('Error parsing session:', e);
      }
    }
  }
  return null;
};

// دالة لإزالة جلسة المستخدم من التخزين المحلي
export const clearSession = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_session');
  }
};

// دالة للتحقق من صلاحية الجلسة
export const isSessionValid = (session: UserSession | null): boolean => {
  if (!session) return false;
  return session.expiresAt > Date.now();
};

// Get client IP address (simulated in browser environment)
export const getClientIP = (): string => {
  // In a real app, this would be determined server-side
  return '127.0.0.1';
};

// Get user agent
export const getUserAgent = (): string => {
  if (typeof window !== 'undefined') {
    return window.navigator.userAgent;
  }
  return 'unknown';
}; 
 
 
 
 