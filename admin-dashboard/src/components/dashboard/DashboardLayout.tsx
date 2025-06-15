import React, { useState, ReactNode, useRef, useEffect } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Sidebar from './Sidebar';
import { useAuth } from '@/lib/hooks/useAuth';
import NotificationBell from '@/components/ui/NotificationBell';
import { useNotifications } from '@/contexts/NotificationContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" 
            aria-hidden="true" 
            onClick={() => setSidebarOpen(false)}
          ></div>
          <Sidebar isMobile onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white shadow-sm lg:shadow-none border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 text-gray-500 rounded-md lg:hidden hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="w-6 h-6" aria-hidden="true" />
              </button>
              <h1 className="ml-2 lg:ml-0 text-lg font-semibold text-gray-800">
                {title || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <NotificationBell 
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
              />

              {/* Profile dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="flex items-center focus:outline-none"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-800 font-medium">
                      {user?.name?.substring(0, 1).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden md:block ml-2 text-sm font-medium text-gray-700">
                    {user?.name || 'User'}
                  </span>
                </button>

                {/* Dropdown menu */}
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                    <Link 
                      href="/dashboard/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 