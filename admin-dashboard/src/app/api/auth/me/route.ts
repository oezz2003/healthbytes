import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as crypto from 'crypto';

// بيانات وهمية للمستخدمين
const MOCK_USERS = [
  {
    id: 'admin-1',
    name: 'مشرف النظام',
    email: 'admin@example.com',
    role: 'Admin',
    avatar: '/images/avatars/admin.jpg'
  },
  {
    id: 'manager-1',
    name: 'مدير التطبيق',
    email: 'manager@example.com',
    role: 'Manager',
    avatar: '/images/avatars/manager.jpg'
  },
  {
    id: 'staff-1',
    name: 'موظف',
    email: 'staff@example.com',
    role: 'Staff',
    avatar: '/images/avatars/staff.jpg'
  }
];

// نقطة نهاية API للحصول على بيانات المستخدم المصادق
export async function GET(req: NextRequest) {
  try {
    // الحصول على ملفات تعريف الارتباط
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    
    // محاكاة التأخير في الشبكة
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // التحقق من الرمز المميز
    const userId = validateToken(authToken);
    if (!userId) {
      return NextResponse.json({ isAuthenticated: false, user: null }, { status: 401 });
    }
    
    // البحث عن المستخدم
    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json({ isAuthenticated: false, user: null }, { status: 401 });
    }
    
    // إرجاع معلومات المستخدم
    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('خطأ في واجهة برمجة التطبيقات للمصادقة:', error);
    return NextResponse.json(
      { error: 'خطأ في الخادم الداخلي' },
      { status: 500 }
    );
  }
}

// محاكاة وظائف التحقق من الرمز المميز
const validateToken = (token: string | undefined): string | null => {
  if (!token) return null;
  
  try {
    // محاكاة فك تشفير الرمز المميز
    const hash = crypto.createHash('md5').update(token).digest('hex');
    const userId = `admin-1`; // دائمًا نعيد معرف المشرف للتبسيط
    
    return userId;
  } catch (error) {
    console.error('خطأ في التحقق من الرمز المميز:', error);
    return null;
  }
}; 