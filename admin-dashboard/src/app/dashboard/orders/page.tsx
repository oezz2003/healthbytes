'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Order } from '@/types';
import { useRouter } from 'next/navigation';

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
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = 'bg-gray-100 text-gray-800';
  let statusText = status;

  switch (status.toLowerCase()) {
    case 'pending':
      bgColor = 'bg-yellow-100 text-yellow-800';
      statusText = 'Pending';
      break;
    case 'processing':
      bgColor = 'bg-blue-100 text-blue-800';
      statusText = 'Processing';
      break;
    case 'confirmed':
      bgColor = 'bg-indigo-100 text-indigo-800';
      statusText = 'Confirmed';
      break;
    case 'delivered':
      bgColor = 'bg-green-100 text-green-800';
      statusText = 'Delivered';
      break;
    case 'completed':
      bgColor = 'bg-green-100 text-green-800';
      statusText = 'Completed';
      break;
    case 'cancelled':
      bgColor = 'bg-red-100 text-red-800';
      statusText = 'Cancelled';
      break;
  }

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}>
      {statusText}
    </span>
  );
};

const OrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | null>(null);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch orders from API
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to load orders');
        }
        
        setOrders(data.data || []);
        setFilteredOrders(data.data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Apply filters when searchTerm, statusFilter or dateFilter changes
  useEffect(() => {
    let result = [...orders];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        (order.orderNumber?.toString().includes(term) || 
        order.userName?.toLowerCase().includes(term) ||
        order.id.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    // Apply date filter
    if (dateFilter) {
      const now = new Date();
      let startDate: Date;
      
      switch (dateFilter) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = new Date(0); // Beginning of time
      }
      
      result = result.filter(order => new Date(order.createdAt) >= startDate);
    }
    
    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter(null);
    setDateFilter(null);
  };

  const refreshOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch orders from API
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to load orders');
      }
      
      setOrders(data.data || []);
      setFilteredOrders(data.data || []);
    } catch (err) {
      console.error('Error refreshing orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Orders">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all customer orders
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Button
            variant="light"
            leftIcon={<ArrowPathIcon className="h-5 w-5" />}
            onClick={refreshOrders}
            isLoading={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <Card>
          <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search orders by number or customer name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Button
                    variant={statusFilter ? 'primary' : 'light'}
                    leftIcon={<FunnelIcon className="h-4 w-4" />}
                    onClick={() => {}}
                  >
                    Status
                  </Button>
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg z-10 hidden group-hover:block">
                    <div className="p-2">
                      {['Pending', 'Processing', 'Confirmed', 'Delivered', 'Completed', 'Cancelled'].map((status) => (
                        <div
                          key={status}
                          className={`px-4 py-2 hover:bg-gray-100 cursor-pointer rounded ${statusFilter?.toLowerCase() === status.toLowerCase() ? 'bg-primary-50 text-primary-700' : ''}`}
                          onClick={() => setStatusFilter(statusFilter?.toLowerCase() === status.toLowerCase() ? null : status)}
                        >
                          {status}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant={dateFilter === 'today' ? 'primary' : 'light'}
                  onClick={() => setDateFilter(dateFilter === 'today' ? null : 'today')}
                >
                  Today
                </Button>
                
                <Button
                  variant={dateFilter === 'week' ? 'primary' : 'light'}
                  onClick={() => setDateFilter(dateFilter === 'week' ? null : 'week')}
                >
                  Last Week
                </Button>
                
                <Button
                  variant={dateFilter === 'month' ? 'primary' : 'light'}
                  onClick={() => setDateFilter(dateFilter === 'month' ? null : 'month')}
                >
                  Last Month
                </Button>
                
                {(searchTerm || statusFilter || dateFilter) && (
                  <Button
                    variant="light"
                    leftIcon={<XMarkIcon className="h-4 w-4" />}
                    onClick={clearFilters}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <Card className="bg-red-50 border-red-200">
          <div className="p-4 text-red-700">{error}</div>
        </Card>
      ) : (
        <Card>
          {filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{order.orderNumber || order.id.substring(0, 8)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.userName || 'Unknown Customer'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.totalAmount ? `${order.totalAmount.toFixed(2)} EGP` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">No orders found matching your filters.</p>
              {(searchTerm || statusFilter || dateFilter) && (
                <Button
                  variant="light"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </Card>
      )}
    </DashboardLayout>
  );
};

export default OrdersPage; 