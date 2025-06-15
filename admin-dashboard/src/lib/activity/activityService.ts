import { v4 as uuidv4 } from 'uuid';
import { Activity, ActivityFilters, ActivityLogService, ActivityType, ActivitySeverity } from './types';
import { UserRole } from '@/types';

// Local storage key for activities
const ACTIVITY_STORAGE_KEY = 'user_activities';

// Maximum number of activities to store locally
const MAX_ACTIVITIES = 1000;

// Activity log service implementation
export class LocalActivityLogService implements ActivityLogService {
  private getStoredActivities(): Activity[] {
    if (typeof window === 'undefined') return [];
    
    const storedData = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (!storedData) return [];
    
    try {
      return JSON.parse(storedData) as Activity[];
    } catch (error) {
      console.error('Error parsing stored activities:', error);
      return [];
    }
  }
  
  private saveActivities(activities: Activity[]): void {
    if (typeof window === 'undefined') return;
    
    // Limit the number of stored activities to prevent local storage overflow
    const limitedActivities = activities.slice(0, MAX_ACTIVITIES);
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(limitedActivities));
  }
  
  async logActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<void> {
    const activities = this.getStoredActivities();
    
    const newActivity: Activity = {
      ...activity,
      id: uuidv4(),
      timestamp: Date.now(),
    };
    
    // Add to beginning of array (newest first)
    activities.unshift(newActivity);
    
    this.saveActivities(activities);
    
    // Also log to console for debugging
    console.log(`Activity: [${activity.severity}] ${activity.type} - ${activity.description}`);
  }
  
  async getActivities(filters?: ActivityFilters): Promise<Activity[]> {
    let activities = this.getStoredActivities();
    
    // Apply filters if provided
    if (filters) {
      if (filters.userId) {
        activities = activities.filter(a => a.userId === filters.userId);
      }
      
      if (filters.userRole) {
        activities = activities.filter(a => a.userRole === filters.userRole);
      }
      
      if (filters.type) {
        activities = activities.filter(a => a.type === filters.type);
      }
      
      if (filters.severity) {
        activities = activities.filter(a => a.severity === filters.severity);
      }
      
      if (filters.startDate) {
        const startTimestamp = filters.startDate.getTime();
        activities = activities.filter(a => a.timestamp >= startTimestamp);
      }
      
      if (filters.endDate) {
        const endTimestamp = filters.endDate.getTime();
        activities = activities.filter(a => a.timestamp <= endTimestamp);
      }
      
      // Apply pagination
      if (filters.offset !== undefined && filters.limit !== undefined) {
        activities = activities.slice(filters.offset, filters.offset + filters.limit);
      } else if (filters.limit !== undefined) {
        activities = activities.slice(0, filters.limit);
      }
    }
    
    return activities;
  }
  
  async getUserActivities(userId: string): Promise<Activity[]> {
    const activities = this.getStoredActivities();
    return activities.filter(a => a.userId === userId);
  }
  
  async clearActivities(): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACTIVITY_STORAGE_KEY);
  }
}

// Create singleton instance
export const activityLogService = new LocalActivityLogService();

// Helper functions for common activity logging
export const logLoginActivity = (
  userId: string,
  userName: string,
  userRole: string,
  success: boolean,
  ipAddress?: string,
  userAgent?: string
) => {
  if (success) {
    activityLogService.logActivity({
      userId,
      userName,
      userRole: userRole as UserRole,
      type: ActivityType.LOGIN,
      description: `User ${userName} logged in successfully`,
      severity: ActivitySeverity.INFO,
      ipAddress,
      userAgent
    });
  } else {
    activityLogService.logActivity({
      userId,
      userName,
      userRole: userRole as UserRole,
      type: ActivityType.FAILED_LOGIN,
      description: `Failed login attempt for user ${userName}`,
      severity: ActivitySeverity.WARNING,
      ipAddress,
      userAgent
    });
  }
};

export const logLogoutActivity = (
  userId: string,
  userName: string,
  userRole: string,
  ipAddress?: string,
  userAgent?: string
) => {
  activityLogService.logActivity({
    userId,
    userName,
    userRole: userRole as UserRole,
    type: ActivityType.LOGOUT,
    description: `User ${userName} logged out`,
    severity: ActivitySeverity.INFO,
    ipAddress,
    userAgent
  });
};

export default activityLogService; 