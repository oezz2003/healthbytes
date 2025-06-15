'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useNotifications } from '@/contexts/NotificationContext';
import { Tab } from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const NotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [selectedTab, setSelectedTab] = useState(0);

  // Filter notifications by type
  const filteredNotifications = {
    all: notifications,
    unread: notifications.filter(n => !n.read),
    order: notifications.filter(n => n.type === 'order'),
    system: notifications.filter(n => n.type === 'system'),
    inventory: notifications.filter(n => n.type === 'inventory'),
    user: notifications.filter(n => n.type === 'user')
  };

  // Get icon based on notification type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'inventory':
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />;
      case 'system':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'user':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, 'MMM dd, yyyy - h:mm a');
  };

  const tabs = [
    { key: 'all', label: 'All', count: filteredNotifications.all.length },
    { key: 'unread', label: 'Unread', count: filteredNotifications.unread.length },
    { key: 'order', label: 'Orders', count: filteredNotifications.order.length },
    { key: 'system', label: 'System', count: filteredNotifications.system.length },
    { key: 'inventory', label: 'Inventory', count: filteredNotifications.inventory.length },
  ];

  return (
    <DashboardLayout title="Notifications">
      <div className="py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Notifications</h3>
              {filteredNotifications.unread.length > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
              <Tab.List className="flex p-1 space-x-1 bg-gray-50 border-b">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.key}
                    className={({ selected }: { selected: boolean }) =>
                      `py-2.5 px-4 text-sm font-medium leading-5 rounded-none
                      ${
                        selected
                          ? 'text-blue-700 border-b-2 border-blue-500'
                          : 'text-gray-500 hover:text-gray-700'
                      }`
                    }
                  >
                    {tab.label} {tab.count > 0 && <span className="ml-1">({tab.count})</span>}
                  </Tab>
                ))}
              </Tab.List>

              <Tab.Panels>
                {Object.keys(filteredNotifications).map((key, index) => (
                  <Tab.Panel key={`tab-panel-${key}-${index}`} className="p-0">
                    {filteredNotifications[key as keyof typeof filteredNotifications].length === 0 ? (
                      <div className="text-center py-12">
                        <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {key === 'unread' ? 'You have read all notifications.' : 'No notifications in this category.'}
                        </p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {filteredNotifications[key as keyof typeof filteredNotifications].map((notification, notIndex) => (
                          <li
                            key={`notification-${notification.id}-${notIndex}`}
                            className={`${
                              !notification.read ? 'bg-blue-50' : ''
                            } hover:bg-gray-50 transition-colors`}
                          >
                            <div
                              className="px-4 py-4 sm:px-6 cursor-pointer"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 mr-3">
                                    {getTypeIcon(notification.type)}
                                  </div>
                                  <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                    {notification.title}
                                  </p>
                                </div>
                                <div className="ml-2 flex-shrink-0 flex">
                                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                    {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2 text-sm text-gray-500">
                                <p>{notification.message}</p>
                              </div>
                              <div className="mt-2 text-xs text-gray-400">
                                {formatDate(notification.timestamp)}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage; 