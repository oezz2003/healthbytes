'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  ArrowLeftIcon,
  ShoppingCartIcon,
  ChartPieIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  ExclamationCircleIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { MenuItem, NutritionalInfo } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock menu items data
const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and special sauce',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
    category: 'Burgers',
    nutritionalInfo: {
      calories: 550,
      protein: 25,
      carbs: 45,
      fat: 30,
      ingredients: ['Beef patty', 'Lettuce', 'Tomato', 'Onion', 'Special sauce', 'Sesame bun'],
      allergens: ['Gluten', 'Dairy', 'Egg']
    },
    isAvailable: true,
    createdAt: '2023-01-15T08:30:00Z',
    updatedAt: '2023-05-20T14:45:00Z'
  },
  {
    id: '2',
    name: 'Chicken Shawarma',
    description: 'Marinated chicken with garlic sauce and pickles',
    price: 7.49,
    image: 'https://images.unsplash.com/photo-1606674727310-6d55b6960d8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
    category: 'Wraps',
    nutritionalInfo: {
      calories: 450,
      protein: 30,
      carbs: 40,
      fat: 18,
      ingredients: ['Chicken', 'Garlic sauce', 'Pickles', 'Flatbread'],
      allergens: ['Gluten']
    },
    isAvailable: true,
    createdAt: '2023-02-10T10:15:00Z',
    updatedAt: '2023-04-25T16:30:00Z'
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1598023696416-0193a0bcd302?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
    category: 'Pizza',
    nutritionalInfo: {
      calories: 850,
      protein: 35,
      carbs: 90,
      fat: 40,
      ingredients: ['Pizza dough', 'Tomato sauce', 'Mozzarella cheese', 'Fresh basil', 'Olive oil'],
      allergens: ['Gluten', 'Dairy']
    },
    isAvailable: true,
    createdAt: '2023-03-05T14:20:00Z',
    updatedAt: '2023-05-12T09:45:00Z'
  },
  {
    id: '4',
    name: 'Greek Salad',
    description: 'Fresh vegetables with feta cheese and olives',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
    category: 'Salads',
    nutritionalInfo: {
      calories: 320,
      protein: 12,
      carbs: 15,
      fat: 25,
      ingredients: ['Cucumber', 'Tomato', 'Red onion', 'Feta cheese', 'Kalamata olives', 'Olive oil'],
      allergens: ['Dairy']
    },
    isAvailable: true,
    createdAt: '2023-01-20T11:40:00Z',
    updatedAt: '2023-06-05T13:15:00Z'
  }
];

// Generate mock sales data for a specific menu item
const generateMockSalesData = (itemId: string) => {
  // Generate random sales data for the past 6 months
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => {
    const orders = Math.floor(Math.random() * 100) + 20;
    const revenue = orders * (Math.random() * 10 + 5);
    return {
      month,
      orders,
      revenue: parseFloat(revenue.toFixed(2))
    };
  });
};

// Generate mock inventory usage data
const generateMockInventoryUsage = (itemId: string) => {
  // Simulate ingredients and their usage
  const ingredients = [
    { name: 'Beef patty', initial: 100, current: 65, unit: 'pcs' },
    { name: 'Buns', initial: 120, current: 75, unit: 'pcs' },
    { name: 'Lettuce', initial: 5, current: 2.5, unit: 'kg' },
    { name: 'Tomato', initial: 8, current: 4.2, unit: 'kg' },
    { name: 'Cheese slices', initial: 200, current: 120, unit: 'pcs' }
  ];

  return ingredients;
};

// Generate mock sales percentage data
const generateMockSalesPercentage = (itemId: string) => {
  // Total sales percentage among all menu items
  return {
    percentage: parseFloat((Math.random() * 15 + 5).toFixed(1)),
    rank: Math.floor(Math.random() * 10) + 1,
    totalItems: 20
  };
};

// Generate mock related products
const generateMockRelatedProducts = (itemId: string, currentCategory: string) => {
  // Filter items from the same category excluding the current item
  return mockMenuItems
    .filter(item => item.id !== itemId && item.category === currentCategory)
    .slice(0, 3);
};

// Format currency with EGP
const formatCurrency = (amount: number) => {
  // Convert to EGP and format
  if (!amount && amount !== 0) return '0.00 EGP';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + ' EGP';
  } catch (error) {
    console.error('Error formatting currency:', error);
    return amount.toFixed(2) + ' EGP';
  }
};

