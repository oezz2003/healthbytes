import { NextResponse } from 'next/server';
import { updateInventoryOnOrderConfirmation, updateDocument } from '../../../../lib/firebase/helpers';

/**
 * معالج طلب تأكيد الطلب وتحديث المخزون
 */
export async function POST(request) {
  try {
    const { orderId } = await request.json();
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'معرّف الطلب مطلوب' },
        { status: 400 }
      );
    }
    
    // تحديث حالة الطلب إلى "مؤكد"
    await updateDocument('orders', orderId, {
      status: 'confirmed',
    });
    
    // تحديث المخزون تلقائياً
    const result = await updateInventoryOnOrderConfirmation(orderId);
    
    if (!result) {
      return NextResponse.json(
        { error: 'حدث خطأ أثناء تحديث المخزون' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `تم تأكيد الطلب ${orderId} وتحديث المخزون بنجاح`
    });
  } catch (error) {
    console.error('خطأ في تأكيد الطلب:', error);
    return NextResponse.json(
      { error: 'فشل في تأكيد الطلب', details: error.message },
      { status: 500 }
    );
  }
} 