'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { activityLogService, ActivityType, ActivitySeverity } from '@/lib/activity';
import { UserRole } from '@/types';

// Login form component
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  // Demo accounts for quick login
  const demoAccounts = [
    { role: 'Super Admin', email: 'admin@example.com', password: 'admin123' },
    { role: 'Admin', email: 'manager@example.com', password: 'manager123' },
    { role: 'Staff', email: 'staff@example.com', password: 'staff123' }
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      
      // Log failed login attempt
      activityLogService.logActivity({
        userId: 'unknown',
        userName: email,
        userRole: 'Admin' as UserRole,
        type: ActivityType.FAILED_LOGIN,
        description: `Failed login attempt for email: ${email}`,
        severity: ActivitySeverity.WARNING,
        userAgent: navigator.userAgent
      });
    } finally {
      setLoading(false);
    }
  };

  const useDemoAccount = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Dashboard Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowDemoAccounts(!showDemoAccounts)}
            className="text-sm text-primary-600 hover:text-primary-500 flex items-center justify-center w-full"
          >
            {showDemoAccounts ? 'Hide demo accounts' : 'Show demo accounts'}
          </button>
          
          {showDemoAccounts && (
            <div className="mt-3 border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Demo Accounts</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {demoAccounts.map((account, index) => (
                  <div key={index} className="px-4 py-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{account.role}</p>
                        <p className="text-xs text-gray-500">{account.email} / {account.password}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => useDemoAccount(account.email, account.password)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1 px-2 rounded"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}