// Helper function to format date
const formatDate = (dateString: string | number | null | undefined) => {
  if (!dateString) return 'N/A';
  
  try {
    // Handle Firestore Timestamp objects
    if (dateString && typeof dateString === 'object' && 
        'toDate' in dateString && 
        typeof (dateString as any).toDate === 'function') {
      const date = (dateString as any).toDate();
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    }
    
    // Handle string dates and numeric timestamps
    const date = new Date(dateString as string | number);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error, 'Value:', dateString);
    return 'Invalid date';
  }
};

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const MenuItemDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const itemId = params?.id as string;
  
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [inventoryUsage, setInventoryUsage] = useState<any[]>([]);
  const [salesPercentage, setSalesPercentage] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch menu item data from API
  useEffect(() => {
    const fetchMenuItemData = async () => {
      try {
        setLoading(true);
        
        // Fetch menu item from API
        const response = await fetch(`/api/menuItems/${itemId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch menu item');
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch menu item');
        }
        
        const foundMenuItem = data.data;
        
        if (foundMenuItem) {
          // Ensure the menu item has all required properties
          const processedMenuItem = {
            ...foundMenuItem,
            // Set default values for missing properties
            nutritionalInfo: foundMenuItem.nutritionalInfo || {
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0,
              ingredients: [],
              allergens: []
            },
            isAvailable: typeof foundMenuItem.isAvailable === 'boolean' ? foundMenuItem.isAvailable : true,
            category: foundMenuItem.category || 'Uncategorized'
          };
          
          setMenuItem(processedMenuItem);
          
          // For now, generate mock data for analytics
          // In a real app, these would come from separate API endpoints
          setSalesData(generateMockSalesData(processedMenuItem.id));
          setInventoryUsage(generateMockInventoryUsage(processedMenuItem.id));
          setSalesPercentage(generateMockSalesPercentage(processedMenuItem.id));
          
          // Fetch all menu items to find related products
          const allItemsResponse = await fetch('/api/menuItems');
          const allItemsData = await allItemsResponse.json();
          
          if (allItemsData.success) {
            // Filter items from the same category excluding the current item
            const related = allItemsData.data
              .filter((item: MenuItem) => 
                item.id !== processedMenuItem.id && 
                item.category === processedMenuItem.category
              )
              .slice(0, 3);
              
            setRelatedProducts(related);
          }
        } else {
          setError('Menu item not found');
        }
      } catch (error: any) {
        console.error('Error fetching menu item data:', error);
        setError(error.message || 'Failed to load menu item data');
      } finally {
        setLoading(false);
      }
    };
    
    if (itemId) {
      fetchMenuItemData();
    }
  }, [itemId]);
  
  // Handle edit menu item
  const handleEdit = () => {
    router.push(`/dashboard/menu-items?edit=${menuItem?.id}`);
  };
  
  // Go back to menu items page
  const handleBack = () => {
    router.push('/dashboard/menu-items');
  };
  
  // Calculate total orders from sales data
  const totalOrders = salesData.reduce((sum, data) => sum + data.orders, 0);
  
  // Calculate total revenue from sales data
  const totalRevenue = salesData.reduce((sum, data) => sum + data.revenue, 0);
  
  // Calculate inventory usage percentages
  const inventoryPercentages = inventoryUsage.map(item => ({
    name: item.name,
    used: parseFloat(((item.initial - item.current) / item.initial * 100).toFixed(1)),
    remaining: parseFloat((item.current / item.initial * 100).toFixed(1))
  }));
  
  return (
    <DashboardLayout title={`Menu Item Details - ${menuItem?.name || ''}`}>
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
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="secondary"
              onClick={handleBack}
              className="flex items-center"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Menu Items
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {/* Back button and actions */}
          <div className="mb-6 flex justify-between items-center">
            <Button
              variant="secondary"
              onClick={handleBack}
              className="flex items-center"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Menu Items
            </Button>
            
            <Button
              variant="primary"
              onClick={handleEdit}
              className="flex items-center"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Item
            </Button>
          </div>
          
          {/* Menu Item basic information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <Card title="Item Information" className="h-full">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 mb-4 md:mb-0">
                    {menuItem?.image ? (
                      <img 
                        src={menuItem.image} 
                        alt={menuItem.name} 
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="w-full md:w-2/3 md:pl-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{menuItem?.name}</h2>
                        <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {menuItem?.category}
                        </span>
                      </div>
                      <div className="text-xl font-bold text-primary-600">
                        {formatCurrency(menuItem?.price || 0)}
                      </div>
                    </div>
                    
                    <p className="mt-3 text-gray-600 font-light">
                      {menuItem?.description || 'No description available'}
                    </p>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400 font-light">Status</p>
                        <p className="font-medium text-gray-900">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            menuItem?.isAvailable 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {menuItem?.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 font-light">Added on</p>
                        <p className="font-medium text-gray-900">{formatDate(menuItem?.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div>
              <Card title="Sales Overview" className="h-full">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100">
                      <ShoppingCartIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-400 font-light">Total Orders</p>
                      <p className="text-xl font-bold text-gray-900">{totalOrders}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100">
                      <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-400 font-light">Total Revenue</p>
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100">
                      <ChartPieIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-400 font-light">Sales Percentage</p>
                      <p className="text-xl font-bold text-gray-900">{salesPercentage?.percentage}%</p>
                      <p className="text-xs text-gray-500">
                        Rank #{salesPercentage?.rank} out of {salesPercentage?.totalItems} items
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          {/* Nutritional Information */}
          <Card title="Nutritional Information" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3 text-gray-900">Nutrition Facts</h3>
                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600 font-light">Calories:</span>
                    <span className="font-medium text-gray-900">{menuItem?.nutritionalInfo?.calories || 0}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600 font-light">Protein:</span>
                    <span className="font-medium text-gray-900">{menuItem?.nutritionalInfo?.protein || 0}g</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600 font-light">Carbohydrates:</span>
                    <span className="font-medium text-gray-900">{menuItem?.nutritionalInfo?.carbs || 0}g</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600 font-light">Fat:</span>
                    <span className="font-medium text-gray-900">{menuItem?.nutritionalInfo?.fat || 0}g</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2 text-gray-900">Ingredients</h3>
                  {menuItem?.nutritionalInfo?.ingredients && menuItem.nutritionalInfo.ingredients.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {menuItem.nutritionalInfo.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-gray-600">{ingredient}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No ingredients information available</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-900">Allergens</h3>
                  {menuItem?.nutritionalInfo?.allergens && menuItem.nutritionalInfo.allergens.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {menuItem.nutritionalInfo.allergens.map((allergen, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No allergens information available</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
          
          {/* Related Items */}
          {relatedProducts.length > 0 && (
            <Card title="Related Items" className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedProducts.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No image</span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
                        <Button
                          variant="light"
                          size="sm"
                          className="mt-2"
                          onClick={() => router.push(`/dashboard/menu-items/${item.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MenuItemDetailsPage; 