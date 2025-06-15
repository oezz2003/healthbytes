import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/firebase/adminApi';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // استخدام تفكيك مع await للحصول على معرف المستخدم
    const { id } = await context.params;
    
    // التحقق من وجود معرف المستخدم
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      );
    }

    // جلب بيانات المستخدم من Firebase
    const userDoc = await db.collection('users').doc(id).get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    
    // إضافة معرف المستخدم إلى البيانات
    const user = {
      id: userDoc.id,
      ...userData
    };

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error('خطأ في جلب بيانات المستخدم:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ في جلب بيانات المستخدم' },
      { status: 500 }
    );
  }
} 