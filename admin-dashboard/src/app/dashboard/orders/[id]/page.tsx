'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Button, Spinner, Badge } from '@/components/ui';
import { 
  ArrowLeftIcon, 
  PrinterIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  TruckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/utils';

// Safe date formatting function
const safeFormatDate = (dateInput: any): string => {
  if (!dateInput) return 'Not available';
  
  try {
    // Handle Firestore Timestamp objects
    if (dateInput && typeof dateInput === 'object' && dateInput.toDate && typeof dateInput.toDate === 'function') {
      const date = dateInput.toDate();
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    
    // Handle string dates
    if (typeof dateInput === 'string') {
      // Try to create a date object from the string
      try {
        const date = new Date(dateInput);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        }
      } catch (e) {
        console.error('Error converting date from string:', e);
      }
      // If conversion fails, return the string as is
      return dateInput;
    }
    
    // Handle Date objects
    if (dateInput instanceof Date) {
      if (!isNaN(dateInput.getTime())) {
        return dateInput.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    }
    
    // Handle numbers (timestamps)
    if (typeof dateInput === 'number') {
      try {
        const date = new Date(dateInput);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch (e) {
        console.error('Error converting date from number:', e);
      }
    }
    
    // If we get here, the data type is unknown or invalid
    console.log('Unknown date type:', typeof dateInput, dateInput);
    return 'Invalid date';
  } catch (error) {
    console.error('Error formatting date:', error, 'Value:', dateInput);
    return 'Invalid date';
  }
};

// Format currency with EGP
const formatEGP = (amount: number): string => {
  if (isNaN(amount)) return '0.00 EGP';
  
  try {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + ' EGP';
  } catch (error) {
    console.error('Error formatting currency:', error);
    return amount.toFixed(2) + ' EGP';
  }
};

// Order status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let color = '';
  let text = '';

  switch (status) {
    case 'pending':
      color = 'bg-yellow-100 text-yellow-800';
      text = 'Pending';
      break;
    case 'confirmed':
      color = 'bg-blue-100 text-blue-800';
      text = 'Confirmed';
      break;
    case 'preparing':
      color = 'bg-indigo-100 text-indigo-800';
      text = 'Preparing';
      break;
    case 'ready':
      color = 'bg-purple-100 text-purple-800';
      text = 'Ready for Pickup';
      break;
    case 'out_for_delivery':
      color = 'bg-cyan-100 text-cyan-800';
      text = 'Out for Delivery';
      break;
    case 'delivered':
      color = 'bg-green-100 text-green-800';
      text = 'Delivered';
      break;
    case 'cancelled':
      color = 'bg-red-100 text-red-800';
      text = 'Cancelled';
      break;
    default:
      color = 'bg-gray-100 text-gray-800';
      text = status;
  }

  return (
    <Badge className={`${color} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
      {text}
    </Badge>
  );
};

// Payment status badge component
const PaymentStatusBadge = ({ status }: { status: string }) => {
  let color = '';
  let text = '';

  switch (status) {
    case 'paid':
      color = 'bg-green-100 text-green-800';
      text = 'Paid';
      break;
    case 'pending':
      color = 'bg-yellow-100 text-yellow-800';
      text = 'Pending';
      break;
    case 'failed':
      color = 'bg-red-100 text-red-800';
      text = 'Failed';
      break;
    case 'refunded':
      color = 'bg-purple-100 text-purple-800';
      text = 'Refunded';
      break;
    default:
      color = 'bg-gray-100 text-gray-800';
      text = status;
  }

  return (
    <Badge className={`${color} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
      {text}
    </Badge>
  );
};

const OrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<{
    loading: boolean;
    error: string | null;
  }>({ loading: false, error: null });
  
  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch order details');
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch order details');
        }
        
        setOrder(data.data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);
  
  // Update order status
  const updateOrderStatus = async (newStatus: Order['status']) => {
    try {
      setUpdateStatus({ loading: true, error: null });
      
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update order status');
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to update order status');
      }
      
      // Update order data locally with server response
      if (data.data) {
        setOrder(data.data);
      } else {
        // Or update just the status if full data is not received
        setOrder((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            status: newStatus,
            updatedAt: new Date().toISOString()
          };
        });
      }
      
    } catch (err) {
      console.error('Error updating order status:', err);
      setUpdateStatus({
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred',
      });
    } finally {
      setUpdateStatus(prev => ({ ...prev, loading: false }));
    }
  };
  
  // Print order
  const handlePrint = () => {
    window.print();
  };

  // Go back to previous page
  const handleBack = () => {
    router.back();
  };
  
  // Show loading state
  if (loading) {
    return (
      <DashboardLayout title="Order Details">
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }
  
  // Show error message
  if (error || !order) {
    return (
      <DashboardLayout title="Order Details">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error || 'Order not found'}</span>
        </div>
        <Button
          variant="light"
          className="mt-4"
          onClick={handleBack}
          leftIcon={<ArrowLeftIcon className="h-5 w-5" />}
        >
          Go Back
        </Button>
      </DashboardLayout>
    );
  }
  
  // Display order details
  return (
    <DashboardLayout title={`Order #${order.orderNumber || order.id.substring(0, 8)}`}>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="light"
            onClick={handleBack}
            leftIcon={<ArrowLeftIcon className="h-5 w-5" />}
            className="mr-2"
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Order Details #{order.orderNumber || order.id.substring(0, 8)}
          </h1>
        </div>
        <Button
          variant="light"
          onClick={handlePrint}
          leftIcon={<PrinterIcon className="h-5 w-5" />}
        >
          Print
        </Button>
      </div>
      
      {/* Order Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1 font-light">Order Number</p>
                <p className="font-medium text-gray-900">#{order.orderNumber || order.id.substring(0, 8)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1 font-light">Order Date</p>
                <p className="font-medium text-gray-900">{safeFormatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1 font-light">Order Status</p>
                <StatusBadge status={order.status} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1 font-light">Payment Method</p>
                <p className="font-medium text-gray-900">{order.paymentMethod || 'Cash'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1 font-light">Payment Status</p>
                <PaymentStatusBadge status={order.paymentStatus || 'pending'} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1 font-light">Total Amount</p>
                <p className="font-medium text-green-600">{formatEGP(order.totalAmount || 0)}</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400 mb-1 font-light">Name</p>
                <p className="font-medium text-gray-900">{order.userName || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1 font-light">Customer ID</p>
                <p className="font-medium text-gray-900">{order.customerId || order.userId || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1 font-light">Address</p>
                <p className="font-medium text-gray-900">
                  {order.address || (order.deliveryAddress ? 
                    `${order.deliveryAddress.streetAddress}, ${order.deliveryAddress.city}` : 
                    'Not available')}
                </p>
              </div>
              <div>
                <Button
                  variant="light"
                  className="w-full mt-2"
                  onClick={() => router.push(`/dashboard/users/${order.customerId || order.userId}`)}
                >
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Order Items */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
          {order.items && order.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        {item.options && (
                          <div className="text-xs text-gray-500 mt-1">
                            {Object.entries(item.options).map(([key, value]) => (
                              <span key={key} className="mr-2">{key}: {value}</span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatEGP(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatEGP(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                      Subtotal
                    </td>
                    <td className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                      {formatEGP(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                    </td>
                  </tr>
                  {order.tax !== undefined && (
                    <tr>
                      <td colSpan={3} className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                        Tax
                      </td>
                      <td className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                        {formatEGP(order.tax)}
                      </td>
                    </tr>
                  )}
                  {order.deliveryFee !== undefined && (
                    <tr>
                      <td colSpan={3} className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                        Delivery Fee
                      </td>
                      <td className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                        {formatEGP(order.deliveryFee)}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={3} className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                      Total
                    </td>
                    <td className="px-6 py-3 text-left text-sm font-bold text-green-600">
                      {formatEGP(order.totalAmount || 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No items found in this order.</p>
            </div>
          )}
        </div>
      </Card>
      
      {/* Update Order Status */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Update Order Status</h2>
          
          {updateStatus.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{updateStatus.error}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <Button
              variant="light"
              disabled={order.status === 'confirmed' || updateStatus.loading}
              onClick={() => updateOrderStatus('confirmed')}
              leftIcon={<CheckCircleIcon className="h-5 w-5" />}
              isLoading={updateStatus.loading && order.status !== 'confirmed'}
            >
              Confirm Order
            </Button>
            
            <Button
              variant="light"
              disabled={order.status === 'preparing' || updateStatus.loading}
              onClick={() => updateOrderStatus('preparing')}
              leftIcon={<ClockIcon className="h-5 w-5" />}
              isLoading={updateStatus.loading && order.status !== 'preparing'}
            >
              Preparing
            </Button>
            
            <Button
              variant="light"
              disabled={order.status === 'ready' || updateStatus.loading}
              onClick={() => updateOrderStatus('ready')}
              leftIcon={<CheckCircleIcon className="h-5 w-5" />}
              isLoading={updateStatus.loading && order.status !== 'ready'}
            >
              Ready for Pickup
            </Button>
            
            <Button
              variant="light"
              disabled={order.status === 'out_for_delivery' || updateStatus.loading}
              onClick={() => updateOrderStatus('out_for_delivery')}
              leftIcon={<TruckIcon className="h-5 w-5" />}
              isLoading={updateStatus.loading && order.status !== 'out_for_delivery'}
            >
              Out for Delivery
            </Button>
            
            <Button
              variant="success"
              disabled={order.status === 'delivered' || updateStatus.loading}
              onClick={() => updateOrderStatus('delivered')}
              leftIcon={<CheckCircleIcon className="h-5 w-5" />}
              isLoading={updateStatus.loading && order.status !== 'delivered'}
            >
              Delivered
            </Button>
            
            <Button
              variant="danger"
              disabled={order.status === 'cancelled' || updateStatus.loading}
              onClick={() => updateOrderStatus('cancelled')}
              leftIcon={<XCircleIcon className="h-5 w-5" />}
              isLoading={updateStatus.loading && order.status !== 'cancelled'}
            >
              Cancel Order
            </Button>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default OrderDetailPage;