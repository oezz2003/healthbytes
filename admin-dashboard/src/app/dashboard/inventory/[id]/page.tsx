'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  ArrowLeftIcon,
  PencilIcon,
  ArchiveBoxIcon,
  TruckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { InventoryItem, InventoryTransaction } from '@/types';

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
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

// Generate mock inventory item data
const generateInventoryItemDetails = (id: string): InventoryItem => {
  // Find the item from the list of ingredients
  const ingredients = [
    { name: 'Beef patty', category: 'Meat', unit: 'pcs' },
    { name: 'Buns', category: 'Bakery', unit: 'pcs' },
    { name: 'Lettuce', category: 'Produce', unit: 'kg' },
    { name: 'Tomato', category: 'Produce', unit: 'kg' },
    { name: 'Onion', category: 'Produce', unit: 'kg' },
    { name: 'Special sauce', category: 'Condiments', unit: 'liters' },
    { name: 'Sesame bun', category: 'Bakery', unit: 'pcs' },
    { name: 'Chicken', category: 'Meat', unit: 'kg' },
    { name: 'Garlic sauce', category: 'Condiments', unit: 'liters' },
    { name: 'Pickles', category: 'Produce', unit: 'kg' },
    { name: 'Flatbread', category: 'Bakery', unit: 'pcs' },
    { name: 'Pizza dough', category: 'Bakery', unit: 'kg' },
    { name: 'Tomato sauce', category: 'Condiments', unit: 'liters' },
    { name: 'Mozzarella cheese', category: 'Dairy', unit: 'kg' },
    { name: 'Fresh basil', category: 'Produce', unit: 'kg' },
    { name: 'Olive oil', category: 'Condiments', unit: 'liters' },
    { name: 'Cucumber', category: 'Produce', unit: 'kg' },
    { name: 'Red onion', category: 'Produce', unit: 'kg' },
    { name: 'Feta cheese', category: 'Dairy', unit: 'kg' },
    { name: 'Kalamata olives', category: 'Produce', unit: 'kg' },
    { name: 'Falafel', category: 'Prepared Foods', unit: 'kg' },
    { name: 'Tahini sauce', category: 'Condiments', unit: 'liters' },
    { name: 'Chocolate', category: 'Baking', unit: 'kg' },
    { name: 'Flour', category: 'Baking', unit: 'kg' },
    { name: 'Sugar', category: 'Baking', unit: 'kg' },
    { name: 'Butter', category: 'Dairy', unit: 'kg' },
    { name: 'Eggs', category: 'Dairy', unit: 'pcs' },
    { name: 'Walnuts', category: 'Nuts', unit: 'kg' }
  ];

  const index = parseInt(id.replace('inv-', '')) - 1;
  const ingredient = ingredients[index % ingredients.length];
  
  const initialQuantity = Math.floor(Math.random() * 100) + 50; // 50-150
  const currentQuantity = Math.floor(Math.random() * initialQuantity); // 0-initialQuantity
  const reorderPoint = Math.floor(initialQuantity * 0.2); // 20% of initial quantity
  
  return {
    id,
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
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString(),
    location: ['Main Storage', 'Kitchen', 'Cold Storage', 'Dry Storage'][Math.floor(Math.random() * 4)],
    sku: `SKU-${id}-${Math.floor(Math.random() * 1000)}`,
    barcode: `BAR-${Math.floor(Math.random() * 1000000000)}`,
    expiryDate: new Date(Date.now() + Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
    reorderQuantity: Math.floor(initialQuantity * 0.5)
  };
};

// Generate mock transaction history
const generateTransactionHistory = (itemId: string): InventoryTransaction[] => {
  const transactions: InventoryTransaction[] = [];
  const numTransactions = Math.floor(Math.random() * 10) + 5; // 5-15 transactions
  
  let currentQuantity = Math.floor(Math.random() * 100) + 50; // Start with 50-150
  
  for (let i = 0; i < numTransactions; i++) {
    const isIncoming = Math.random() > 0.6; // 40% chance of being an incoming transaction
    const quantity = Math.floor(Math.random() * 20) + 1; // 1-20 units
    const previousQuantity = currentQuantity;
    
    if (isIncoming) {
      currentQuantity += quantity;
    } else {
      currentQuantity = Math.max(0, currentQuantity - quantity);
    }
    
    const daysAgo = (numTransactions - i) * 3; // Spread transactions over time
    
    transactions.push({
      id: `trans-${itemId}-${i}`,
      inventoryItemId: itemId,
      type: isIncoming ? 'in' : 'out',
      quantity,
      reason: isIncoming 
        ? ['Restocking', 'Order arrived', 'Inventory adjustment', 'Return from kitchen'][Math.floor(Math.random() * 4)]
        : ['Used in production', 'Damaged', 'Expired', 'Transferred to kitchen'][Math.floor(Math.random() * 4)],
      previousQuantity,
      newQuantity: currentQuantity,
      cost: isIncoming ? quantity * (Math.random() * 10 + 1) : undefined,
      orderId: isIncoming ? `PO-${Math.floor(Math.random() * 10000)}` : undefined,
      performedBy: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'][Math.floor(Math.random() * 4)],
      timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  
  return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate usage data for chart
const generateUsageData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  return months.slice(currentMonth - 5, currentMonth + 1).map((month, index) => ({
    month,
    usage: Math.floor(Math.random() * 50) + 10
  }));
};

// Generate related items
const generateRelatedItems = (currentItemId: string): InventoryItem[] => {
  const relatedItems: InventoryItem[] = [];
  
  for (let i = 1; i <= 4; i++) {
    const id = `inv-${Math.floor(Math.random() * 28) + 1}`;
    if (id !== currentItemId) {
      relatedItems.push(generateInventoryItemDetails(id));
    }
  }
  
  return relatedItems;
};

const InventoryItemDetails = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [usageData, setUsageData] = useState<{ month: string; usage: number }[]>([]);
  const [relatedItems, setRelatedItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const loadItemDetails = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const itemDetails = generateInventoryItemDetails(id);
        const itemTransactions = generateTransactionHistory(id);
        const itemUsageData = generateUsageData();
        const itemRelatedItems = generateRelatedItems(id);
        
        setItem(itemDetails);
        setTransactions(itemTransactions);
        setUsageData(itemUsageData);
        setRelatedItems(itemRelatedItems);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load inventory item details'));
      } finally {
        setLoading(false);
      }
    };
    
    loadItemDetails();
  }, [id]);
  
  if (loading) {
    return (
      <DashboardLayout title="Inventory Item Details">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (error || !item) {
    return (
      <DashboardLayout title="Inventory Item Details">
        <Card className="bg-red-50 border-red-200">
          <p className="text-red-600">{error?.message || 'Item not found'}</p>
          <Button
            variant="primary"
            leftIcon={<ArrowLeftIcon className="h-5 w-5" />}
            className="mt-4"
            onClick={() => router.push('/dashboard/inventory')}
          >
            Back to Inventory
          </Button>
        </Card>
      </DashboardLayout>
    );
  }
  
  const totalValue = item.quantity * (item.costPerUnit || 0);
  const usagePercentage = item.threshold ? Math.round((item.quantity / item.threshold) * 100) : 0;
  
  return (
    <DashboardLayout title="Inventory Item Details">
      {/* Header with back button and actions */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center">
          <Button
            variant="light"
            leftIcon={<ArrowLeftIcon className="h-5 w-5" />}
            onClick={() => router.push('/dashboard/inventory')}
          >
            Back to Inventory
          </Button>
          <h1 className="ml-4 text-2xl font-bold text-gray-900">{item.name}</h1>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button
            variant="primary"
            leftIcon={<PlusIcon className="h-5 w-5" />}
            onClick={() => {
              // Would open a modal to add stock in a real app
              alert('Add stock functionality would open here');
            }}
          >
            Add Stock
          </Button>
          <Button
            variant="light"
            leftIcon={<PencilIcon className="h-5 w-5" />}
            onClick={() => router.push(`/dashboard/inventory/${id}/edit`)}
          >
            Edit
          </Button>
        </div>
      </div>
      
      {/* Item overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main item details */}
        <div className="lg:col-span-2">
          <Card className="bg-white">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 mb-4 md:mb-0">
                <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center h-full">
                  <ArchiveBoxIcon className="h-24 w-24 text-gray-400" />
                </div>
              </div>
              <div className="w-full md:w-2/3 md:pl-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h2>
                <p className="text-gray-600 mb-4">{item.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{item.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">SKU</p>
                    <p className="font-medium">{item.sku || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{item.location || 'Main Storage'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Supplier</p>
                    <p className="font-medium">{item.supplier || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Current Stock Level</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'in-stock' 
                        ? 'bg-green-100 text-green-800' 
                        : item.status === 'low-stock'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status === 'in-stock' 
                        ? 'In Stock' 
                        : item.status === 'low-stock'
                        ? 'Low Stock'
                        : 'Out of Stock'}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        item.status === 'in-stock' 
                          ? 'bg-green-600' 
                          : item.status === 'low-stock'
                          ? 'bg-yellow-500'
                          : 'bg-red-600'
                      }`}
                      style={{ width: `${Math.min(100, usagePercentage)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Stats cards */}
        <div className="space-y-4">
          <Card className="bg-white">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <ArchiveBoxIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Current Quantity</p>
                <p className="text-xl font-bold">
                  {item.quantity} <span className="text-sm font-normal text-gray-500">{item.unit}</span>
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-white">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Value</p>
                <p className="text-xl font-bold">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-white">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Reorder Point</p>
                <p className="text-xl font-bold">
                  {item.threshold} <span className="text-sm font-normal text-gray-500">{item.unit}</span>
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-white">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <ClockIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Last Restocked</p>
                <p className="text-lg font-bold">{formatDate(item.lastRestocked || item.updatedAt)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Detailed information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Usage chart */}
        <div className="lg:col-span-2">
          <Card 
            className="bg-white"
            title="Usage History"
            subtitle="Monthly usage over the past 6 months"
          >
            <div className="h-64">
              <div className="flex h-full items-end">
                {usageData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full max-w-[40px] bg-primary-500 rounded-t"
                      style={{ height: `${(data.usage / 50) * 100}%` }}
                    ></div>
                    <div className="text-xs mt-2 text-gray-600">{data.month}</div>
                    <div className="text-xs font-medium">{data.usage} {item.unit}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
        
        {/* Additional details */}
        <div>
          <Card 
            className="bg-white"
            title="Additional Information"
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Unit Cost</p>
                <p className="font-medium">{formatCurrency(item.costPerUnit || 0)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Barcode</p>
                <p className="font-medium">{item.barcode || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Expiry Date</p>
                <p className="font-medium">{item.expiryDate ? formatDate(item.expiryDate) : 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Reorder Quantity</p>
                <p className="font-medium">{item.reorderQuantity || 'N/A'} {item.reorderQuantity ? item.unit : ''}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-medium">{formatDate(item.createdAt)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">{formatDate(item.updatedAt)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Transaction history */}
      <Card 
        className="bg-white mb-6"
        title="Transaction History"
        subtitle="Recent inventory movements for this item"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance After
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performed By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(transaction.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.type === 'in' 
                        ? 'bg-green-100 text-green-800' 
                        : transaction.type === 'out'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {transaction.type === 'in' 
                        ? 'Stock In' 
                        : transaction.type === 'out'
                        ? 'Stock Out'
                        : 'Adjustment'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      {transaction.type === 'in' ? (
                        <PlusIcon className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <MinusIcon className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      {transaction.quantity} {item.unit}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.reason}
                    {transaction.orderId && (
                      <span className="ml-1 text-xs text-gray-500">
                        ({transaction.orderId})
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.newQuantity} {item.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.performedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Related items */}
      <Card 
        className="bg-white"
        title="Related Items"
        subtitle="Other inventory items you might want to check"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedItems.map((relatedItem) => (
            <div 
              key={relatedItem.id} 
              className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md cursor-pointer transition-all"
              onClick={() => router.push(`/dashboard/inventory/${relatedItem.id}`)}
            >
              <div className="flex items-center mb-2">
                <div className="p-2 rounded-full bg-gray-100">
                  <ArchiveBoxIcon className="h-5 w-5 text-gray-500" />
                </div>
                <h3 className="ml-2 font-medium text-gray-900 truncate">{relatedItem.name}</h3>
              </div>
              <div className="text-sm text-gray-600 mb-2 truncate">{relatedItem.category}</div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {relatedItem.quantity} {relatedItem.unit}
                </span>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  relatedItem.status === 'in-stock' 
                    ? 'bg-green-100 text-green-800' 
                    : relatedItem.status === 'low-stock'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {relatedItem.status === 'in-stock' 
                    ? 'In Stock' 
                    : relatedItem.status === 'low-stock'
                    ? 'Low Stock'
                    : 'Out of Stock'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default InventoryItemDetails;
