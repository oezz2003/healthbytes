'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
  PencilIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { User, Order } from '@/types';

// Helper function to format date
const formatDate = (dateString: string | number) => {
  if (!dateString) return 'N/A';
  
  try {
    // Handle both string dates and numeric timestamps
    const date = typeof dateString === 'number' 
      ? new Date(dateString) 
      : new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

// Helper function to format status
const formatStatus = (status: string) => {
  const statusMap: Record<string, { text: string, color: string }> = {
    'pending': { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    'processing': { text: 'Processing', color: 'bg-blue-100 text-blue-800' },
    'completed': { text: 'Completed', color: 'bg-green-100 text-green-800' },
    'delivered': { text: 'Delivered', color: 'bg-green-100 text-green-800' },
    'cancelled': { text: 'Cancelled', color: 'bg-red-100 text-red-800' }
  };
  
  return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
};

const UserDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'activity'>('orders');
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user data from Firebase
        const userResponse = await fetch(`/api/users/${userId}`);
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(errorData.error || 'Failed to fetch user data');
        }
        const userData = await userResponse.json();
        if (!userData.success) {
          throw new Error(userData.error || 'Failed to fetch user data');
        }
        setUser(userData.data);

        // Fetch user orders from Firebase
        const ordersResponse = await fetch(`/api/orders?userId=${userId}`);
        if (!ordersResponse.ok) {
          const errorData = await ordersResponse.json();
          throw new Error(errorData.error || 'Failed to fetch user orders');
        }
        const ordersData = await ordersResponse.json();
        if (!ordersData.success) {
          throw new Error(ordersData.error || 'Failed to fetch user orders');
        }
        setOrders(ordersData.data || []);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        // Reset data on error
        setUser(null);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchUserData();
    }
  }, [userId]);
  
  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
      case 'Super Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Operation Manager':
      case 'Accounting Manager':
      case 'Sales Manager':
        return 'bg-blue-100 text-blue-800';
      case 'Staff':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/users?id=${userId}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to delete user');
        }
        
        router.push('/dashboard/users');
      } catch (err) {
        console.error('Error deleting user:', err);
        alert(err instanceof Error ? err.message : 'Failed to delete user');
      }
    }
  };
  
  return (
    <DashboardLayout title={`User: ${user?.name || 'Loading...'}`}>
      <div className="mb-6 flex justify-between items-center">
        <Button
          variant="light"
          leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
          onClick={() => router.back()}
        >
          Back to Users
        </Button>
        
        {user && (
          <Button
            variant="primary"
            leftIcon={<PencilIcon className="h-4 w-4" />}
            onClick={() => router.push(`/dashboard/users/edit/${userId}`)}
          >
            Edit User
          </Button>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <Card className="bg-red-50 border-red-200">
          <div className="p-4 text-red-700">{error}</div>
        </Card>
      ) : user ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="md:col-span-1">
            <Card>
              <div className="p-6 flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-12 w-12 text-gray-500" />
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                
                <div className="mt-2">
                  <span className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                
                <div className="mt-4 space-y-2 w-full">
                  <div className="flex items-center justify-center">
                    <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">{user.email}</span>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <PhoneIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">{user.phone}</span>
                  </div>
                  
                  {user.address && (
                    <div className="flex items-center justify-center">
                      <MapPinIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{user.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
          
          {/* User Details */}
          <div className="md:col-span-2">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">User Information</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">User ID</h4>
                      <p className="mt-1">{user.id}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Role</h4>
                      <div className="mt-1 flex items-center">
                        <ShieldCheckIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <span>{user.role}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Created At</h4>
                      <div className="mt-1 flex items-center">
                        <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <span>{formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                      <div className="mt-1 flex items-center">
                        <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <span>{formatDate(user.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="light"
                      onClick={() => router.push(`/dashboard/users/edit/${userId}`)}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="light"
                      onClick={() => router.push(`/dashboard/users/reset-password/${userId}`)}
                    >
                      Reset Password
                    </Button>
                    <Button
                      variant="danger"
                      onClick={handleDeleteUser}
                    >
                      Delete User
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* User Orders */}
            <Card className="mt-6">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
                
                {orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order #
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => {
                          const statusInfo = formatStatus(order.status);
                          return (
                            <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/dashboard/orders/${order.id}`)}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">#{order.orderNumber || order.id.substring(0, 8)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}>
                                  {statusInfo.text}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.totalAmount ? `${order.totalAmount.toFixed(2)} EGP` : 'N/A'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No orders found for this user.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
};

export default UserDetailPage; 