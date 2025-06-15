// تصدير المكونات الرئيسية
export { AuthProvider, useAuth } from './AuthProvider';
export { Permission } from './types';

// تصدير الأنواع
export type { AdminUser, AuthContextType } from './types';

// الصادرات الافتراضية
export { useAuth as default } from './AuthProvider'; 