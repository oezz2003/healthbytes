import { UserRole } from '@/types';

// Permission types available in the system
export enum Permission {
  // Dashboard permissions
  VIEW_DASHBOARD = 'view_dashboard',
  
  // User permissions
  VIEW_USERS = 'view_users',
  CREATE_USERS = 'create_users',
  EDIT_USERS = 'edit_users',
  DELETE_USERS = 'delete_users',
  
  // Menu item permissions
  VIEW_MENU_ITEMS = 'view_menu_items',
  CREATE_MENU_ITEMS = 'create_menu_items',
  EDIT_MENU_ITEMS = 'edit_menu_items',
  DELETE_MENU_ITEMS = 'delete_menu_items',
  
  // Order permissions
  VIEW_ORDERS = 'view_orders',
  CREATE_ORDERS = 'create_orders',
  EDIT_ORDERS = 'edit_orders',
  DELETE_ORDERS = 'delete_orders',
  
  // Inventory permissions
  VIEW_INVENTORY = 'view_inventory',
  CREATE_INVENTORY = 'create_inventory',
  EDIT_INVENTORY = 'edit_inventory',
  DELETE_INVENTORY = 'delete_inventory',
  
  // Reports permissions
  VIEW_REPORTS = 'view_reports',
  CREATE_REPORTS = 'create_reports',
  
  // Settings permissions
  VIEW_SETTINGS = 'view_settings',
  EDIT_SETTINGS = 'edit_settings',
  
  // Customer management permissions
  VIEW_CUSTOMERS = 'view_customers',
  CREATE_CUSTOMERS = 'create_customers',
  EDIT_CUSTOMERS = 'edit_customers',
  DELETE_CUSTOMERS = 'delete_customers',
  
  // Activity log permissions
  VIEW_ACTIVITY = 'view_activity',
  CLEAR_ACTIVITY = 'clear_activity',
}

// Admin user type
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  avatar?: string;
  department?: string;
  lastLogin?: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

// User session type
export interface UserSession {
  token: string;
  userId: string;
  expiresAt: number;
}

// Auth context type
export interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AdminUser>;
  logout: () => void;
  hasPermission: (permission: Permission | Permission[]) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  updateProfile: (userData: Partial<AdminUser>) => Promise<AdminUser>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
} 
 
 
 
 