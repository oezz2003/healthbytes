import { User, MenuItem, Order } from '@/types';

// محاكاة تحويل الطابع الزمني إلى سلسلة ISO
export const timestampToISOString = (timestamp: any): string => {
  try {
    // Handle Firebase Timestamp objects
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toISOString();
    }
    
    // Handle numeric timestamps (milliseconds since epoch)
    if (typeof timestamp === 'number') {
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    }
    
    // Handle ISO string dates
    if (typeof timestamp === 'string') {
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return timestamp;
      }
    }
    
    // Default to current date if invalid
    return new Date().toISOString();
  } catch (error) {
    console.error('Error converting timestamp:', error);
    return new Date().toISOString();
  }
};

// محاكاة تحويل بيانات المستند إلى أنواع التطبيق
export const convertUserDoc = (doc: any): User => {
  const data = doc.data?.() || {};
  return {
    id: doc.id || 'mock-user-id',
    email: data.email || 'user@example.com',
    name: data.name || 'مستخدم وهمي',
    role: data.role || 'Customer',
    phone: data.phone || '0123456789',
    address: data.address || 'عنوان وهمي',
    createdAt: data.createdAt ? timestampToISOString(data.createdAt) : new Date().toISOString(),
    updatedAt: data.updatedAt ? timestampToISOString(data.updatedAt) : new Date().toISOString()
  };
};

export const convertMenuItemDoc = (doc: any): MenuItem => {
  const data = doc.data?.() || {};
  return {
    id: doc.id || 'mock-item-id',
    name: data.name || 'منتج وهمي',
    description: data.description || 'وصف وهمي للمنتج',
    price: data.price || 25.99,
    image: data.image || 'https://via.placeholder.com/150',
    category: data.category || 'أطباق رئيسية',
    nutritionalInfo: data.nutritionalInfo || {
      calories: 350,
      protein: 15,
      carbs: 40,
      fat: 10,
      ingredients: ['مكون 1', 'مكون 2'],
      allergens: []
    },
    isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
    createdAt: data.createdAt ? timestampToISOString(data.createdAt) : new Date().toISOString(),
    updatedAt: data.updatedAt ? timestampToISOString(data.updatedAt) : new Date().toISOString()
  };
};

export const convertOrderDoc = (doc: any): Order => {
  const data = doc.data?.() || {};
  return {
    id: doc.id || 'mock-order-id',
    orderNumber: data.orderNumber || Math.floor(Math.random() * 10000),
    customerId: data.customerId || 'mock-customer-id',
    userId: data.userId || 'mock-user-id',
    userName: data.userName || 'مستخدم وهمي',
    items: data.items || [],
    status: data.status || 'pending',
    total: data.total || 0,
    totalAmount: data.totalAmount || 0,
    paymentMethod: data.paymentMethod || 'cash',
    paymentStatus: data.paymentStatus || 'pending',
    address: data.address || 'عنوان وهمي',
    createdAt: data.createdAt ? timestampToISOString(data.createdAt) : new Date().toISOString(),
    updatedAt: data.updatedAt ? timestampToISOString(data.updatedAt) : new Date().toISOString()
  };
};

// دالة عامة للحصول على مستند حسب المعرف
export async function getDocumentById<T>(collectionName: string, id: string, converter: (doc: any) => T): Promise<T | null> {
  console.log(`🔍 محاكاة الحصول على مستند من ${collectionName} بالمعرف ${id}`);
  // إرجاع بيانات وهمية
  return converter({ 
    id: id, 
    data: () => ({ 
      name: 'عنصر وهمي',
      createdAt: { toDate: () => new Date() },
      updatedAt: { toDate: () => new Date() }
    }) 
  });
}

// دالة عامة للحصول على المستندات مع التصفح
export async function getDocuments<T>(
  collectionName: string,
  converter: (doc: any) => T,
  constraints: any[] = [],
  pageSize = 10,
  lastDoc?: any
): Promise<{ data: T[], lastDoc: any }> {
  console.log(`🔍 محاكاة الحصول على مستندات من ${collectionName}`);
  
  // إنشاء مصفوفة من البيانات الوهمية
  const mockDocs = Array.from({ length: Math.min(pageSize, 5) }, (_, i) => ({
    id: `mock-${collectionName}-${i}`,
    data: () => ({
      name: `عنصر وهمي ${i}`,
      createdAt: { toDate: () => new Date() },
      updatedAt: { toDate: () => new Date() }
    })
  }));
  
  const data = mockDocs.map(doc => converter(doc));
  return { data, lastDoc: mockDocs[mockDocs.length - 1] };
}

// إنشاء مستند جديد
export async function createDocument(collectionName: string, data: any): Promise<string> {
  console.log(`✏️ محاكاة إنشاء مستند في ${collectionName}`, data);
  return `mock-${collectionName}-${Date.now()}`;
}

// تحديث مستند موجود
export async function updateDocument(collectionName: string, id: string, data: any): Promise<void> {
  console.log(`✏️ محاكاة تحديث مستند في ${collectionName} بالمعرف ${id}`, data);
}

// حذف مستند
export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  console.log(`🗑️ محاكاة حذف مستند من ${collectionName} بالمعرف ${id}`);
} 