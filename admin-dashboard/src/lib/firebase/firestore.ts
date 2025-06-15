import { db } from './clientApp';
import { 
  User, 
  MenuItem, 
  Order, 
  InventoryItem, 
  InventoryTransaction,
  Category,
  Supplier,
  TopSellingItem
} from '@/types';
import { 
  suppliers, 
  inventoryItems, 
  categories, 
  menuItems, 
  menuItemIngredients,
  users, 
  orders, 
  inventoryTransactions, 
  topSellingItems 
} from '../utils/seedData';

// محاكاة مجموعات Firebase
const collections = {
  users,
  menuItems,
  orders,
  inventoryItems,
  inventoryTransactions,
  categories,
  suppliers,
  menuItemIngredients,
  topSellingItems
};

// وظيفة للحصول على عنصر بمعرف معين من مجموعة معينة
export const getDocById = <T>(collectionName: string, id: string): T | null => {
  if (!collections.hasOwnProperty(collectionName)) {
    console.error(`مجموعة غير موجودة: ${collectionName}`);
    return null;
  }

  // @ts-ignore - التعامل الديناميكي مع المجموعات
  const collection = collections[collectionName];
  const doc = collection.find((item: any) => item.id === id);
  
  return doc || null;
};

// وظيفة للحصول على جميع العناصر من مجموعة معينة
export const getDocs = <T>(collectionName: string, filters?: any): T[] => {
  if (!collections.hasOwnProperty(collectionName)) {
    console.error(`مجموعة غير موجودة: ${collectionName}`);
    return [];
  }

  // @ts-ignore - التعامل الديناميكي مع المجموعات
  let result = [...collections[collectionName]];
  
  // تطبيق المرشحات إذا كانت موجودة
  if (filters) {
    for (const [field, value] of Object.entries(filters)) {
      result = result.filter((item: any) => item[field] === value);
    }
  }
  
  return result;
};

// وظيفة للحصول على طلبات المستخدم
export const getUserOrders = (userId: string): Order[] => {
  return orders.filter(order => order.customerId === userId);
};

// وظيفة للحصول على عناصر المخزون منخفضة المخزون
export const getLowStockItems = (): InventoryItem[] => {
  return inventoryItems.filter(item => 
    item.status === 'Low Stock' || 
    (item.quantity <= (item.reorderPoint || 0) && item.quantity > 0)
  );
};

// وظيفة للحصول على عناصر المخزون المنتهية
export const getOutOfStockItems = (): InventoryItem[] => {
  return inventoryItems.filter(item => 
    item.status === 'Out of Stock' || item.quantity <= 0
  );
};

// وظيفة للحصول على معاملات المخزون لعنصر معين
export const getInventoryTransactions = (itemId: string): InventoryTransaction[] => {
  return inventoryTransactions.filter(transaction => 
    transaction.inventoryItemId === itemId
  );
};

// وظيفة للحصول على المكونات المستخدمة في عنصر قائمة معين
export const getMenuItemIngredients = (menuItemId: string): any[] => {
  const ingredients = menuItemIngredients
    .filter(relation => relation.menuItemId === menuItemId)
    .map(relation => {
      const inventoryItem = getDocById<InventoryItem>('inventoryItems', relation.ingredientId);
      return {
        ingredient: inventoryItem,
        quantity: relation.quantity
      };
    });
  
  return ingredients;
};

// وظيفة للحصول على عناصر القائمة حسب الفئة
export const getMenuItemsByCategory = (categoryName: string): MenuItem[] => {
  return menuItems.filter(item => item.category === categoryName);
};

// وظيفة للحصول على العناصر الأكثر مبيعًا
export const getTopSellingItems = (limit: number = 5): TopSellingItem[] => {
  return [...topSellingItems].sort((a, b) => b.totalSold - a.totalSold).slice(0, limit);
};

// وظيفة للحصول على معلومات المورد لعنصر مخزون معين
export const getItemSupplier = (inventoryItem: InventoryItem): Supplier | null => {
  if (!inventoryItem.supplier) return null;
  return getDocById<Supplier>('suppliers', inventoryItem.supplier);
};

// وظيفة لتحديث عناصر المخزون عند إنشاء طلب جديد
export const updateInventoryOnOrder = (orderItems: any[]): void => {
  for (const orderItem of orderItems) {
    const menuItemId = orderItem.menuItemId;
    const quantity = orderItem.quantity;
    
    // الحصول على المكونات المستخدمة في عنصر القائمة
    const ingredients = getMenuItemIngredients(menuItemId);
    
    // تحديث كميات المخزون
    for (const { ingredient, quantity: ingredientQty } of ingredients) {
      if (ingredient) {
        const totalUsed = ingredientQty * quantity;
        const inventory = getDocById<InventoryItem>('inventoryItems', ingredient.id);
        
        if (inventory) {
          // محاكاة تحديث المخزون
          console.log(`تحديث المخزون: ${ingredient.name} -${totalUsed} ${ingredient.unit}`);
        }
      }
    }
  }
}; 
 
 
 
 