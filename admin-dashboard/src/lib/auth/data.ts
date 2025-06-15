import { UserRole } from '@/types';
import { AdminUser, Permission } from './types';
import { hashPassword } from './utils';

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  'Super Admin': Object.values(Permission),
  'Admin': [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_USERS, Permission.CREATE_USERS, Permission.EDIT_USERS,
    Permission.VIEW_MENU_ITEMS, Permission.CREATE_MENU_ITEMS, Permission.EDIT_MENU_ITEMS, Permission.DELETE_MENU_ITEMS,
    Permission.VIEW_ORDERS, Permission.EDIT_ORDERS,
    Permission.VIEW_INVENTORY, Permission.CREATE_INVENTORY, Permission.EDIT_INVENTORY,
    Permission.VIEW_REPORTS, Permission.CREATE_REPORTS,
    Permission.VIEW_SETTINGS, Permission.EDIT_SETTINGS,
    Permission.VIEW_CUSTOMERS, Permission.EDIT_CUSTOMERS,
    Permission.VIEW_ACTIVITY
  ],
  'Operation Manager': [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_USERS,
    Permission.VIEW_MENU_ITEMS, 
    Permission.VIEW_ORDERS, Permission.EDIT_ORDERS,
    Permission.VIEW_INVENTORY, Permission.CREATE_INVENTORY, Permission.EDIT_INVENTORY,
    Permission.VIEW_REPORTS, Permission.CREATE_REPORTS,
    Permission.VIEW_CUSTOMERS,
    Permission.VIEW_ACTIVITY
  ],
  'Accounting Manager': [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ORDERS,
    Permission.VIEW_INVENTORY,
    Permission.VIEW_REPORTS, Permission.CREATE_REPORTS,
    Permission.VIEW_CUSTOMERS,
    Permission.VIEW_ACTIVITY
  ],
  'Sales Manager': [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_MENU_ITEMS,
    Permission.VIEW_ORDERS, Permission.EDIT_ORDERS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_CUSTOMERS,
    Permission.VIEW_ACTIVITY
  ],
  'Staff': [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_MENU_ITEMS,
    Permission.VIEW_ORDERS, Permission.EDIT_ORDERS,
    Permission.VIEW_INVENTORY,
    Permission.VIEW_ACTIVITY
  ],
  'Customer': []
};

// Admin users data
export const ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin-1',
    name: 'System Admin',
    email: 'admin@example.com',
    role: 'Super Admin',
    permissions: ROLE_PERMISSIONS['Super Admin'],
    avatar: '/images/avatars/admin.jpg',
    createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000, // 1 year ago
    updatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,  // 30 days ago
    lastLogin: Date.now() - 2 * 24 * 60 * 60 * 1000,   // 2 days ago
    isActive: true,
    department: 'Management'
  },
  {
    id: 'admin-2',
    name: 'App Manager',
    email: 'manager@example.com',
    role: 'Admin',
    permissions: ROLE_PERMISSIONS['Admin'],
    avatar: '/images/avatars/manager.jpg',
    createdAt: Date.now() - 300 * 24 * 60 * 60 * 1000, // 300 days ago
    updatedAt: Date.now() - 45 * 24 * 60 * 60 * 1000,  // 45 days ago
    lastLogin: Date.now() - 5 * 24 * 60 * 60 * 1000,   // 5 days ago
    isActive: true,
    department: 'IT'
  },
  {
    id: 'admin-3',
    name: 'Operations Manager',
    email: 'operations@example.com',
    role: 'Operation Manager',
    permissions: ROLE_PERMISSIONS['Operation Manager'],
    avatar: '/images/avatars/operations.jpg',
    createdAt: Date.now() - 250 * 24 * 60 * 60 * 1000, // 250 days ago
    updatedAt: Date.now() - 60 * 24 * 60 * 60 * 1000,  // 60 days ago
    lastLogin: Date.now() - 1 * 24 * 60 * 60 * 1000,   // 1 day ago
    isActive: true,
    department: 'Operations'
  },
  {
    id: 'admin-4',
    name: 'Accounting Manager',
    email: 'accounting@example.com',
    role: 'Accounting Manager',
    permissions: ROLE_PERMISSIONS['Accounting Manager'],
    avatar: '/images/avatars/accounting.jpg',
    createdAt: Date.now() - 200 * 24 * 60 * 60 * 1000, // 200 days ago
    updatedAt: Date.now() - 90 * 24 * 60 * 60 * 1000,  // 90 days ago
    lastLogin: Date.now() - 3 * 24 * 60 * 60 * 1000,   // 3 days ago
    isActive: true,
    department: 'Finance'
  },
  {
    id: 'admin-5',
    name: 'Sales Manager',
    email: 'sales@example.com',
    role: 'Sales Manager',
    permissions: ROLE_PERMISSIONS['Sales Manager'],
    avatar: '/images/avatars/sales.jpg',
    createdAt: Date.now() - 180 * 24 * 60 * 60 * 1000, // 180 days ago
    updatedAt: Date.now() - 100 * 24 * 60 * 60 * 1000, // 100 days ago
    lastLogin: Date.now() - 7 * 24 * 60 * 60 * 1000,   // 7 days ago
    isActive: true,
    department: 'Sales'
  },
  {
    id: 'admin-6',
    name: 'Staff Member',
    email: 'staff@example.com',
    role: 'Staff',
    permissions: ROLE_PERMISSIONS['Staff'],
    avatar: '/images/avatars/staff.jpg',
    createdAt: Date.now() - 150 * 24 * 60 * 60 * 1000, // 150 days ago
    updatedAt: Date.now() - 120 * 24 * 60 * 60 * 1000, // 120 days ago
    lastLogin: Date.now() - 0.5 * 24 * 60 * 60 * 1000, // 12 hours ago
    isActive: true,
    department: 'Customer Support'
  }
];

// Admin credentials (in a real app, passwords would be hashed)
export const ADMIN_CREDENTIALS: Record<string, string> = {
  'admin@example.com': 'admin123',
  'manager@example.com': 'manager123',
  'operations@example.com': 'operations123',
  'accounting@example.com': 'accounting123',
  'sales@example.com': 'sales123',
  'staff@example.com': 'staff123'
}; 
 
 
 
 