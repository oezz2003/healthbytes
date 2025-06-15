/**
 * وظائف مساعدة للتعامل مع Firebase
 */

import { db, storage } from './config';

// استخدام admin من خلال الاستيراد الديناميكي للتشغيل على الخادم فقط
let admin;
if (typeof window === 'undefined') {
  admin = require('firebase-admin');
}

/**
 * تحديث المخزون عند تأكيد الطلب
 * @param {string} orderId - معرّف الطلب
 * @returns {Promise<boolean>} - نجاح العملية
 */
export const updateInventoryOnOrderConfirmation = async (orderId) => {
  try {
    // التحقق من أننا على الخادم
    if (typeof window !== 'undefined') {
      console.warn('لا يمكن تحديث المخزون في المتصفح');
      return false;
    }
    
    // الحصول على بيانات الطلب
    const orderRef = db.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();
    
    if (!orderSnap.exists) {
      throw new Error(`الطلب برقم ${orderId} غير موجود`);
    }
    
    const orderData = orderSnap.data();
    
    // التحقق من أن الطلب تم تأكيده
    if (orderData.status !== 'confirmed' && orderData.status !== 'مؤكد') {
      console.log(`لم يتم تحديث المخزون لأن الطلب برقم ${orderId} ليس مؤكداً`);
      return false;
    }
    
    // لكل عنصر في الطلب
    for (const item of orderData.items) {
      // الحصول على بيانات عنصر القائمة
      const menuItemRef = db.collection('menuItems').doc(item.menuItemId);
      const menuItemSnap = await menuItemRef.get();
      
      if (menuItemSnap.exists) {
        const menuItemData = menuItemSnap.data();
        
        // لكل عنصر مخزون مرتبط بعنصر القائمة
        if (menuItemData.ingredientsList && menuItemData.ingredientsList.length > 0) {
          for (const ingredient of menuItemData.ingredientsList) {
            // تحديث المخزون
            const inventoryRef = db.collection('inventory').doc(ingredient.inventoryItemId);
            const inventorySnap = await inventoryRef.get();
            
            if (inventorySnap.exists) {
              const inventoryData = inventorySnap.data();
              const quantityToDeduct = ingredient.quantity * item.quantity;
              
              // التحقق من توفر الكمية الكافية
              if (inventoryData.quantity >= quantityToDeduct) {
                // خصم الكمية من المخزون
                await inventoryRef.update({
                  quantity: admin.firestore.FieldValue.increment(-quantityToDeduct),
                  updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                
                // إضافة معاملة مخزون
                const transactionRef = db.collection('inventoryTransactions').doc();
                await transactionRef.set({
                  inventoryItemId: ingredient.inventoryItemId,
                  type: 'out',
                  quantity: quantityToDeduct,
                  reason: `استخدام في الطلب #${orderData.orderNumber}`,
                  previousQuantity: inventoryData.quantity,
                  newQuantity: inventoryData.quantity - quantityToDeduct,
                  orderId: orderId,
                  performedBy: 'system',
                  timestamp: admin.firestore.FieldValue.serverTimestamp()
                });
                
                console.log(`تم خصم ${quantityToDeduct} ${inventoryData.unit} من ${inventoryData.name}`);
                
                // تحديث حالة المخزون إذا انخفض عن الحد الأدنى
                if ((inventoryData.quantity - quantityToDeduct) <= inventoryData.threshold && 
                    (inventoryData.quantity - quantityToDeduct) > 0) {
                  await inventoryRef.update({
                    status: 'Low Stock',
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                  });
                  
                  // إضافة إشعار للمسؤولين
                  const notificationRef = db.collection('notifications').doc();
                  await notificationRef.set({
                    type: 'inventory',
                    title: 'تنبيه مخزون منخفض',
                    message: `مستوى المخزون لـ ${inventoryData.name} أصبح منخفضاً (${inventoryData.quantity - quantityToDeduct} ${inventoryData.unit})`,
                    isRead: false,
                    inventoryItemId: ingredient.inventoryItemId,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                  });
                } 
                else if ((inventoryData.quantity - quantityToDeduct) <= 0) {
                  await inventoryRef.update({
                    status: 'Out of Stock',
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                  });
                  
                  // إضافة إشعار للمسؤولين
                  const notificationRef = db.collection('notifications').doc();
                  await notificationRef.set({
                    type: 'inventory',
                    title: 'تنبيه نفاد المخزون',
                    message: `نفذت كمية ${inventoryData.name} من المخزون`,
                    isRead: false,
                    inventoryItemId: ingredient.inventoryItemId,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                  });
                }
              } else {
                console.error(`كمية غير كافية من ${inventoryData.name} في المخزون`);
              }
            }
          }
        }
      }
    }
    
    // تحديث حالة الطلب
    await orderRef.update({
      inventoryUpdated: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`✅ تم تحديث المخزون للطلب رقم ${orderId}`);
    return true;
  } catch (error) {
    console.error('❌ خطأ في تحديث المخزون:', error);
    return false;
  }
};

/**
 * رفع صورة إلى Firebase Storage
 * @param {File} file - ملف الصورة
 * @param {string} path - مسار التخزين
 * @returns {Promise<string>} - رابط URL للصورة
 */
export const uploadImage = async (file, path) => {
  try {
    // التحقق من أننا على الخادم
    if (typeof window !== 'undefined') {
      console.warn('لا يمكن رفع الصور في المتصفح');
      return 'https://example.com/mock-image-url';
    }
    
    const fileRef = storage.bucket().file(path);
    await fileRef.save(file.buffer, {
      contentType: file.mimetype,
      metadata: {
        contentType: file.mimetype,
        firebaseStorageDownloadTokens: Date.now().toString()
      }
    });
    
    const [downloadURL] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '01-01-2500'
    });
    
    return downloadURL;
  } catch (error) {
    console.error('خطأ في رفع الصورة:', error);
    throw error;
  }
};

/**
 * الحصول على قائمة بالعناصر من مجموعة
 * @param {string} collectionName - اسم المجموعة
 * @param {object} filters - عوامل التصفية (اختياري)
 * @param {number} limit - الحد الأقصى لعدد النتائج (اختياري)
 * @returns {Promise<Array>} - مصفوفة النتائج
 */
export const getCollection = async (collectionName, filters = {}, limit = 100) => {
  try {
    let query = db.collection(collectionName);
    
    // إضافة عوامل التصفية
    for (const [field, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        query = query.where(field, '==', value);
      }
    }
    
    // تطبيق الحد الأقصى للنتائج
    if (limit > 0) {
      query = query.limit(limit);
    }
    
    const snapshot = await query.get();
    
    const items = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    
    return items;
  } catch (error) {
    console.error(`خطأ في الحصول على عناصر من مجموعة ${collectionName}:`, error);
    throw error;
  }
};

/**
 * الحصول على وثيقة من مجموعة
 * @param {string} collectionName - اسم المجموعة
 * @param {string} documentId - معرّف الوثيقة
 * @returns {Promise<object|null>} - بيانات الوثيقة أو null إذا لم تكن موجودة
 */
export const getDocument = async (collectionName, documentId) => {
  try {
    const docRef = db.collection(collectionName).doc(documentId);
    const doc = await docRef.get();
    
    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`خطأ في الحصول على وثيقة ${documentId} من مجموعة ${collectionName}:`, error);
    throw error;
  }
};

