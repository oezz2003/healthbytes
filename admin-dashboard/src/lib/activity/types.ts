import { UserRole } from '@/types';

// Activity types
export enum ActivityType {
  // Authentication activities
  LOGIN = 'login',
  LOGOUT = 'logout',
  FAILED_LOGIN = 'failed_login',
  PASSWORD_CHANGE = 'password_change',
  PROFILE_UPDATE = 'profile_update',
  
  // User management activities
  USER_CREATE = 'user_create',
  USER_UPDATE = 'user_update',
  USER_DELETE = 'user_delete',
  
  // Menu items activities
  MENU_ITEM_CREATE = 'menu_item_create',
  MENU_ITEM_UPDATE = 'menu_item_update',
  MENU_ITEM_DELETE = 'menu_item_delete',
  
  // Order activities
  ORDER_CREATE = 'order_create',
  ORDER_UPDATE = 'order_update',
  ORDER_STATUS_CHANGE = 'order_status_change',
  ORDER_DELETE = 'order_delete',
  
  // Inventory activities
  INVENTORY_CREATE = 'inventory_create',
  INVENTORY_UPDATE = 'inventory_update',
  INVENTORY_DELETE = 'inventory_delete',
  
  // Settings activities
  SETTINGS_UPDATE = 'settings_update',
}

// Activity severity levels
export enum ActivitySeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

// Activity interface
export interface Activity {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  type: ActivityType;
  description: string;
  details?: Record<string, any>;
  severity: ActivitySeverity;
  ipAddress?: string;
  userAgent?: string;
  timestamp: number;
}

// Activity log service interface
export interface ActivityLogService {
  logActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => Promise<void>;
  getActivities: (filters?: ActivityFilters) => Promise<Activity[]>;
  getUserActivities: (userId: string) => Promise<Activity[]>;
  clearActivities: () => Promise<void>;
}

// Activity filters
export interface ActivityFilters {
  userId?: string;
  userRole?: UserRole;
  type?: ActivityType;
  severity?: ActivitySeverity;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
} 
 
 
 
 