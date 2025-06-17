import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  UserIcon, 
  ShoppingCartIcon, 
  CakeIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ArchiveBoxIcon,
  UserCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/hooks/useAuth';

// Define simple nav items without role restrictions
const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Users',
    href: '/dashboard/users',
    icon: UserIcon
  },
  {
    name: 'Orders',
    href: '/dashboard/orders',
    icon: ShoppingCartIcon
  },
  {
    name: 'Menu Items',
    href: '/dashboard/menu-items',
    icon: CakeIcon
  },
  {
    name: 'Inventory',
    href: '/dashboard/inventory',
    icon: ArchiveBoxIcon
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: DocumentTextIcon
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: ChartBarIcon
  },
  {
    name: 'Activity Log',
    href: '/dashboard/activity',
    icon: ClockIcon
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: UserCircleIcon
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Cog6ToothIcon
  }
];

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile = false, onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // No need to filter navigation items for now
  const filteredNavItems = navItems;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderNavItems = () => {
    return filteredNavItems.map((item) => {
      const isActive = pathname === item.href;
      return (
        <li key={item.name}>
          <Link 
            href={item.href}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors shadow-sm ${
              isActive
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'text-neutral-700 hover:bg-green-50 hover:text-green-700 hover:shadow-md hover:border hover:border-green-200'
            }`}
            onClick={isMobile ? onClose : undefined}
          >
            <item.icon className={`flex-shrink-0 w-5 h-5 mr-3 ${
              isActive ? 'text-green-700' : 'text-neutral-600 group-hover:text-green-600'
            }`} />
            <span>{item.name}</span>
          </Link>
        </li>
      );
    });
  };

  return (
    <div className={`${isMobile ? 'absolute inset-0 z-50 flex' : 'min-h-screen w-64 border-r border-neutral-200'}`}>
      <div className={`flex flex-col flex-1 bg-white shadow-md ${isMobile ? 'w-full max-w-xs' : ''}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-green-200 bg-white">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-bold text-green-700">HealthyBites</span>
          </Link>
          {isMobile && (
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 text-green-600 rounded-md hover:text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600"
              onClick={onClose}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="w-6 h-6" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="px-2 py-4 space-y-1">
            <ul className="space-y-1">
              {renderNavItems()}
            </ul>
          </nav>
        </div>

        {user && (
          <div className="p-4 border-t border-green-200 bg-white">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center border border-green-200">
                  <span className="text-green-800 font-medium">
                    {user.name ? user.name.substring(0, 1).toUpperCase() : 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-700 truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-neutral-500 truncate">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
            <button
              className="flex items-center justify-center w-full px-4 py-2 mt-4 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 shadow-sm"
              onClick={handleLogout}
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
              Log out
            </button>
          </div>
        )}
      </div>

      {isMobile && (
        <div className="flex-shrink-0 w-14" aria-hidden="true" onClick={onClose}>
          {/* Dummy element to close sidebar on background click */}
        </div>
      )}
    </div>
  );
};

export default Sidebar; 