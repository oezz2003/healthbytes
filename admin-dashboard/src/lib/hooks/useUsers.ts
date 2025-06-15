import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface UseUsersProps {
  role?: UserRole;
  isActive?: boolean;
  pageSize?: number;
}

interface UsersResult {
  users: User[];
  loading: boolean;
  error: Error | null;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  refresh: () => void;
  totalUsers?: number;
  activeUsers?: number;
}

// بيانات وهمية للمستخدمين
const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '0501234567',
    role: 'Customer',
    address: 'الرياض، حي النزهة، شارع الأمير سعود',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user-2',
    name: 'سارة أحمد',
    email: 'sara@example.com',
    phone: '0551234567',
    role: 'Customer',
    address: 'جدة، حي الروضة، شارع الأندلس',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user-3',
    name: 'محمد العلي',
    email: 'mohammed@example.com',
    phone: '0561234567',
    role: 'Staff',
    address: 'الدمام، حي الشاطئ، شارع الخليج',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user-4',
    name: 'فاطمة خالد',
    email: 'fatima@example.com',
    phone: '0571234567',
    role: 'Admin',
    address: 'الرياض، حي الملقا، شارع التخصصي',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user-5',
    name: 'عبدالله سعيد',
    email: 'abdullah@example.com',
    phone: '0581234567',
    role: 'Operation Manager',
    address: 'مكة، حي العزيزية، شارع الحج',
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user-6',
    name: 'نورة سلطان',
    email: 'noura@example.com',
    phone: '0591234567',
    role: 'Customer',
    address: 'المدينة، حي القبلتين، شارع أبي ذر',
    createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useUsers = ({
  role,
  isActive,
  pageSize = 10,
}: UseUsersProps = {}): UsersResult => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  // محاكاة جلب البيانات مع تأخير
  const fetchUsers = async (isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // تطبيق المرشحات
      let filteredUsers = [...mockUsers];
      
      if (role) {
        filteredUsers = filteredUsers.filter(user => user.role === role);
      }
      
      // محاكاة الصفحات
      const startIndex = 0;
      const endIndex = isLoadMore ? page * pageSize : pageSize;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      // التحقق مما إذا كان هناك المزيد من المستخدمين
      setHasMore(endIndex < filteredUsers.length);
      
      // تحديث الحالة
      if (isLoadMore) {
        setUsers(paginatedUsers);
        setPage(prevPage => prevPage + 1);
      } else {
        setUsers(paginatedUsers);
        setPage(1);
      }
      
      console.log(`👤 تم تحميل ${paginatedUsers.length} مستخدم${role ? ` من نوع ${role}` : ''}`);
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('حدث خطأ غير معروف'));
      console.error('خطأ في جلب المستخدمين:', err);
    } finally {
      setLoading(false);
    }
  };

  // تحميل البيانات الأولية
  useEffect(() => {
    fetchUsers();
  }, [role, isActive, pageSize]);

  // دالة لتحميل المزيد من المستخدمين
  const loadMore = async () => {
    if (!loading && hasMore) {
      await fetchUsers(true);
    }
  };

  // دالة لتحديث البيانات
  const refresh = () => {
    setPage(1);
    setHasMore(true);
    fetchUsers();
  };

  // إحصائيات إضافية
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(user => user.role === 'Customer').length;

  return { 
    users, 
    loading, 
    error, 
    loadMore, 
    hasMore, 
    refresh, 
    totalUsers, 
    activeUsers 
  };
};

export default useUsers; 