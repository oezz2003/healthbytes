'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/ui/Card';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserIcon,
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
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Sample data for charts
const salesData = [
  { name: 'Jan', revenue: 4000, orders: 240 },
  { name: 'Feb', revenue: 3000, orders: 198 },
  { name: 'Mar', revenue: 5000, orders: 300 },
  { name: 'Apr', revenue: 2780, orders: 190 },
  { name: 'May', revenue: 1890, orders: 130 },
  { name: 'Jun', revenue: 2390, orders: 150 },
  { name: 'Jul', revenue: 3490, orders: 210 },
];

const topSellingItems = [
  { name: 'Burger', value: 400 },
  { name: 'Pizza', value: 300 },
  { name: 'Pasta', value: 200 },
  { name: 'Salad', value: 100 },
  { name: 'Dessert', value: 150 },
];

const customerData = [
  { name: 'New', value: 400 },
  { name: 'Returning', value: 300 },
  { name: 'Inactive', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Metric card component
const MetricCard = ({ title, value, change, icon, changeType }: { 
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  changeType: 'increase' | 'decrease' | 'neutral';
}) => {
  return (
    <Card className="h-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="p-3 bg-gray-100 rounded-full">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {changeType === 'increase' ? (
          <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
        ) : changeType === 'decrease' ? (
          <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
        ) : null}
        <span className={`text-sm font-medium ${
          changeType === 'increase' ? 'text-green-600' : 
          changeType === 'decrease' ? 'text-red-600' : 
          'text-gray-500'
        }`}>
          {change}% from last month
        </span>
      </div>
    </Card>
  );
};

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(false);

  // Simulate loading data when time range changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [timeRange]);

  return (
    <DashboardLayout title="Analytics">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Key metrics and performance indicators
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                timeRange === 'week' 
                  ? 'bg-primary-600 text-white border-primary-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setTimeRange('week')}
            >
              Week
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium border-t border-b ${
                timeRange === 'month' 
                  ? 'bg-primary-600 text-white border-primary-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                timeRange === 'year' 
                  ? 'bg-primary-600 text-white border-primary-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setTimeRange('year')}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <MetricCard
          title="Total Revenue"
          value="378,840 EGP"
          change={8.2}
          icon={<CurrencyDollarIcon className="h-6 w-6 text-primary-600" />}
          changeType="increase"
        />
        <MetricCard
          title="Total Orders"
          value="1,429"
          change={5.1}
          icon={<ShoppingCartIcon className="h-6 w-6 text-blue-600" />}
          changeType="increase"
        />
        <MetricCard
          title="Active Customers"
          value="892"
          change={-2.3}
          icon={<UserIcon className="h-6 w-6 text-yellow-600" />}
          changeType="decrease"
        />
        <MetricCard
          title="Menu Items"
          value="64"
          change={0}
          icon={<CakeIcon className="h-6 w-6 text-purple-600" />}
          changeType="neutral"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Revenue & Orders">
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => [
                    name === "Revenue ($)" ? `${(Number(value) * 30).toFixed(2)} EGP` : value,
                    name === "Revenue ($)" ? "Revenue (EGP)" : name
                  ]}/>
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    yAxisId="left"
                    name="Revenue ($)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#82ca9d" 
                    fillOpacity={1} 
                    fill="url(#colorOrders)" 
                    yAxisId="right"
                    name="Orders"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card title="Top Selling Items">
          {loading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topSellingItems}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Customer Segments">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {customerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <div className="lg:col-span-2">
          <Card title="Recent Activity">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-full bg-primary-100">
                    <ShoppingCartIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">New order placed</p>
                    <p className="text-xs text-gray-500">Order #12345 - 2,699.70 EGP</p>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">
                    2 hours ago
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage; 