import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/firebase/adminApi';

// الحصول على تفاصيل الطلب
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // استخدام تفكيك مع await للحصول على معرف الطلب
    const { id } = await context.params;
    
    // التحقق من وجود معرف الطلب
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف الطلب مطلوب' },
        { status: 400 }
      );
    }

    // جلب بيانات الطلب من Firebase
    const orderDoc = await db.collection('orders').doc(id).get();
    
    if (!orderDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    const orderData = orderDoc.data();
    
    // إضافة معرف الطلب إلى البيانات
    const order = {
      id: orderDoc.id,
      ...orderData
    };

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error('خطأ في جلب بيانات الطلب:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ في جلب بيانات الطلب' },
      { status: 500 }
    );
  }
}

// تحديث حالة الطلب
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // استخدام تفكيك مع await للحصول على معرف الطلب
    const { id } = await context.params;
    
    // التحقق من وجود معرف الطلب
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف الطلب مطلوب' },
        { status: 400 }
      );
    }
    
    // الحصول على بيانات التحديث من الطلب
    const data = await request.json();
    
    // التحقق من وجود حالة جديدة
    if (!data.status) {
      return NextResponse.json(
        { success: false, error: 'حالة الطلب الجديدة مطلوبة' },
        { status: 400 }
      );
    }
    
    // التحقق من وجود الطلب
    const orderRef = db.collection('orders').doc(id);
    const orderDoc = await orderRef.get();
    
    if (!orderDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }
    
    // تحديث حالة الطلب
    await orderRef.update({
      status: data.status,
      updatedAt: new Date()
    });
    
    // إرجاع الطلب المحدث
    const updatedOrderDoc = await orderRef.get();
    const updatedOrder = {
      id: updatedOrderDoc.id,
      ...updatedOrderDoc.data()
    };
    
    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error: any) {
    console.error('خطأ في تحديث حالة الطلب:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ في تحديث حالة الطلب' },
      { status: 500 }
    );
  }
} 