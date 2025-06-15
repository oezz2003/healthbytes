import { NextRequest, NextResponse } from 'next/server';

// تعريف أنواع البيانات
interface OrderData {
  id: string;
  orderNumber: number;
  status: string;
  total: number;
  items: number;
  userName: string;
  createdAt: string;
  paymentMethod: string;
  paymentStatus: string;
}

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string | null;
}

interface InventoryItemData {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  status: string;
  reorderPoint?: number;
  costPerUnit?: number;
  totalCost: number;
}

// بيانات وهمية للطلبات
const mockOrders: OrderData[] = [
  {
    id: 'order-1',
    orderNumber: 10001,
    status: 'completed',
    total: 123.96,
    items: 2,
    userName: 'أحمد محمد',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'cash',
    paymentStatus: 'paid'
  },
  {
    id: 'order-2',
    orderNumber: 10002,
    status: 'delivered',
    total: 105.98,
    items: 2,
    userName: 'سارة أحمد',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'card',
    paymentStatus: 'paid'
  },
  {
    id: 'order-3',
    orderNumber: 10003,
    status: 'processing',
    total: 109.98,
    items: 1,
    userName: 'نورة سلطان',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'online',
    paymentStatus: 'pending'
  },
  {
    id: 'order-4',
    orderNumber: 10004,
    status: 'pending',
    total: 113.96,
    items: 3,
    userName: 'أحمد محمد',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    paymentMethod: 'cash',
    paymentStatus: 'pending'
  },
  {
    id: 'order-5',
    orderNumber: 10005,
    status: 'cancelled',
    total: 129.98,
    items: 1,
    userName: 'سارة أحمد',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'card',
    paymentStatus: 'refunded'
  }
];

// بيانات وهمية للعملاء
const mockCustomers: CustomerData[] = [
  {
    id: 'user-1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '0501234567',
    address: 'الرياض، حي النزهة، شارع الأمير سعود',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    orderCount: 5,
    totalSpent: 562.50,
    lastOrderDate: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'user-2',
    name: 'سارة أحمد',
    email: 'sara@example.com',
    phone: '0551234567',
    address: 'جدة، حي الروضة، شارع الأندلس',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    orderCount: 3,
    totalSpent: 342.80,
    lastOrderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'user-6',
    name: 'نورة سلطان',
    email: 'noura@example.com',
    phone: '0591234567',
    address: 'المدينة، حي القبلتين، شارع أبي ذر',
    createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    orderCount: 1,
    totalSpent: 109.98,
    lastOrderDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

// بيانات وهمية للمخزون
const mockInventory: InventoryItemData[] = [
  {
    id: 'inv-1',
    name: 'لحم بقري',
    category: 'لحوم',
    quantity: 25,
    unit: 'كجم',
    status: 'In Stock',
    reorderPoint: 10,
    costPerUnit: 45,
    totalCost: 1125
  },
  {
    id: 'inv-2',
    name: 'دقيق',
    category: 'مواد جافة',
    quantity: 8,
    unit: 'كجم',
    status: 'Low Stock',
    reorderPoint: 10,
    costPerUnit: 5,
    totalCost: 40
  },
  {
    id: 'inv-3',
    name: 'طماطم',
    category: 'خضروات',
    quantity: 15,
    unit: 'كجم',
    status: 'In Stock',
    reorderPoint: 5,
    costPerUnit: 8,
    totalCost: 120
  },
  {
    id: 'inv-4',
    name: 'جبن موزاريلا',
    category: 'ألبان',
    quantity: 0,
    unit: 'كجم',
    status: 'Out of Stock',
    reorderPoint: 3,
    costPerUnit: 35,
    totalCost: 0
  }
];

export async function POST(req: NextRequest) {
  try {
    const { reportType, startDate, endDate } = await req.json();
    
    if (!reportType || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'نوع التقرير وتاريخ البداية والنهاية مطلوبة' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // ضبط تاريخ النهاية لنهاية اليوم
    
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 800));

    let data;
    let reportTitle;
    const reportDate = new Date().toISOString();

    switch (reportType) {
      case 'sales':
        data = await generateSalesReport(start, end);
        reportTitle = 'تقرير المبيعات';
        break;
      case 'orders':
        data = await generateOrdersReport(start, end);
        reportTitle = 'تقرير الطلبات';
        break;
      case 'customers':
        data = await generateCustomersReport(start, end);
        reportTitle = 'تقرير العملاء';
        break;
      case 'inventory':
        data = await generateInventoryReport();
        reportTitle = 'تقرير المخزون';
        break;
      default:
        return NextResponse.json(
          { error: 'نوع التقرير غير مدعوم' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      report: {
        type: reportType,
        title: reportTitle,
        startDate,
        endDate,
        generatedAt: reportDate,
        data
      }
    });

  } catch (error) {
    console.error('خطأ في إنشاء التقرير:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء التقرير' },
      { status: 500 }
    );
  }
}

async function generateSalesReport(startDate: Date, endDate: Date) {
  // تصفية الطلبات حسب النطاق الزمني
  const filteredOrders = mockOrders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= startDate && 
           orderDate <= endDate && 
           order.status !== 'cancelled';
  });
  
  let totalRevenue = 0;
  let totalOrders = 0;
  const salesByDay: Record<string, { date: string; revenue: number; orders: number }> = {};
  const salesByCategory: Record<string, { category: string; revenue: number; quantity: number }> = {};
  const topSellingItems: Record<string, { id: string; name: string; quantity: number; revenue: number }> = {};
  
  // بيانات وهمية للمنتجات المباعة
  const mockItems = [
    { id: 'item-1', name: 'برجر لحم', category: 'برجر', price: 45.99, quantity: 12 },
    { id: 'item-2', name: 'بيتزا مارجريتا', category: 'بيتزا', price: 59.99, quantity: 8 },
    { id: 'item-3', name: 'سلطة سيزر', category: 'سلطات', price: 35.99, quantity: 5 },
    { id: 'item-4', name: 'باستا كاربونارا', category: 'باستا', price: 49.99, quantity: 7 },
    { id: 'item-5', name: 'مشروب الليمون المنعش', category: 'مشروبات', price: 15.99, quantity: 15 }
  ];
  
  filteredOrders.forEach(order => {
    totalRevenue += order.total;
    totalOrders++;
    
    // تجميع حسب اليوم
    const orderDate = order.createdAt.split('T')[0];
    if (!salesByDay[orderDate]) {
      salesByDay[orderDate] = { date: orderDate, revenue: 0, orders: 0 };
    }
    salesByDay[orderDate].revenue += order.total;
    salesByDay[orderDate].orders++;
  });
  
  // إضافة بيانات وهمية للمنتجات والفئات
  mockItems.forEach(item => {
    // حسب الفئة
    if (!salesByCategory[item.category]) {
      salesByCategory[item.category] = { category: item.category, revenue: 0, quantity: 0 };
    }
    salesByCategory[item.category].revenue += (item.price * item.quantity);
    salesByCategory[item.category].quantity += item.quantity;
    
    // أكثر المنتجات مبيعًا
    topSellingItems[item.id] = { 
      id: item.id, 
      name: item.name, 
      quantity: item.quantity, 
      revenue: item.price * item.quantity 
    };
  });
  
  // تحويل الكائنات إلى مصفوفات وترتيبها
  const dailySales = Object.values(salesByDay).sort((a, b) => a.date.localeCompare(b.date));
  const categorySales = Object.values(salesByCategory).sort((a, b) => b.revenue - a.revenue);
  const topItems = Object.values(topSellingItems)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);
  
  return {
    summary: {
      totalRevenue,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
    },
    dailySales,
    categorySales,
    topSellingItems: topItems
  };
}

