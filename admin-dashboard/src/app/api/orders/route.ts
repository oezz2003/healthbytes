import { NextRequest, NextResponse } from "next/server";
import { db, storage, firebaseAdmin } from '@/lib/firebase/adminApi';

// ✅ Helper response functions
const successResponse = (data?: any, status = 200) =>
  NextResponse.json({ success: true, data }, { status });

const errorResponse = (message: string, status = 500) =>
  NextResponse.json({ success: false, error: message }, { status });

// ✅ GET: Get all orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    let query = db.collection('orders');
    
    // تصفية الطلبات حسب معرف المستخدم إذا تم تحديده
    if (userId) {
      // البحث في كلا المعرفين userId و customerId
      const ordersSnapshot = await query
        .where('customerId', '==', userId)
        .get();
      
      const ordersSnapshot2 = await query
        .where('userId', '==', userId)
        .get();
      
      // دمج النتائج مع إزالة التكرار
      const ordersMap = new Map();
      
      ordersSnapshot.docs.forEach(doc => {
        ordersMap.set(doc.id, {
          id: doc.id,
          ...doc.data()
        });
      });
      
      ordersSnapshot2.docs.forEach(doc => {
        ordersMap.set(doc.id, {
          id: doc.id,
          ...doc.data()
        });
      });
      
      const orders = Array.from(ordersMap.values());
      
      // ترتيب الطلبات من الأحدث إلى الأقدم
      orders.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      
      return NextResponse.json({ success: true, data: orders });
    }
    
    // إذا لم يتم تحديد معرف المستخدم، إرجاع جميع الطلبات
    const ordersSnapshot = await query.orderBy('createdAt', 'desc').get();
    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    console.error('خطأ في جلب الطلبات:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ في جلب الطلبات' },
      { status: 500 }
    );
  }
}

// ✅ POST: Create a new order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      userId,
      items,
      totalPrice,
      status = "pending",
      createdAt = Date.now(),
    } = body;

    if (!userId || !items || !Array.isArray(items) || !totalPrice) {
      return errorResponse("Missing required fields: userId, items, totalPrice", 400);
    }

    const docRef = await db.collection("orders").add({
      userId,
      items,
      totalPrice,
      status,
      createdAt,
    });

    return successResponse({ id: docRef.id });
  } catch (error: any) {
    return errorResponse(error.message || "Error creating order");
  }
}

// ✅ PUT: Update existing order
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) return errorResponse("Missing order ID", 400);

    const docRef = db.collection("orders").doc(id);
    await docRef.update({ ...updates });

    return successResponse({ message: "Order updated" });
  } catch (error: any) {
    return errorResponse(error.message || "Error updating order");
  }
}

// ✅ DELETE: Delete order
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) return errorResponse("Missing order ID", 400);

    await db.collection("orders").doc(id).delete();

    return successResponse({ message: "Order deleted" });
  } catch (error: any) {
    return errorResponse(error.message || "Error deleting order");
  }
}
