'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

// Define MenuItem type
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  calories?: number;
  ingredients?: any[];
  featured: boolean;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

const MenuItemsPage = () => {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<boolean | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch menu items from API
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch menu items from API
        const response = await fetch('/api/menuItems');
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to load menu items');
        }
        
        const items = data.data || [];
        setMenuItems(items);
        setFilteredItems(items);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(items.map((item: MenuItem) => item.category))) as string[];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError(err instanceof Error ? err.message : 'Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Apply filters when searchTerm, categoryFilter, or availabilityFilter changes
  useEffect(() => {
    let result = [...menuItems];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      result = result.filter(item => item.category === categoryFilter);
    }
    
    // Apply availability filter
    if (availabilityFilter !== null) {
      result = result.filter(item => item.available === availabilityFilter);
    }
    
    setFilteredItems(result);
  }, [menuItems, searchTerm, categoryFilter, availabilityFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter(null);
    setAvailabilityFilter(null);
  };

  const refreshMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch menu items from API
      const response = await fetch('/api/menuItems');
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to load menu items');
      }
      
      const items = data.data || [];
      setMenuItems(items);
      setFilteredItems(items);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(items.map((item: MenuItem) => item.category))) as string[];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error refreshing menu items:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    
    try {
      const response = await fetch(`/api/menuItems?id=${itemToDelete.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete menu item');
      }
      
      // Remove the item from the state
      setMenuItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
      
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      console.error('Error deleting menu item:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete menu item');
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} EGP`;
  };

  return (
    <DashboardLayout title="Menu Items">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your restaurant menu items
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Button
            variant="light"
            leftIcon={<ArrowPathIcon className="h-5 w-5" />}
            onClick={refreshMenuItems}
            isLoading={loading}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            leftIcon={<PlusIcon className="h-5 w-5" />}
            onClick={() => router.push('/dashboard/menuItems/add')}
          >
            Add New Item
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
                  placeholder="Search menu items..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={categoryFilter || ''}
                  onChange={(e) => setCategoryFilter(e.target.value || null)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <Button
                  variant={availabilityFilter === true ? 'primary' : 'light'}
                  onClick={() => setAvailabilityFilter(availabilityFilter === true ? null : true)}
                >
                  Available
                </Button>
                
                <Button
                  variant={availabilityFilter === false ? 'primary' : 'light'}
                  onClick={() => setAvailabilityFilter(availabilityFilter === false ? null : false)}
                >
                  Unavailable
                </Button>
                
                {(searchTerm || categoryFilter || availabilityFilter !== null) && (
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

      {/* Menu Items Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <Card className="bg-red-50 border-red-200">
          <div className="p-4 text-red-700">{error}</div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  {!item.available && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Unavailable
                    </div>
                  )}
                  {item.featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                    </div>
                    <div className="text-lg font-bold text-primary-600">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                  
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {item.description || 'No description available'}
                  </p>
                  
                  {item.calories && (
                    <p className="mt-2 text-sm text-gray-500">
                      {item.calories} calories
                    </p>
                  )}
                  
                  <div className="mt-4 flex justify-between">
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => router.push(`/dashboard/menuItems/${item.id}`)}
                    >
                      View Details
                    </Button>
                    <div className="flex space-x-2">
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => router.push(`/dashboard/menuItems/edit/${item.id}`)}
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
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-gray-500">No menu items found matching your filters.</p>
              {(searchTerm || categoryFilter || availabilityFilter !== null) && (
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
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative w-full max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
              </div>
              <div className="p-6">
                <p className="mb-4">Are you sure you want to delete "{itemToDelete.name}"?</p>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setItemToDelete(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={handleDeleteItem}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MenuItemsPage; 