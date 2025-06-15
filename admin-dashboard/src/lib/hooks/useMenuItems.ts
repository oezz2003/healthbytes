import { useState, useEffect } from 'react';
import { MenuItem, NutritionalInfo } from '@/types';

interface UseMenuItemsProps {
  category?: string;
  isAvailable?: boolean;
  pageSize?: number;
}

interface MenuItemsResult {
  menuItems: MenuItem[];
  loading: boolean;
  error: Error | null;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  refresh: () => void;
}

// بيانات وهمية للمنتجات
const mockMenuItems: MenuItem[] = [
  {
    id: 'item-1',
    name: 'برجر لحم',
    description: 'برجر لحم بقري مشوي مع جبن شيدر وصلصة خاصة',
    price: 45.99,
    image: 'https://via.placeholder.com/300x200?text=Burger',
    category: 'برجر',
    nutritionalInfo: {
      calories: 650,
      protein: 35,
      carbs: 40,
      fat: 30,
      ingredients: ['لحم بقري', 'خبز', 'جبن شيدر', 'خس', 'طماطم', 'بصل', 'مخلل'],
      allergens: ['جلوتين', 'ألبان']
    },
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'item-2',
    name: 'بيتزا مارجريتا',
    description: 'بيتزا إيطالية تقليدية مع صلصة طماطم وجبن موزاريلا وريحان',
    price: 59.99,
    image: 'https://via.placeholder.com/300x200?text=Pizza',
    category: 'بيتزا',
    nutritionalInfo: {
      calories: 850,
      protein: 25,
      carbs: 90,
      fat: 35,
      ingredients: ['عجين', 'صلصة طماطم', 'جبن موزاريلا', 'ريحان', 'زيت زيتون'],
      allergens: ['جلوتين', 'ألبان']
    },
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'item-3',
    name: 'سلطة سيزر',
    description: 'سلطة خس رومين مع صلصة سيزر وقطع خبز محمص وجبن بارميزان',
    price: 35.99,
    image: 'https://via.placeholder.com/300x200?text=Salad',
    category: 'سلطات',
    nutritionalInfo: {
      calories: 320,
      protein: 15,
      carbs: 25,
      fat: 18,
      ingredients: ['خس روماني', 'خبز محمص', 'جبن بارميزان', 'صلصة سيزر'],
      allergens: ['جلوتين', 'ألبان', 'بيض']
    },
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'item-4',
    name: 'باستا كاربونارا',
    description: 'باستا مع صلصة كريمية وبيض ولحم مقدد وجبن بارميزان',
    price: 49.99,
    image: 'https://via.placeholder.com/300x200?text=Pasta',
    category: 'باستا',
    nutritionalInfo: {
      calories: 780,
      protein: 28,
      carbs: 85,
      fat: 32,
      ingredients: ['باستا', 'بيض', 'لحم مقدد', 'جبن بارميزان', 'كريمة'],
      allergens: ['جلوتين', 'ألبان', 'بيض']
    },
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'item-5',
    name: 'مشروب الليمون المنعش',
    description: 'عصير ليمون طازج مع النعناع والسكر',
    price: 15.99,
    image: 'https://via.placeholder.com/300x200?text=Lemonade',
    category: 'مشروبات',
    nutritionalInfo: {
      calories: 120,
      protein: 0,
      carbs: 30,
      fat: 0,
      ingredients: ['ليمون', 'سكر', 'نعناع', 'ماء'],
      allergens: []
    },
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useMenuItems = ({
  category,
  isAvailable,
  pageSize = 10,
}: UseMenuItemsProps = {}): MenuItemsResult => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  // محاكاة جلب البيانات مع تأخير
  const fetchMenuItems = async (isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // تطبيق المرشحات
      let filteredItems = [...mockMenuItems];
      
      if (category) {
        filteredItems = filteredItems.filter(item => item.category === category);
      }
      
      if (isAvailable !== undefined) {
        filteredItems = filteredItems.filter(item => item.isAvailable === isAvailable);
      }
      
      // محاكاة الصفحات
      const startIndex = 0;
      const endIndex = isLoadMore ? page * pageSize : pageSize;
      const paginatedItems = filteredItems.slice(startIndex, endIndex);
      
      // التحقق مما إذا كان هناك المزيد من العناصر
      setHasMore(endIndex < filteredItems.length);
      
      // تحديث الحالة
      if (isLoadMore) {
        setMenuItems(paginatedItems);
        setPage(prevPage => prevPage + 1);
      } else {
        setMenuItems(paginatedItems);
        setPage(1);
      }
      
      console.log(`📋 تم تحميل ${paginatedItems.length} منتج${category ? ` من فئة ${category}` : ''}`);
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('حدث خطأ غير معروف'));
      console.error('خطأ في جلب المنتجات:', err);
    } finally {
      setLoading(false);
    }
  };

  // تحميل البيانات الأولية
  useEffect(() => {
    fetchMenuItems();
  }, [category, isAvailable, pageSize]);

  // دالة لتحميل المزيد من العناصر
  const loadMore = async () => {
    if (!loading && hasMore) {
      await fetchMenuItems(true);
    }
  };

  // دالة لتحديث البيانات
  const refresh = () => {
    setPage(1);
    setHasMore(true);
    fetchMenuItems();
  };

  return { menuItems, loading, error, loadMore, hasMore, refresh };
};

export default useMenuItems; 