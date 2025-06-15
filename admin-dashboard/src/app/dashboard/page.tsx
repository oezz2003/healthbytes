'use client';

import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import Card from '@/components/ui/Card';
import { 
  UserIcon, 
  ShoppingCartIcon, 
  CurrencyDollarIcon, 
  CakeIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart,
  Scatter
} from 'recharts';
import { useAuth } from '@/lib/hooks/useAuth';
import { db } from '@/lib/firebase/clientApp';
import { useNotifications } from '@/contexts/NotificationContext';
import { useToast } from '@/contexts/ToastContext';

// Define data types
interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  menuItems: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: Date;
  userName: string;
}

interface SalesDataItem {
  name: string;
  revenue: number;
  orders: number;
}

interface TopSellingItem {
  id: string;
  name: string;
  orders: number;
  revenue: number;
  quantity: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  salesData: SalesDataItem[];
  topSellingItems: TopSellingItem[];
}

// Colors for charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    menuItems: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [salesData, setSalesData] = useState<SalesDataItem[]>([]);
  const [topSellingItems, setTopSellingItems] = useState<TopSellingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const { addNotification } = useNotifications();
  const { showToast } = useToast();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch data from API
        const response = await fetch('/api/dashboard');
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          const dashboardData: DashboardData = result.data;
          
          // Set stats
          setStats(dashboardData.stats);
          
          // Set recent orders - ensure dates are parsed correctly
          setRecentOrders(dashboardData.recentOrders.map(order => ({
            ...order,
            createdAt: new Date(order.createdAt)
          })));
          
          // Set sales data
          setSalesData(dashboardData.salesData);
          
          // Set top selling items
          setTopSellingItems(dashboardData.topSellingItems);
          
          console.log('✅ Dashboard data loaded from API');
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        showToast('error', 'Error', 'Failed to load dashboard data');
        
        // Load fallback mock data
        const mockStats: DashboardStats = {
          totalUsers: 156,
          activeUsers: 87,
          totalOrders: 432,
          pendingOrders: 18,
          totalRevenue: 15680.50,
          menuItems: 48,
        };
        
        setStats(mockStats);
        
        // Mock recent orders
        const mockRecentOrders: RecentOrder[] = [
          {
            id: 'order-10005',
            orderNumber: '10005',
            status: 'completed',
            total: 129.98,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            userName: 'Ahmed Mohamed'
          },
          {
            id: 'order-10004',
            orderNumber: '10004',
            status: 'pending',
            total: 113.96,
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
            userName: 'Sara Ahmed'
          }
        ];
        setRecentOrders(mockRecentOrders);
        
        // Mock sales data
        const mockSalesData: SalesDataItem[] = [
          { name: 'January', revenue: 4000, orders: 24 },
          { name: 'February', revenue: 3000, orders: 18 },
          { name: 'March', revenue: 5000, orders: 30 },
          { name: 'April', revenue: 2780, orders: 16 },
          { name: 'May', revenue: 1890, orders: 11 },
          { name: 'June', revenue: 2390, orders: 14 },
          { name: 'July', revenue: 3490, orders: 21 },
        ];
        setSalesData(mockSalesData);
        
        // Mock top selling items
        const mockTopSellingItems: TopSellingItem[] = [
          { id: 'item-1', name: 'Margherita Pizza', orders: 124, revenue: 1860, quantity: 124 },
          { id: 'item-2', name: 'Deluxe Burger', orders: 98, revenue: 1470, quantity: 98 },
          { id: 'item-3', name: 'Pasta Carbonara', orders: 82, revenue: 1230, quantity: 82 },
          { id: 'item-4', name: 'Caesar Salad', orders: 76, revenue: 912, quantity: 76 },
          { id: 'item-5', name: 'Chicken Wings', orders: 65, revenue: 780, quantity: 65 },
        ];
        setTopSellingItems(mockTopSellingItems);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [showToast]);

  // Prepare pie chart data for order status distribution
  const orderStatusData = useMemo(() => {
    const statusCounts: Record<string, number> = {
      'completed': 0,
      'pending': 0,
      'processing': 0,
      'cancelled': 0,
      'delivered': 0
    };
    
    recentOrders.forEach(order => {
      if (statusCounts[order.status] !== undefined) {
        statusCounts[order.status]++;
      } else {
        statusCounts[order.status] = 1;
      }
    });
    
    return Object.entries(statusCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    })).filter(item => item.value > 0);
  }, [recentOrders]);
  
  // Filter sales data based on selected time range
  const filteredSalesData = useMemo(() => {
    if (selectedTimeRange === 'week') {
      // Return last 7 days of data
      return salesData.slice(-7);
    } else if (selectedTimeRange === 'year') {
      // Return all data
      return salesData;
    }
    // Default: month (last 30 days)
    return salesData.slice(-4);
  }, [salesData, selectedTimeRange]);
  
  // Calculate revenue growth
  const revenueGrowth = useMemo(() => {
    if (salesData.length < 2) return 0;
    
    const currentRevenue = salesData[salesData.length - 1].revenue;
    const previousRevenue = salesData[salesData.length - 2].revenue;
    
    if (previousRevenue === 0) return 100;
    
    return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  }, [salesData]);
  
  // Calculate orders growth
  const ordersGrowth = useMemo(() => {
    if (salesData.length < 2) return 0;
    
    const currentOrders = salesData[salesData.length - 1].orders;
    const previousOrders = salesData[salesData.length - 2].orders;
    
    if (previousOrders === 0) return 100;
    
    return ((currentOrders - previousOrders) / previousOrders) * 100;
  }, [salesData]);

  const handleTestNotification = () => {
    // Create test notification
    addNotification({
      title: 'Test Notification',
      message: 'This is a test notification created from the dashboard.',
      type: 'system'
    });

    // Show toast message
    showToast('success', 'Success', 'Test notification created!');
  };

  return (
    <DashboardLayout title="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-primary-500 transition ease-in-out duration-150">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Loading...
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              description={`${stats.activeUsers} active users`}
              icon={<UserIcon className="h-6 w-6 text-blue-600" />}
              trend={{ value: Math.round((stats.activeUsers / stats.totalUsers) * 100), isPositive: true }}
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              description={`${stats.pendingOrders} pending orders`}
              icon={<ShoppingCartIcon className="h-6 w-6 text-green-600" />}
              trend={{ value: Math.round(ordersGrowth), isPositive: ordersGrowth >= 0 }}
            />
            <StatCard
              title="Total Revenue"
              value={`${stats.totalRevenue.toFixed(2)} EGP`}
              icon={<CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />}
              trend={{ value: Math.round(revenueGrowth), isPositive: revenueGrowth >= 0 }}
            />
            <StatCard
              title="Menu Items"
              value={stats.menuItems}
              icon={<CakeIcon className="h-6 w-6 text-purple-600" />}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Revenue Overview" className="lg:col-span-2">
              <div className="flex justify-end mb-4">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    type="button"
                    onClick={() => setSelectedTimeRange('week')}
                    className={`px-4 py-2 text-sm font-medium ${
                      selectedTimeRange === 'week'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } border border-gray-200 rounded-l-lg`}
                  >
                    Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTimeRange('month')}
                    className={`px-4 py-2 text-sm font-medium ${
                      selectedTimeRange === 'month'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } border-t border-b border-gray-200`}
                  >
                    Month
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTimeRange('year')}
                    className={`px-4 py-2 text-sm font-medium ${
                      selectedTimeRange === 'year'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } border border-gray-200 rounded-r-lg`}
                  >
                    Year
                  </button>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={filteredSalesData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'revenue') return [`${Number(value).toFixed(2)} EGP`, 'Revenue'];
                        return [value, name === 'orders' ? 'Orders' : name];
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      yAxisId="left"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      yAxisId="right"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Top Selling Items">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topSellingItems}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? `${Number(value).toFixed(2)} EGP` : value, 
                        name === 'revenue' ? 'Revenue' : name === 'orders' ? 'Orders' : name
                      ]} 
                    />
                    <Legend />
                    <Bar dataKey="orders" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="revenue" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Order Status Distribution">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Recent Orders">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-US')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total.toFixed(2)} EGP</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="mt-6">
            <button 
              onClick={handleTestNotification}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Create Test Notification
            </button>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard; 