async function generateOrdersReport(startDate: Date, endDate: Date) {
  // تصفية الطلبات حسب النطاق الزمني
  const filteredOrders = mockOrders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= startDate && orderDate <= endDate;
  });
  
  const statusCounts: Record<string, number> = {
    pending: 0,
    processing: 0,
    completed: 0,
    delivered: 0,
    cancelled: 0
  };
  
  filteredOrders.forEach(order => {
    // عد حسب الحالة
    if (statusCounts[order.status] !== undefined) {
      statusCounts[order.status]++;
    }
  });
  
  return {
    orders: filteredOrders,
    statusCounts,
    totalOrders: filteredOrders.length
  };
}

async function generateCustomersReport(startDate: Date, endDate: Date) {
  // تصفية العملاء حسب تاريخ آخر طلب
  const filteredCustomers = mockCustomers.filter(customer => {
    if (!customer.lastOrderDate) return false;
    const lastOrderDate = new Date(customer.lastOrderDate);
    return lastOrderDate >= startDate && lastOrderDate <= endDate;
  });
  
  // حساب إجماليات
  const totalCustomers = filteredCustomers.length;
  const totalSpent = filteredCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const totalOrders = filteredCustomers.reduce((sum, customer) => sum + customer.orderCount, 0);
  
  return {
    customers: filteredCustomers,
    summary: {
      totalCustomers,
      totalSpent,
      totalOrders,
      averageSpentPerCustomer: totalCustomers > 0 ? totalSpent / totalCustomers : 0
    }
  };
}

async function generateInventoryReport() {
  // حساب إجماليات المخزون
  const totalItems = mockInventory.length;
  const totalValue = mockInventory.reduce((sum, item) => sum + item.totalCost, 0);
  const lowStockItems = mockInventory.filter(item => item.status === 'Low Stock');
  const outOfStockItems = mockInventory.filter(item => item.status === 'Out of Stock');
  
  // تجميع حسب الفئة
  const categoryGroups: Record<string, { category: string; itemCount: number; totalValue: number }> = {};
  
  mockInventory.forEach(item => {
    if (!categoryGroups[item.category]) {
      categoryGroups[item.category] = { category: item.category, itemCount: 0, totalValue: 0 };
    }
    categoryGroups[item.category].itemCount++;
    categoryGroups[item.category].totalValue += item.totalCost;
  });
  
  return {
    items: mockInventory,
    summary: {
      totalItems,
      totalValue,
      lowStockItemsCount: lowStockItems.length,
      outOfStockItemsCount: outOfStockItems.length
    },
    categoryBreakdown: Object.values(categoryGroups)
  };
} 