'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/ui/Card';
import { activityLogService, Activity, ActivityType, ActivitySeverity } from '@/lib/activity';
import { useAuth } from '@/lib/hooks/useAuth';
import { format } from 'date-fns';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  ClockIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const ActivityPage = () => {
  const { user, hasPermission } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const data = await activityLogService.getActivities();
        setActivities(data);
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  const clearActivities = async () => {
    if (confirm('Are you sure you want to clear all activity logs? This action cannot be undone.')) {
      try {
        await activityLogService.clearActivities();
        setActivities([]);
      } catch (error) {
        console.error('Error clearing activities:', error);
      }
    }
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type.startsWith(filter));

  const getActivityIcon = (activity: Activity) => {
    switch (activity.severity) {
      case ActivitySeverity.INFO:
        return <CheckCircleIcon className="w-5 h-5 text-blue-500" />;
      case ActivitySeverity.WARNING:
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case ActivitySeverity.ERROR:
        return <ExclamationCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <DocumentTextIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityTypeLabel = (type: ActivityType) => {
    switch (type) {
      case ActivityType.LOGIN:
        return 'Login';
      case ActivityType.LOGOUT:
        return 'Logout';
      case ActivityType.FAILED_LOGIN:
        return 'Failed Login';
      case ActivityType.PASSWORD_CHANGE:
        return 'Password Change';
      case ActivityType.PROFILE_UPDATE:
        return 'Profile Update';
      case ActivityType.USER_CREATE:
        return 'User Created';
      case ActivityType.USER_UPDATE:
        return 'User Updated';
      case ActivityType.USER_DELETE:
        return 'User Deleted';
      case ActivityType.MENU_ITEM_CREATE:
        return 'Menu Item Created';
      case ActivityType.MENU_ITEM_UPDATE:
        return 'Menu Item Updated';
      case ActivityType.MENU_ITEM_DELETE:
        return 'Menu Item Deleted';
      case ActivityType.ORDER_CREATE:
        return 'Order Created';
      case ActivityType.ORDER_UPDATE:
        return 'Order Updated';
      case ActivityType.ORDER_STATUS_CHANGE:
        return 'Order Status Changed';
      case ActivityType.ORDER_DELETE:
        return 'Order Deleted';
      case ActivityType.INVENTORY_CREATE:
        return 'Inventory Item Created';
      case ActivityType.INVENTORY_UPDATE:
        return 'Inventory Item Updated';
      case ActivityType.INVENTORY_DELETE:
        return 'Inventory Item Deleted';
      case ActivityType.SETTINGS_UPDATE:
        return 'Settings Updated';
      default:
        return type;
    }
  };

  return (
    <DashboardLayout title="User Activity Log">
      <div className="space-y-6">
        <Card>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">Activity Log</h2>
              
              <div className="mt-3 md:mt-0 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                <select
                  className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Activities</option>
                  <option value="login">Authentication</option>
                  <option value="user">User Management</option>
                  <option value="menu">Menu Items</option>
                  <option value="order">Orders</option>
                  <option value="inventory">Inventory</option>
                  <option value="settings">Settings</option>
                </select>
                
                {hasPermission(['all']) && (
                  <button
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center justify-center"
                    onClick={clearActivities}
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Clear Logs
                  </button>
                )}
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-primary-500"></div>
                <p className="mt-2 text-gray-500">Loading activity logs...</p>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">No activity logs found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredActivities.map((activity) => (
                      <tr key={activity.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {getActivityIcon(activity)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {getActivityTypeLabel(activity.type)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {activity.severity}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <UserIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {activity.userName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {activity.userRole}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {activity.description}
                          </div>
                          {activity.details && (
                            <div className="text-xs text-gray-500">
                              {Object.entries(activity.details).map(([key, value]) => (
                                <span key={key} className="mr-2">
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {format(new Date(activity.timestamp), 'MMM d, yyyy HH:mm:ss')}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ActivityPage; 
 
 
 
 