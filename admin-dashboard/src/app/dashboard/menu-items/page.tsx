'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import { 
  PlusIcon, PencilIcon, TrashIcon, ExclamationCircleIcon,
  EyeIcon, ArrowUpIcon, ArrowDownIcon, ChartBarIcon
} from '@heroicons/react/24/outline';
import { MenuItem } from '@/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
  },
  {
    id: '5',
    name: 'Falafel Wrap',
    description: 'Crispy falafel with tahini sauce and vegetables',
    price: 6.49,
    image: 'https://images.unsplash.com/photo-1547058881-aa0edd92aab2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
    category: 'Wraps',
    nutritionalInfo: {
      calories: 380,
      protein: 12,
      carbs: 50,
      fat: 15,
      ingredients: ['Falafel', 'Tahini sauce', 'Lettuce', 'Tomato', 'Onion', 'Flatbread'],
      allergens: ['Gluten', 'Sesame']
    },
    isAvailable: true,
    createdAt: '2023-02-25T09:10:00Z',
    updatedAt: '2023-04-30T15:20:00Z'
  },
  {
    id: '6',
    name: 'Chocolate Brownie',
    description: 'Rich chocolate brownie with walnuts',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
    category: 'Desserts',
    nutritionalInfo: {
      calories: 420,
      protein: 5,
      carbs: 55,
      fat: 22,
      ingredients: ['Chocolate', 'Flour', 'Sugar', 'Butter', 'Eggs', 'Walnuts'],
      allergens: ['Gluten', 'Dairy', 'Egg', 'Nuts']
    },
    isAvailable: true,
    createdAt: '2023-03-15T13:50:00Z',
    updatedAt: '2023-05-22T10:30:00Z'
  }
];

// Generate mock sales data for menu items
const generateMockSalesData = () => {
  return mockMenuItems.map(item => {
    const orders = Math.floor(Math.random() * 500) + 50;
    const revenue = orders * item.price;
    const percentage = parseFloat((Math.random() * 20 + 1).toFixed(1));
    
    return {
      id: item.id,
      orders,
      revenue,
      percentage
    };
  });
};

// Helper function to format currency
const formatCurrency = (amount: number) => {
  // Convert USD to EGP (multiply by 30) and format as EGP
  const egpAmount = amount * 30;
  return `${egpAmount.toFixed(2)} EGP`;
};

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
    day: 'numeric'
  }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

