import { useState, useEffect } from 'react';
import { Order, OrderStatus, PaymentStatus } from '@/types';

interface UseOrdersProps {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  customerId?: string;
  pageSize?: number;
}

interface OrdersResult {
  orders: Order[];
  loading: boolean;
  error: Error | null;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  refresh: () => void;
}

// بيانات وهمية للطلبات
const mockOrders: Order[] = [
  {
    id: 'order-1',
    orderNumber: 10001,
    customerId: 'user-1',
    userName: 'أحمد محمد',
    items: [
      { menuItemId: 'item-1', name: 'برجر لحم', price: 45.99, quantity: 2 },
      { menuItemId: 'item-5', name: 'مشروب الليمون المنعش', price: 15.99, quantity: 2 }
    ],
    status: 'delivered',
    total: 123.96,
    totalAmount: 123.96,
    tax: 15.99,
    deliveryFee: 10,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    address: 'الرياض، حي النزهة، شارع الأمير سعود',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'order-2',
    orderNumber: 10002,
    customerId: 'user-2',
    userName: 'سارة أحمد',
    items: [
      { menuItemId: 'item-2', name: 'بيتزا مارجريتا', price: 59.99, quantity: 1 },
      { menuItemId: 'item-3', name: 'سلطة سيزر', price: 35.99, quantity: 1 }
    ],
    status: 'delivered',
    total: 105.98,
    totalAmount: 105.98,
    tax: 13.77,
    deliveryFee: 10,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    address: 'جدة، حي الروضة، شارع الأندلس',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'order-3',
    orderNumber: 10003,
    customerId: 'user-6',
    userName: 'نورة سلطان',
    items: [
      { menuItemId: 'item-4', name: 'باستا كاربونارا', price: 49.99, quantity: 2 }
    ],
    status: 'preparing',
    total: 109.98,
    totalAmount: 109.98,
    tax: 14.30,
    deliveryFee: 10,
    paymentMethod: 'online',
    paymentStatus: 'pending',
    address: 'المدينة، حي القبلتين، شارع أبي ذر',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'order-4',
    orderNumber: 10004,
    customerId: 'user-1',
    userName: 'أحمد محمد',
    items: [
      { menuItemId: 'item-1', name: 'برجر لحم', price: 45.99, quantity: 1 },
      { menuItemId: 'item-3', name: 'سلطة سيزر', price: 35.99, quantity: 1 },
      { menuItemId: 'item-5', name: 'مشروب الليمون المنعش', price: 15.99, quantity: 2 }
    ],
    status: 'pending',
    total: 113.96,
    totalAmount: 113.96,
    tax: 14.82,
    deliveryFee: 10,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    address: 'الرياض، حي النزهة، شارع الأمير سعود',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 'order-5',
    orderNumber: 10005,
    customerId: 'user-2',
    userName: 'سارة أحمد',
    items: [
      { menuItemId: 'item-2', name: 'بيتزا مارجريتا', price: 59.99, quantity: 2 }
    ],
    status: 'cancelled',
    total: 129.98,
    totalAmount: 129.98,
    tax: 16.90,
    deliveryFee: 10,
    paymentMethod: 'card',
    paymentStatus: 'refunded',
    address: 'جدة، حي الروضة، شارع الأندلس',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const useOrders = ({
  status,
  paymentStatus,
  customerId,
  pageSize = 10,
}: UseOrdersProps = {}): OrdersResult => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  // محاكاة جلب البيانات مع تأخير
  const fetchOrders = async (isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // تطبيق المرشحات
      let filteredOrders = [...mockOrders];

      if (status) {
        filteredOrders = filteredOrders.filter(order => order.status === status);
      }
      
      if (paymentStatus) {
        filteredOrders = filteredOrders.filter(order => order.paymentStatus === paymentStatus);
      }
      
      if (customerId) {
        filteredOrders = filteredOrders.filter(order => order.customerId === customerId);
      }
      
      // ترتيب الطلبات من الأحدث إلى الأقدم
      filteredOrders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      // محاكاة الصفحات
      const startIndex = 0;
      const endIndex = isLoadMore ? page * pageSize : pageSize;
      const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
      
      // التحقق مما إذا كان هناك المزيد من الطلبات
      setHasMore(endIndex < filteredOrders.length);
      
      // تحديث الحالة
      if (isLoadMore) {
        setOrders(paginatedOrders);
        setPage(prevPage => prevPage + 1);
      } else {
        setOrders(paginatedOrders);
        setPage(1);
      }
      
      console.log(`🛒 تم تحميل ${paginatedOrders.length} طلب${status ? ` بحالة ${status}` : ''}`);
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('حدث خطأ غير معروف'));
      console.error('خطأ في جلب الطلبات:', err);
    } finally {
      setLoading(false);
    }
  };

  // تحميل البيانات الأولية
  useEffect(() => {
    fetchOrders();
  }, [status, paymentStatus, customerId, pageSize]);

  // دالة لتحميل المزيد من الطلبات
  const loadMore = async () => {
    if (!loading && hasMore) {
      await fetchOrders(true);
    }
  };

  // دالة لتحديث البيانات
  const refresh = () => {
    setPage(1);
    setHasMore(true);
    fetchOrders();
  };

  return { orders, loading, error, loadMore, hasMore, refresh };
};

export default useOrders; 