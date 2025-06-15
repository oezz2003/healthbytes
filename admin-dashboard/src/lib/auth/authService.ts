import { v4 as uuidv4 } from 'uuid';
import { AdminUser, Permission, UserSession } from './types';
import { ADMIN_USERS, ADMIN_CREDENTIALS } from './data';
import { 
  generateToken, 
  comparePassword, 
  saveSession, 
  clearSession, 
  getSession, 
  isSessionValid,
  getClientIP,
  getUserAgent,
  hashPassword
} from './utils';
import { UserRole } from '@/types';
import { 
  activityLogService, 
  ActivityType, 
  ActivitySeverity,
  logLoginActivity,
  logLogoutActivity
} from '../activity';

// Session duration (8 hours)
const SESSION_DURATION = 8 * 60 * 60 * 1000;

// Login function for admin users
export const login = async (email: string, password: string): Promise<AdminUser> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check if user exists
  const storedPassword = ADMIN_CREDENTIALS[email];
  if (!storedPassword) {
    // Log failed login attempt
    logLoginActivity(
      'unknown', 
      email, 
      'Unknown',
      false,
      getClientIP(),
      getUserAgent()
    );
    
    throw new Error('Email not found');
  }

  // Check password
  if (storedPassword !== password) {
    // Find user for logging
    const user = ADMIN_USERS.find(user => user.email === email);
    
    // Log failed login attempt
    if (user) {
      logLoginActivity(
        user.id,
        user.email,
        user.role,
        false,
        getClientIP(),
        getUserAgent()
      );
    }
    
    throw new Error('Incorrect password');
  }

  // Find user
  const user = ADMIN_USERS.find(user => user.email === email);
  if (!user) {
    throw new Error('User not found');
  }

  // Update last login time
  user.lastLogin = Date.now();

  // Create new session
  const session: UserSession = {
    token: generateToken(),
    userId: user.id,
    expiresAt: Date.now() + SESSION_DURATION
  };

  // Save session
  saveSession(session);
  
  // Log successful login
  logLoginActivity(
    user.id,
    user.name,
    user.role,
    true,
    getClientIP(),
    getUserAgent()
  );

  return user;
};

// Logout function
export const logout = (): void => {
  // Get current user before clearing session
  const currentUser = checkAuth();
  
  // Clear session
  clearSession();
  
  // Log logout if user was logged in
  if (currentUser) {
    logLogoutActivity(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      getClientIP(),
      getUserAgent()
    );
  }
};

// Check authentication status
export const checkAuth = (): AdminUser | null => {
  const session = getSession();
  
  // Check session validity
  if (!isSessionValid(session)) {
    clearSession();
    return null;
  }

  // Find user based on session ID
  if (session) {
    const user = ADMIN_USERS.find(user => user.id === session.userId);
    return user || null;
  }
  
  return null;
};

// Update user profile
export const updateProfile = async (userData: Partial<AdminUser>): Promise<AdminUser> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const session = getSession();
  if (!session || !isSessionValid(session)) {
    throw new Error('Not authenticated');
  }
  
  const userIndex = ADMIN_USERS.findIndex(user => user.id === session.userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Update user data
  const user = ADMIN_USERS[userIndex];
  const updatedUser = { ...user, ...userData, updatedAt: Date.now() };
  ADMIN_USERS[userIndex] = updatedUser;
  
  // Log profile update
  activityLogService.logActivity({
    userId: updatedUser.id,
    userName: updatedUser.name,
    userRole: updatedUser.role,
    type: ActivityType.PROFILE_UPDATE,
    description: `User profile updated: ${updatedUser.name}`,
    severity: ActivitySeverity.INFO,
    details: { userId: updatedUser.id },
    ipAddress: getClientIP(),
    userAgent: getUserAgent()
  });
  
  return updatedUser;
};

// Update password
export const updatePassword = async (
  oldPassword: string, 
  newPassword: string
): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const session = getSession();
  if (!session || !isSessionValid(session)) {
    throw new Error('Not authenticated');
  }
  
  const user = ADMIN_USERS.find(user => user.id === session.userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Check old password
  if (ADMIN_CREDENTIALS[user.email] !== oldPassword) {
    throw new Error('Current password is incorrect');
  }
  
  // Update password
  ADMIN_CREDENTIALS[user.email] = newPassword;
  
  // Log password change
  activityLogService.logActivity({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    type: ActivityType.PASSWORD_CHANGE,
    description: `Password changed for user: ${user.name}`,
    severity: ActivitySeverity.INFO,
    ipAddress: getClientIP(),
    userAgent: getUserAgent()
  });
  
  return true;
};

// Check user permissions
export const hasPermission = (
  user: AdminUser | null, 
  permission: Permission | Permission[]
): boolean => {
  if (!user) return false;
  
  // Super Admin has all permissions
  if (user.role === 'Super Admin') return true;
  
  // Check if user has at least one of the permissions
  if (Array.isArray(permission)) {
    return permission.some(p => user.permissions.includes(p));
  }
  
  // Check specific permission
  return user.permissions.includes(permission);
};

// Check user role
export const hasRole = (
  user: AdminUser | null, 
  role: UserRole | UserRole[]
): boolean => {
  if (!user) return false;
  
  // Check if user has at least one of the roles
  if (Array.isArray(role)) {
    return role.includes(user.role);
  }
  
  // Check specific role
  return user.role === role;
}; 
 
 
 
 