/**
 * إضافة وثيقة جديدة إلى مجموعة
 * @param {string} collectionName - اسم المجموعة
 * @param {object} data - بيانات الوثيقة
 * @param {string} [documentId] - معرّف الوثيقة (اختياري)
 * @returns {Promise<string>} - معرّف الوثيقة الجديدة
 */
export const addDocument = async (collectionName, data, documentId = null) => {
  try {
    let timestamp;
    
    // التحقق من أننا على الخادم لاستخدام admin
    if (typeof window === 'undefined' && admin) {
      timestamp = admin.firestore.FieldValue.serverTimestamp();
    } else {
      // استخدام بديل للمتصفح
      timestamp = new Date().toISOString();
    }
    
    const dataWithTimestamps = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    let docRef;
    if (documentId) {
      docRef = db.collection(collectionName).doc(documentId);
      await docRef.set(dataWithTimestamps);
    } else {
      docRef = await db.collection(collectionName).add(dataWithTimestamps);
    }
    
    return docRef.id;
  } catch (error) {
    console.error(`خطأ في إضافة وثيقة إلى مجموعة ${collectionName}:`, error);
    throw error;
  }
};

/**
 * تحديث وثيقة في مجموعة
 * @param {string} collectionName - اسم المجموعة
 * @param {string} documentId - معرّف الوثيقة
 * @param {object} data - البيانات المحدثة
 * @returns {Promise<boolean>} - نجاح العملية
 */
export const updateDocument = async (collectionName, documentId, data) => {
  try {
    const docRef = db.collection(collectionName).doc(documentId);
    
    let timestamp;
    // التحقق من أننا على الخادم لاستخدام admin
    if (typeof window === 'undefined' && admin) {
      timestamp = admin.firestore.FieldValue.serverTimestamp();
    } else {
      // استخدام بديل للمتصفح
      timestamp = new Date().toISOString();
    }
    
    const dataWithTimestamp = {
      ...data,
      updatedAt: timestamp
    };
    
    await docRef.update(dataWithTimestamp);
    return true;
  } catch (error) {
    console.error(`خطأ في تحديث وثيقة ${documentId} في مجموعة ${collectionName}:`, error);
    throw error;
  }
};

/**
 * حذف وثيقة من مجموعة
 * @param {string} collectionName - اسم المجموعة
 * @param {string} documentId - معرّف الوثيقة
 * @returns {Promise<boolean>} - نجاح العملية
 */
export const deleteDocument = async (collectionName, documentId) => {
  try {
    const docRef = db.collection(collectionName).doc(documentId);
    await docRef.delete();
    return true;
  } catch (error) {
    console.error(`خطأ في حذف وثيقة ${documentId} من مجموعة ${collectionName}:`, error);
    throw error;
  }
}; 