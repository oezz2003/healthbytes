import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Notification } from '@/components/ui/NotificationBell';
import { useToast } from './ToastContext';

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

// إنشاء معرف فريد أكثر موثوقية
const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { showToast } = useToast();

  // Load notifications from localStorage on mount
  useEffect(() => {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      try {
        const parsedNotifications = JSON.parse(storedNotifications);
        // Convert string dates back to Date objects
        const notificationsWithDates = parsedNotifications.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(notificationsWithDates);
      } catch (error) {
        console.error('Failed to parse notifications from localStorage:', error);
      }
    }
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const addNotification = useCallback((newNotification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const notification: Notification = {
      ...newNotification,
      id: generateUniqueId(),
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [notification, ...prev]);

    // Show toast for new notification
    showToast(
      'info',
      'New Notification',
      newNotification.title,
      5000
    );
  }, [showToast]);

  // Sample data - remove in production
  useEffect(() => {
    if (notifications.length === 0) {
      // Add some sample notifications for demonstration
      const sampleNotifications = [
        {
          title: 'New Order Received',
          message: 'Order #1234 has been placed and is waiting for confirmation.',
          type: 'order' as const
        },
        {
          title: 'Inventory Alert',
          message: 'Chicken stock is running low. Please reorder soon.',
          type: 'inventory' as const
        },
        {
          title: 'System Update',
          message: 'The system will undergo maintenance tonight at 2 AM.',
          type: 'system' as const
        }
      ];

      // Add with different timestamps, ensuring a delay between each addition
      sampleNotifications.forEach((notification, index) => {
        setTimeout(() => {
          const now = new Date();
          const pastTime = new Date(now);
          pastTime.setHours(now.getHours() - index * 2);
          
          addNotification(notification);
        }, index * 500); // زيادة التأخير إلى 500 ملي ثانية لمنع التداخل
      });
    }
  }, [notifications.length, addNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead, markAllAsRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider; 