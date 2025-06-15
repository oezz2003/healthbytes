'use client';

import { useState, useEffect } from 'react';
import { getCollection } from '../../../lib/firebase/helpers';

/**
 * صفحة مثال لتأكيد الطلبات وتحديث المخزون
 */
export default function OrderConfirmationExample() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [processingOrder, setProcessingOrder] = useState(null);

  // الحصول على الطلبات عند تحميل الصفحة
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');
        
        // الحصول على الطلبات من Firestore
        const ordersData = await getCollection('orders');
        setOrders(ordersData);
      } catch (err) {
        console.error('خطأ في الحصول على الطلبات:', err);
        setError('حدث خطأ أثناء تحميل الطلبات');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /**
   * تأكيد الطلب وتحديث المخزون
   */
  const confirmOrder = async (orderId) => {
    try {
      setProcessingOrder(orderId);
      setSuccessMessage('');
      setError('');

      const response = await fetch('/api/orders/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل في تأكيد الطلب');
      }

      // تحديث قائمة الطلبات بعد التأكيد
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.id === orderId) {
            return {
              ...order,
              status: 'confirmed',
              inventoryUpdated: true,
            };
          }
          return order;
        })
      );

      setSuccessMessage(data.message);
    } catch (err) {
      console.error('خطأ في تأكيد الطلب:', err);
      setError(err.message || 'حدث خطأ أثناء تأكيد الطلب');
    } finally {
      setProcessingOrder(null);
    }
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">مثال على تأكيد الطلبات وتحديث المخزون</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {orders.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-gray-500">لا توجد طلبات متاحة</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  رقم الطلب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المبلغ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تحديث المخزون
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.total} ج.م
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'confirmed' || order.status === 'مؤكد'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status === 'confirmed' || order.status === 'مؤكد' ? 'مؤكد' : 'معلق'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.inventoryUpdated
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.inventoryUpdated ? 'تم التحديث' : 'لم يتم التحديث'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {order.status === 'pending' || order.status === 'معلق' ? (
                      <button
                        onClick={() => confirmOrder(order.id)}
                        disabled={processingOrder === order.id}
                        className={`bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm transition-colors ${
                          processingOrder === order.id ? 'opacity-50 cursor-wait' : ''
                        }`}
                      >
                        {processingOrder === order.id ? 'جاري التأكيد...' : 'تأكيد الطلب'}
                      </button>
                    ) : (
                      <span className="text-gray-500 text-sm">تم التأكيد</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 