// إنشاء معرف فريد أكثر موثوقية
const generateUniqueId = () => {
  return `menu-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

const MenuItemsPage = () => {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'orders' | 'percentage'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({});
  const [imageUrl, setImageUrl] = useState<string>('');

  // Load menu items on component mount
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setLoading(true);
        
        // Fetch menu items from API
        const response = await fetch('/api/menuItems');
        
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch menu items');
        }
        
        setMenuItems(data.data);
        setFilteredItems(data.data);
        
        // Generate mock sales data for now - in a real app, this would come from another API
        setSalesData(generateMockSalesData());
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load menu items'));
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, []);

  // Filter menu items when search term or selected category changes
  useEffect(() => {
    let result = [...menuItems];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term)
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // Sort the results
    result = sortItems(result);
    
    setFilteredItems(result);
  }, [menuItems, searchTerm, selectedCategory, sortBy, sortDirection]);

  // Sort items based on current sort settings
  const sortItems = (items: MenuItem[]) => {
    return [...items].sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        comparison = a.price - b.price;
      } else if (sortBy === 'orders') {
        const aOrders = salesData.find(item => item.id === a.id)?.orders || 0;
        const bOrders = salesData.find(item => item.id === b.id)?.orders || 0;
        comparison = aOrders - bOrders;
      } else if (sortBy === 'percentage') {
        const aPercentage = salesData.find(item => item.id === a.id)?.percentage || 0;
        const bPercentage = salesData.find(item => item.id === b.id)?.percentage || 0;
        comparison = aPercentage - bPercentage;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  // Handle sort change
  const handleSort = (column: 'name' | 'price' | 'orders' | 'percentage') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Extract unique categories from menu items for the filter buttons
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set<string>();
    menuItems.forEach(item => {
      if (item.category) {
        uniqueCategories.add(item.category);
      }
    });
    return Array.from(uniqueCategories);
  }, [menuItems]);

  // Handle adding a new menu item
  const handleAddMenuItem = async (itemData: Partial<MenuItem>) => {
    try {
      const newItem = {
        ...itemData,
        image: imageUrl || 'https://via.placeholder.com/500',
        isAvailable: true,
      };
      
      const response = await fetch('/api/menuItems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add menu item');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to add menu item');
      }
      
      // Refresh the menu items list
      const updatedResponse = await fetch('/api/menuItems');
      const updatedData = await updatedResponse.json();
      
      if (updatedData.success) {
        setMenuItems(updatedData.data);
        setFilteredItems(updatedData.data);
      }
      
      // Add sales data for the new item
      const newSalesData = {
        id: data.data.id,
        orders: 0,
        revenue: 0,
        percentage: 0
      };
      
      setSalesData(prevData => [...prevData, newSalesData]);
      setIsFormModalOpen(false);
      setImageUrl('');
      return true;
    } catch (err) {
      console.error('Error adding menu item:', err);
      return false;
    }
  };

  // Handle updating a menu item
  const handleUpdateMenuItem = async (itemData: Partial<MenuItem>) => {
    try {
      if (!editingItem) return false;
      
      const response = await fetch(`/api/menuItems/${editingItem.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...itemData,
          image: imageUrl || editingItem.image,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update menu item');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update menu item');
      }
      
      // Refresh the menu items list
      const updatedResponse = await fetch('/api/menuItems');
      const updatedData = await updatedResponse.json();
      
      if (updatedData.success) {
        setMenuItems(updatedData.data);
        setFilteredItems(updatedData.data);
      }
      
      setIsFormModalOpen(false);
      setEditingItem(null);
      setImageUrl('');
      return true;
    } catch (err) {
      console.error('Error updating menu item:', err);
      return false;
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.category || !formData.price) {
      setError(new Error('Please fill in all required fields'));
      return;
    }
    
    try {
      if (editingItem) {
        await handleUpdateMenuItem({
          ...formData,
          id: editingItem.id
        });
      } else {
        await handleAddMenuItem(formData);
      }
      
      // Reset form and close modal
      setFormData({});
      setIsFormModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save menu item'));
    }
  };

  // Handle deleting a menu item
  const handleDeleteMenuItem = async () => {
    try {
      if (!itemToDelete) return false;
      
      const response = await fetch(`/api/menuItems/${itemToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete menu item');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete menu item');
      }
      
      // Update local state
      const updatedItems = menuItems.filter(item => item.id !== itemToDelete.id);
      setMenuItems(updatedItems);
      setFilteredItems(updatedItems.filter(item => 
        (!selectedCategory || item.category === selectedCategory) &&
        (!searchTerm || 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      ));
      
      // Remove sales data for the deleted item
      const updatedSalesData = salesData.filter(data => data.id !== itemToDelete.id);
      setSalesData(updatedSalesData);

      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      return true;
    } catch (err) {
      console.error('Error deleting menu item:', err);
      return false;
    }
  };

  // Set form data when editing an item
  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      isAvailable: item.isAvailable,
      nutritionalInfo: item.nutritionalInfo
    });
    setImageUrl(item.image || '');
    setIsFormModalOpen(true);
  };

  return (
    <DashboardLayout title="Menu Items">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all menu items
          </p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0">
          <Button
            variant="primary"
            onClick={() => {
              setEditingItem(null);
              setIsFormModalOpen(true);
            }}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add New Item
          </Button>
        </div>
      </div>

      {/* Search and filter */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search menu items by name or description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === undefined ? 'primary' : 'light'}
            size="sm"
            onClick={() => setSelectedCategory(undefined)}
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'light'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <Card className="bg-red-50 border-red-200">
          <p className="text-red-600">{error.message}</p>
        </Card>
      ) : (
        <>
          {/* Menu Items Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('name')}
                    >
                      Item
                      {sortBy === 'name' && (
                        sortDirection === 'asc' 
                          ? <ArrowUpIcon className="h-4 w-4 ml-1" />
                          : <ArrowDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('price')}
                    >
                      Price
                      {sortBy === 'price' && (
                        sortDirection === 'asc' 
                          ? <ArrowUpIcon className="h-4 w-4 ml-1" />
                          : <ArrowDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('orders')}
                    >
                      Orders
                      {sortBy === 'orders' && (
                        sortDirection === 'asc' 
                          ? <ArrowUpIcon className="h-4 w-4 ml-1" />
                          : <ArrowDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('percentage')}
                    >
                      Sales %
                      {sortBy === 'percentage' && (
                        sortDirection === 'asc' 
                          ? <ArrowUpIcon className="h-4 w-4 ml-1" />
                          : <ArrowDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => {
                  const itemSalesData = salesData.find(data => data.id === item.id) || { orders: 0, revenue: 0, percentage: 0 };
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                            {item.image ? (
                              <img 
                                src={item.image}
                                alt={item.name}
                                className="h-10 w-10 object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-500">No img</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div 
                              className="text-sm font-medium text-gray-900 cursor-pointer hover:text-primary-600"
                              onClick={() => router.push(`/dashboard/menu-items/${item.id}`)}
                            >
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-500 max-w-xs truncate">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {itemSalesData.orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(itemSalesData.percentage * 5, 100)}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-700">{itemSalesData.percentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="light"
                            size="sm"
                            onClick={() => router.push(`/dashboard/menu-items/${item.id}`)}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="light"
                            size="sm"
                            onClick={() => {
                              handleEditItem(item);
                            }}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="light"
                            size="sm"
                            onClick={() => {
                              setItemToDelete(item);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Menu Item Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h3>
                
                {error && (
                  <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 mb-4">
                    <p>{error.message}</p>
                  </div>
                )}
                
                <form onSubmit={handleFormSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Basic Information */}
                    <div className="md:col-span-2">
                      <h4 className="text-md font-medium text-gray-800 mb-2">Basic Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                          <input
                            type="text"
                            value={formData.category || ''}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price (EGP) *</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price || ''}
                            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                          <select
                            value={formData.isAvailable !== undefined ? (formData.isAvailable ? 'available' : 'unavailable') : ''}
                            onChange={(e) => setFormData({...formData, isAvailable: e.target.value === 'available'})}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                          >
                            <option value="">Select status</option>
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                          </select>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={formData.description || ''}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            rows={3}
                          ></textarea>
                        </div>
                        
                        <div className="md:col-span-2">
                          <ImageUpload
                            label="Item Image"
                            initialImage={imageUrl}
                            onImageChange={setImageUrl}
                            className="mb-4"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Nutritional Information */}
                    <div className="md:col-span-2">
                      <h4 className="text-md font-medium text-gray-800 mb-2">Nutritional Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                          <input
                            type="number"
                            min="0"
                            value={formData.nutritionalInfo?.calories || ''}
                            onChange={(e) => setFormData({
                              ...formData, 
                              nutritionalInfo: {
                                ...formData.nutritionalInfo || {
                                  calories: 0,
                                  protein: 0,
                                  carbs: 0,
                                  fat: 0,
                                  ingredients: [],
                                  allergens: []
                                },
                                calories: parseInt(e.target.value) || 0
                              }
                            })}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                          <input
                            type="number"
                            min="0"
                            value={formData.nutritionalInfo?.protein || ''}
                            onChange={(e) => setFormData({
                              ...formData, 
                              nutritionalInfo: {
                                ...formData.nutritionalInfo || {
                                  calories: 0,
                                  protein: 0,
                                  carbs: 0,
                                  fat: 0,
                                  ingredients: [],
                                  allergens: []
                                },
                                protein: parseInt(e.target.value) || 0
                              }
                            })}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                          <input
                            type="number"
                            min="0"
                            value={formData.nutritionalInfo?.carbs || ''}
                            onChange={(e) => setFormData({
                              ...formData, 
                              nutritionalInfo: {
                                ...formData.nutritionalInfo || {
                                  calories: 0,
                                  protein: 0,
                                  carbs: 0,
                                  fat: 0,
                                  ingredients: [],
                                  allergens: []
                                },
                                carbs: parseInt(e.target.value) || 0
                              }
                            })}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Fat (g)</label>
                          <input
                            type="number"
                            min="0"
                            value={formData.nutritionalInfo?.fat || ''}
                            onChange={(e) => setFormData({
                              ...formData, 
                              nutritionalInfo: {
                                ...formData.nutritionalInfo || {
                                  calories: 0,
                                  protein: 0,
                                  carbs: 0,
                                  fat: 0,
                                  ingredients: [],
                                  allergens: []
                                },
                                fat: parseInt(e.target.value) || 0
                              }
                            })}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients (comma separated)</label>
                          <input
                            type="text"
                            value={formData.nutritionalInfo?.ingredients?.join(', ') || ''}
                            onChange={(e) => setFormData({
                              ...formData, 
                              nutritionalInfo: {
                                ...formData.nutritionalInfo || {
                                  calories: 0,
                                  protein: 0,
                                  carbs: 0,
                                  fat: 0,
                                  ingredients: [],
                                  allergens: []
                                },
                                ingredients: e.target.value.split(',').map(i => i.trim()).filter(Boolean)
                              }
                            })}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Beef patty, Lettuce, Tomato, Onion, Special sauce"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Allergens (comma separated)</label>
                          <input
                            type="text"
                            value={formData.nutritionalInfo?.allergens?.join(', ') || ''}
                            onChange={(e) => setFormData({
                              ...formData, 
                              nutritionalInfo: {
                                ...formData.nutritionalInfo || {
                                  calories: 0,
                                  protein: 0,
                                  carbs: 0,
                                  fat: 0,
                                  ingredients: [],
                                  allergens: []
                                },
                                allergens: e.target.value.split(',').map(i => i.trim()).filter(Boolean)
                              }
                            })}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Gluten, Dairy, Egg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="primary"
                  onClick={handleFormSubmit}
                  className="w-full sm:w-auto sm:ml-3"
                >
                  {editingItem ? 'Update' : 'Add'}
                </Button>
                <Button
                  variant="light"
                  onClick={() => {
                    setIsFormModalOpen(false);
                    setEditingItem(null);
                    setFormData({});
                    setImageUrl('');
                    setError(null);
                  }}
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium text-gray-900">Delete Menu Item</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this item? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="danger"
                  onClick={handleDeleteMenuItem}
                  className="w-full sm:w-auto sm:ml-3"
                >
                  Delete
                </Button>
                <Button
                  variant="light"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredItems.length === 0 && !loading && (
        <Card className="bg-gray-50 border-gray-200">
          <div className="py-12 text-center">
            <div className="flex justify-center mb-4">
              <PlusIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No menu items found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {selectedCategory
                ? `No items found in the "${selectedCategory}" category.`
                : searchTerm 
                  ? `No items matching "${searchTerm}".`
                  : 'Get started by adding a new menu item.'}
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                leftIcon={<PlusIcon className="h-5 w-5" />}
                onClick={() => {
                  setEditingItem(null);
                  setIsFormModalOpen(true);
                }}
              >
                Add New Item
              </Button>
            </div>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default MenuItemsPage;