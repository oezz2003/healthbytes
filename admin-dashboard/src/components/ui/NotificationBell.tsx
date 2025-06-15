import React, { useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'order' | 'system' | 'inventory' | 'user';
}

interface NotificationBellProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  const handleNotificationClick = (id: string) => {
    onMarkAsRead(id);
  };

  // Get icon color based on notification type
  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return 'text-blue-500';
      case 'inventory':
        return 'text-yellow-500';
      case 'system':
        return 'text-red-500';
      case 'user':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  // Format time relative to now (e.g., "2 hours ago")
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffMinutes / 1440);
      return `${days}d ago`;
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        onClick={toggleDropdown}
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={handleClickOutside}
          />
          <div className="absolute right-0 z-20 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="text-sm text-blue-500 hover:text-blue-700"
                  onClick={onMarkAllAsRead}
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-6 px-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                <div className="py-1">
                  {notifications.slice(0, 5).map((notification, index) => (
                    <div
                      key={`bell-notification-${notification.id}-${index}`}
                      className={`px-4 py-3 hover:bg-gray-50 ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex justify-between">
                        <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        <span className={`ml-2 text-xs ${getTypeColor(notification.type)}`}>
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="border-t p-3">
                <Link 
                  href="/dashboard/notifications"
                  className="block w-full text-center text-sm text-blue-500 hover:text-blue-700"
                  onClick={() => setIsOpen(false)}
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell; 