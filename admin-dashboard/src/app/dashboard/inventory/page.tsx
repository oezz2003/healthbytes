'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import { 
  PlusIcon, PencilIcon, TrashIcon, ExclamationCircleIcon,
  EyeIcon, ArrowUpIcon, ArrowDownIcon, ShoppingCartIcon,
  ArchiveBoxIcon, ExclamationTriangleIcon, MagnifyingGlassIcon,
  ArrowPathIcon, XMarkIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { InventoryItem } from '@/types';

// Generate inventory items based on menu item ingredients
const generateInventoryItems = (): InventoryItem[] => {
  // Collect all unique ingredients from menu items
  const ingredients = [
    // Burger ingredients
    { name: 'Beef patty', category: 'Meat', unit: 'pcs' },
    { name: 'Buns', category: 'Bakery', unit: 'pcs' },
    { name: 'Lettuce', category: 'Produce', unit: 'kg' },
    { name: 'Tomato', category: 'Produce', unit: 'kg' },
    { name: 'Onion', category: 'Produce', unit: 'kg' },
    { name: 'Special sauce', category: 'Condiments', unit: 'liters' },
    { name: 'Sesame bun', category: 'Bakery', unit: 'pcs' },
    
    // Shawarma ingredients
    { name: 'Chicken', category: 'Meat', unit: 'kg' },
    { name: 'Garlic sauce', category: 'Condiments', unit: 'liters' },
    { name: 'Pickles', category: 'Produce', unit: 'kg' },
    { name: 'Flatbread', category: 'Bakery', unit: 'pcs' },
    
    // Pizza ingredients
    { name: 'Pizza dough', category: 'Bakery', unit: 'kg' },
    { name: 'Tomato sauce', category: 'Condiments', unit: 'liters' },
    { name: 'Mozzarella cheese', category: 'Dairy', unit: 'kg' },
    { name: 'Fresh basil', category: 'Produce', unit: 'kg' },
    { name: 'Olive oil', category: 'Condiments', unit: 'liters' },
    
    // Salad ingredients
    { name: 'Cucumber', category: 'Produce', unit: 'kg' },
    { name: 'Red onion', category: 'Produce', unit: 'kg' },
    { name: 'Feta cheese', category: 'Dairy', unit: 'kg' },
    { name: 'Kalamata olives', category: 'Produce', unit: 'kg' },
    
    // Falafel ingredients
    { name: 'Falafel', category: 'Prepared Foods', unit: 'kg' },
    { name: 'Tahini sauce', category: 'Condiments', unit: 'liters' },
    
    // Brownie ingredients
    { name: 'Chocolate', category: 'Baking', unit: 'kg' },
    { name: 'Flour', category: 'Baking', unit: 'kg' },
    { name: 'Sugar', category: 'Baking', unit: 'kg' },
    { name: 'Butter', category: 'Dairy', unit: 'kg' },
    { name: 'Eggs', category: 'Dairy', unit: 'pcs' },
    { name: 'Walnuts', category: 'Nuts', unit: 'kg' }
  ];
  
  // Generate random inventory data for each ingredient
  return ingredients.map((ingredient, index) => {
    const initialQuantity = Math.floor(Math.random() * 100) + 50; // 50-150
    const currentQuantity = Math.floor(Math.random() * initialQuantity); // 0-initialQuantity
    const usagePercentage = ((initialQuantity - currentQuantity) / initialQuantity) * 100;
    const reorderPoint = Math.floor(initialQuantity * 0.2); // 20% of initial quantity
    
    return {
      id: `inv-${index + 1}`,
      name: ingredient.name,
      description: `${ingredient.name} for menu items`,
      category: ingredient.category,
      quantity: currentQuantity,
      unit: ingredient.unit,
      costPerUnit: parseFloat((Math.random() * 10 + 1).toFixed(2)),
      supplier: ['Global Foods', 'Fresh Farms', 'Quality Ingredients', 'Local Suppliers'][Math.floor(Math.random() * 4)],
      threshold: reorderPoint,
      status: currentQuantity < reorderPoint ? 'low-stock' : 'in-stock',
      lastRestocked: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString()
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
  return `inv-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

// Inventory Form Component
const InventoryForm = ({
  item,
  onSubmit,
  onCancel
}: {
  item?: InventoryItem | null;
  onSubmit: (data: any) => Promise<boolean>;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(item?.name || '');
  const [description, setDescription] = useState(item?.description || '');
  const [quantity, setQuantity] = useState(item?.quantity.toString() || '0');
  const [unit, setUnit] = useState(item?.unit || '');
  const [threshold, setThreshold] = useState(item?.threshold?.toString() || '0');
  const [supplier, setSupplier] = useState(item?.supplier || '');
  const [location, setLocation] = useState(item?.location || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!name || !unit) {
        throw new Error('Name and unit are required');
      }

      if (isNaN(parseFloat(quantity))) {
        throw new Error('Quantity must be a number');
      }

      if (threshold && isNaN(parseFloat(threshold))) {
        throw new Error('Threshold must be a number');
      }

      const inventoryData = {
        name,
        description,
        quantity: parseFloat(quantity),
        unit,
        threshold: threshold ? parseFloat(threshold) : undefined,
        supplier,
        location
      };

      await onSubmit(inventoryData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{item ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-50 border-l-4 border-red-500 text-red-700">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Flour"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="kg"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="10"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Threshold</label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="5"
              min="0"
              step="0.01"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Supplier Name"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Storage Room A, Shelf 3"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Item description"
            rows={3}
          />
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button
            variant="light"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={loading}
          >
            {item ? 'Update Item' : 'Add Item'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const InventoryPage = () => {
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  // Fetch inventory from API
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch inventory from API
        const response = await fetch('/api/inventory');
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to load inventory');
        }
        
        setInventory(data.data || []);
        setFilteredItems(data.data || []);
      } catch (err) {
        console.error('Error fetching inventory:', err);
        setError(err instanceof Error ? err.message : 'Failed to load inventory');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Apply filters when searchTerm or statusFilter changes
  useEffect(() => {
    let result = [...inventory];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(term) || 
        (item.description && item.description.toLowerCase().includes(term)) ||
        (item.supplier && item.supplier.toLowerCase().includes(term)) ||
        (item.location && item.location.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(item => item.status === statusFilter);
    }
    
    setFilteredItems(result);
  }, [inventory, searchTerm, statusFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter(null);
  };

  const refreshInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch inventory from API
      const response = await fetch('/api/inventory');
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to load inventory');
      }
      
      setInventory(data.data || []);
      setFilteredItems(data.data || []);
    } catch (err) {
      console.error('Error refreshing inventory:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh inventory');
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new inventory item
  const handleAddItem = async (itemData: any) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to add inventory item');
      }
      
      // Add the new item to the state
      setInventory(prevItems => [...prevItems, data.data]);
      
      setIsFormModalOpen(false);
      return true;
    } catch (err) {
      console.error('Error adding inventory item:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to add inventory item.');
    }
  };

  // Handle updating an inventory item
  const handleUpdateItem = async (itemData: any) => {
    try {
      if (!editingItem) return false;
      
      // Include the ID in the request body instead of as a URL parameter
      const requestData = {
        id: editingItem.id,
        ...itemData
      };
      
      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update inventory item');
      }
      
      // Update the item in the state
      setInventory(prevItems => 
        prevItems.map(item => 
          item.id === editingItem.id 
            ? { ...item, ...itemData, id: editingItem.id } 
            : item
        )
      );
      
      setIsFormModalOpen(false);
      setEditingItem(null);
      return true;
    } catch (err) {
      console.error('Error updating inventory item:', err);
      throw new Error('Failed to update inventory item.');
    }
  };

  // Handle form submission (add or update)
  const handleFormSubmit = async (itemData: any) => {
    if (editingItem) {
      return handleUpdateItem(itemData);
    } else {
      return handleAddItem(itemData);
    }
  };

  // Handle deleting an inventory item
  const handleDeleteItem = async () => {
    try {
      if (!itemToDelete) return false;
      
      const response = await fetch(`/api/inventory?id=${itemToDelete.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete inventory item');
      }
      
      // Remove the item from the state
      setInventory(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
      
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      return true;
    } catch (err) {
      console.error('Error deleting inventory item:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete inventory item');
      return false;
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout title="Inventory">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage your inventory items
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Button
            variant="light"
            leftIcon={<ArrowPathIcon className="h-5 w-5" />}
            onClick={refreshInventory}
            isLoading={loading}
          >
            Refresh
          </Button>
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

      {/* Search and Filters */}
      <div className="mb-6">
        <Card>
          <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search inventory items..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={statusFilter === 'In Stock' ? 'primary' : 'light'}
                  onClick={() => setStatusFilter(statusFilter === 'In Stock' ? null : 'In Stock')}
                >
                  In Stock
                </Button>
                
                <Button
                  variant={statusFilter === 'Low Stock' ? 'primary' : 'light'}
                  onClick={() => setStatusFilter(statusFilter === 'Low Stock' ? null : 'Low Stock')}
                >
                  Low Stock
                </Button>
                
                <Button
                  variant={statusFilter === 'Out of Stock' ? 'primary' : 'light'}
                  onClick={() => setStatusFilter(statusFilter === 'Out of Stock' ? null : 'Out of Stock')}
                >
                  Out of Stock
                </Button>
                
                {(searchTerm || statusFilter) && (
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

      {/* Inventory Table */}
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
          {filteredItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.quantity} {item.unit}
                        </div>
                        {item.threshold && (
                          <div className="text-xs text-gray-500">
                            Threshold: {item.threshold} {item.unit}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.supplier || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.location || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="light"
                            size="sm"
                            onClick={() => {
                              setEditingItem(item);
                              setIsFormModalOpen(true);
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
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">No inventory items found matching your filters.</p>
              {(searchTerm || statusFilter) && (
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

      {/* Inventory Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
                </h3>
              </div>
              <div className="p-6">
                <InventoryForm
                  item={editingItem}
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setIsFormModalOpen(false);
                    setEditingItem(null);
                  }}
                />
              </div>
            </div>
          </div>
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

export default InventoryPage; 