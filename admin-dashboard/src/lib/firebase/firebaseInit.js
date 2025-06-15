const { db, storage } = require('./config');
const admin = require('firebase-admin');

/**
 * وظيفة لرفع صورة إلى Firebase Storage
 * @param {File} file - ملف الصورة
 * @param {string} path - المسار في Firebase Storage
 * @returns {Promise<string>} - رابط URL للصورة
 */
const uploadImage = async (file, path) => {
  try {
    const fileRef = storageRef(storage.bucket(), path);
    const [uploadedFile] = await fileRef.save(file.buffer, {
      contentType: file.mimetype,
      metadata: {
        contentType: file.mimetype,
        firebaseStorageDownloadTokens: Date.now().toString()
      }
    });
    
    const downloadURL = await fileRef.getSignedUrl({
      action: 'read',
      expires: '01-01-2500'
    });
    
    return downloadURL[0];
  } catch (error) {
    console.error('خطأ في رفع الصورة:', error);
    throw error;
  }
};

/**
 * وظيفة لتحديث المخزون عند تأكيد الطلب
 * @param {string} orderId - معرف الطلب
 */
const updateInventoryOnOrderConfirmation = async (orderId) => {
  try {
    // الحصول على بيانات الطلب
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (!orderSnap.exists) {
      throw new Error(`الطلب برقم ${orderId} غير موجود`);
    }
    
    const orderData = orderSnap.data();
    
    // التحقق من أن الطلب تم تأكيده
    if (orderData.status !== 'confirmed' && orderData.status !== 'مؤكد') {
      console.log(`لم يتم تحديث المخزون لأن الطلب برقم ${orderId} ليس مؤكداً`);
      return;
    }
    
    // لكل عنصر في الطلب
    for (const item of orderData.items) {
      // الحصول على بيانات عنصر القائمة
      const menuItemRef = doc(db, 'menuItems', item.menuItemId);
      const menuItemSnap = await getDoc(menuItemRef);
      
      if (menuItemSnap.exists) {
        const menuItemData = menuItemSnap.data();
        
        // لكل عنصر مخزون مرتبط بعنصر القائمة
        if (menuItemData.ingredientsList && menuItemData.ingredientsList.length > 0) {
          for (const ingredient of menuItemData.ingredientsList) {
            // تحديث المخزون
            const inventoryRef = doc(db, 'inventory', ingredient.inventoryItemId);
            const inventorySnap = await getDoc(inventoryRef);
            
            if (inventorySnap.exists) {
              const inventoryData = inventorySnap.data();
              const quantityToDeduct = ingredient.quantity * item.quantity;
              
              // التحقق من توفر الكمية الكافية
              if (inventoryData.quantity >= quantityToDeduct) {
                // خصم الكمية من المخزون
                await updateDoc(inventoryRef, {
                  quantity: increment(-quantityToDeduct),
                  updatedAt: serverTimestamp()
                });
                
                // إضافة معاملة مخزون
                const transactionRef = doc(collection(db, 'inventoryTransactions'));
                await setDoc(transactionRef, {
                  inventoryItemId: ingredient.inventoryItemId,
                  type: 'out',
                  quantity: quantityToDeduct,
                  reason: `استخدام في الطلب #${orderData.orderNumber}`,
                  previousQuantity: inventoryData.quantity,
                  newQuantity: inventoryData.quantity - quantityToDeduct,
                  orderId: orderId,
                  performedBy: 'system',
                  timestamp: serverTimestamp()
                });
                
                console.log(`تم خصم ${quantityToDeduct} ${inventoryData.unit} من ${inventoryData.name}`);
                
                // تحديث حالة المخزون إذا انخفض عن الحد الأدنى
                if ((inventoryData.quantity - quantityToDeduct) <= inventoryData.threshold && 
                    (inventoryData.quantity - quantityToDeduct) > 0) {
                  await updateDoc(inventoryRef, {
                    status: 'Low Stock',
                    updatedAt: serverTimestamp()
                  });
                  
                  // إضافة إشعار للمسؤولين
                  const notificationRef = doc(collection(db, 'notifications'));
                  await setDoc(notificationRef, {
                    type: 'inventory',
                    title: 'تنبيه مخزون منخفض',
                    message: `مستوى المخزون لـ ${inventoryData.name} أصبح منخفضاً (${inventoryData.quantity - quantityToDeduct} ${inventoryData.unit})`,
                    isRead: false,
                    inventoryItemId: ingredient.inventoryItemId,
                    createdAt: serverTimestamp()
                  });
                } 
                else if ((inventoryData.quantity - quantityToDeduct) <= 0) {
                  await updateDoc(inventoryRef, {
                    status: 'Out of Stock',
                    updatedAt: serverTimestamp()
                  });
                  
                  // إضافة إشعار للمسؤولين
                  const notificationRef = doc(collection(db, 'notifications'));
                  await setDoc(notificationRef, {
                    type: 'inventory',
                    title: 'تنبيه نفاد المخزون',
                    message: `نفذت كمية ${inventoryData.name} من المخزون`,
                    isRead: false,
                    inventoryItemId: ingredient.inventoryItemId,
                    createdAt: serverTimestamp()
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
    await updateDoc(orderRef, {
      inventoryUpdated: true,
      updatedAt: serverTimestamp()
    });
    
    console.log(`✅ تم تحديث المخزون للطلب رقم ${orderId}`);
    return true;
  } catch (error) {
    console.error('❌ خطأ في تحديث المخزون:', error);
    return false;
  }
};

/**
 * دالة لتهيئة قاعدة بيانات Firebase
 * تركز على المستخدمين العملاء فقط وتضيف مجموعات الإشعارات والتقارير
 */
const initializeFirebaseDatabase = async () => {
  console.log('🔥 جاري تهيئة قاعدة بيانات Firebase...');

  try {
    // إنشاء مجموعة المستخدمين (العملاء فقط)
    const usersCollection = collection(db, 'users');
    
    // إضافة بيانات المستخدمين العملاء
    const customerUsers = [
      {
        id: 'customer-1',
        name: 'فاطمة حسن',
        email: 'fatima.hassan@example.com',
        phone: '01512345678',
        role: 'Customer',
        address: 'القاهرة، مصر',
        photoURL: null, // سيتم رفع الصورة لاحقاً
        orders: [], // مرجع للطلبات المرتبطة بهذا المستخدم
        favorites: [], // عناصر القائمة المفضلة
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: 'customer-2',
        name: 'خالد إبراهيم',
        email: 'khaled.ibrahim@example.com',
        phone: '01612345678',
        role: 'Customer',
        address: 'الإسكندرية، مصر',
        photoURL: null,
        orders: [],
        favorites: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: 'customer-3',
        name: 'منى سعيد',
        email: 'mona.saeed@example.com',
        phone: '01712345678',
        role: 'Customer',
        address: 'المنصورة، مصر',
        photoURL: null,
        orders: [],
        favorites: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];

    // إضافة المستخدمين العملاء إلى قاعدة البيانات
    for (const user of customerUsers) {
      await setDoc(doc(usersCollection, user.id), user);
    }
    console.log(`✅ تم إضافة ${customerUsers.length} من المستخدمين العملاء`);

    // إنشاء مجموعة عناصر المخزون
    const inventoryCollection = collection(db, 'inventory');
    
    // إضافة بيانات المخزون
    const inventoryItems = [
      {
        id: 'inventory-1',
        name: 'دقيق القمح',
        description: 'دقيق قمح فاخر درجة أولى',
        category: 'مواد جافة',
        sku: 'FLR-001',
        barcode: '6001234567890',
        quantity: 50,
        unit: 'كجم',
        unitCost: 8.5,
        costPerUnit: 8.5,
        totalCost: 425,
        reorderPoint: 15,
        threshold: 20,
        reorderQuantity: 50,
        location: 'مخزن المواد الجافة، الرف 1',
        supplier: 'supplier-1',
        status: 'متوفر',
        photoURL: null, // سيتم رفع الصورة لاحقاً
        menuItems: [], // سيتم ملؤها تلقائيًا
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: 'inventory-2',
        name: 'صدور دجاج',
        description: 'صدور دجاج طازجة محلية',
        category: 'لحوم',
        sku: 'CHK-001',
        barcode: '6001234567891',
        quantity: 15,
        unit: 'كجم',
        unitCost: 55.0,
        costPerUnit: 55.0,
        totalCost: 825,
        reorderPoint: 10,
        threshold: 12,
        reorderQuantity: 20,
        location: 'ثلاجة اللحوم، الرف 2',
        supplier: 'supplier-2',
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'متوفر',
        photoURL: null,
        menuItems: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: 'inventory-3',
        name: 'جبن موزاريلا',
        description: 'جبن موزاريلا إيطالية الصنع',
        category: 'ألبان',
        sku: 'CHS-001',
        barcode: '6001234567893',
        quantity: 12,
        unit: 'كجم',
        unitCost: 80.0,
        costPerUnit: 80.0,
        totalCost: 960,
        reorderPoint: 8,
        threshold: 10,
        reorderQuantity: 15,
        location: 'ثلاجة الألبان، الرف 3',
        supplier: 'supplier-1',
        expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'متوفر',
        photoURL: null,
        menuItems: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];

    // إضافة عناصر المخزون إلى قاعدة البيانات
    for (const item of inventoryItems) {
      await setDoc(doc(inventoryCollection, item.id), item);
    }
    console.log(`✅ تم إضافة ${inventoryItems.length} من عناصر المخزون`);

    // إنشاء مجموعة عناصر القائمة
    const menuItemsCollection = collection(db, 'menuItems');
    
    // إضافة بيانات عناصر القائمة مع ربطها بالمخزون
    const menuItems = [
      {
        id: 'menu-1',
        name: 'برجر لحم كلاسيك',
        description: 'برجر لحم بقري طازج مع الخضروات والصلصة الخاصة',
        price: 85.0,
        photoURL: null, // سيتم رفع الصورة لاحقاً
        category: 'برجر',
        nutritionalInfo: {
          calories: 650,
          protein: 35,
          carbs: 40,
          fat: 35,
          ingredients: ['لحم بقري', 'خبز برجر', 'جبن شيدر', 'خس', 'طماطم', 'صلصة خاصة'],
          allergens: ['جلوتين', 'ألبان']
        },
        isAvailable: true,
        // قائمة المكونات مع الكميات المطلوبة لكل وحدة من هذا العنصر
        ingredientsList: [
          {
            inventoryItemId: 'inventory-2', // صدور دجاج
            name: 'صدور دجاج',
            quantity: 0.25, // 250 جرام لكل برجر
            unit: 'كجم'
          }
        ],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: 'menu-2',
        name: 'بيتزا مارجريتا',
        description: 'بيتزا كلاسيكية مع صلصة الطماطم وجبن الموزاريلا والريحان',
        price: 120.0,
        photoURL: null,
        category: 'بيتزا',
        nutritionalInfo: {
          calories: 850,
          protein: 35,
          carbs: 90,
          fat: 40,
          ingredients: ['عجينة بيتزا', 'صلصة طماطم', 'جبن موزاريلا', 'ريحان طازج', 'زيت زيتون'],
          allergens: ['جلوتين', 'ألبان']
        },
        isAvailable: true,
        ingredientsList: [
          {
            inventoryItemId: 'inventory-1', // دقيق القمح
            name: 'دقيق القمح',
            quantity: 0.3, // 300 جرام لكل بيتزا
            unit: 'كجم'
          },
          {
            inventoryItemId: 'inventory-3', // جبن موزاريلا
            name: 'جبن موزاريلا',
            quantity: 0.2, // 200 جرام لكل بيتزا
            unit: 'كجم'
          }
        ],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];

    // إضافة عناصر القائمة إلى قاعدة البيانات وتحديث روابط المخزون
    for (const menuItem of menuItems) {
      await setDoc(doc(menuItemsCollection, menuItem.id), menuItem);
      
      // تحديث مراجع عناصر القائمة في وثائق المخزون
      if (menuItem.ingredientsList && menuItem.ingredientsList.length > 0) {
        for (const ingredient of menuItem.ingredientsList) {
          const inventoryRef = doc(db, 'inventory', ingredient.inventoryItemId);
          await updateDoc(inventoryRef, {
            menuItems: arrayUnion(menuItem.id)
          });
        }
      }
    }
    console.log(`✅ تم إضافة ${menuItems.length} من عناصر القائمة وربطها بالمخزون`);

    // إنشاء مجموعة الطلبات
    const ordersCollection = collection(db, 'orders');
    
    // إضافة بيانات الطلبات
    const orders = [
      {
        id: 'order-1',
        orderNumber: 1001,
        customerId: 'customer-1',
        customerName: 'فاطمة حسن',
        items: [
          {
            menuItemId: 'menu-1',
            name: 'برجر لحم كلاسيك',
            price: 85.0,
            quantity: 2
          },
          {
            menuItemId: 'menu-2',
            name: 'بيتزا مارجريتا',
            price: 120.0,
            quantity: 1
          }
        ],
        status: 'pending', // لم يتم تأكيد الطلب بعد
        total: 290,
        totalAmount: 290,
        tax: 30,
        deliveryFee: 15,
        paymentMethod: 'نقدي',
        paymentStatus: 'pending',
        inventoryUpdated: false, // لم يتم تحديث المخزون بعد
        deliveryAddress: {
          streetAddress: 'شارع النصر، مدينة نصر',
          city: 'القاهرة',
          state: 'مصر',
          zipCode: '11371'
        },
        deliveryNotes: 'الشقة في الطابق الثالث',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: 'order-2',
        orderNumber: 1002,
        customerId: 'customer-2',
        customerName: 'خالد إبراهيم',
        items: [
          {
            menuItemId: 'menu-2',
            name: 'بيتزا مارجريتا',
            price: 120.0,
            quantity: 1
          }
        ],
        status: 'confirmed', // تم تأكيد الطلب
        total: 120,
        totalAmount: 120,
        tax: 15,
        deliveryFee: 15,
        paymentMethod: 'بطاقة ائتمان',
        paymentStatus: 'paid',
        inventoryUpdated: true, // تم تحديث المخزون
        deliveryAddress: {
          streetAddress: 'شارع كليوباترا، سيدي جابر',
          city: 'الإسكندرية',
          state: 'مصر',
          zipCode: '21523'
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];

    // إضافة الطلبات إلى قاعدة البيانات
    for (const order of orders) {
      await setDoc(doc(ordersCollection, order.id), order);
      
      // تحديث مراجع الطلبات في وثيقة المستخدم
      const userRef = doc(db, 'users', order.customerId);
      await updateDoc(userRef, {
        orders: arrayUnion(order.id)
      });
    }
    console.log(`✅ تم إضافة ${orders.length} من الطلبات`);

    // إنشاء مجموعة الإشعارات
    const notificationsCollection = collection(db, 'notifications');
    
    // إضافة بيانات الإشعارات
    const notifications = [
      {
        id: 'notification-1',
        userId: 'customer-1',
        type: 'طلب',
        title: 'تم استلام طلبك',
        message: 'تم استلام طلبك رقم #1001 وهو قيد المراجعة',
        isRead: true,
        orderId: 'order-1',
        createdAt: serverTimestamp()
      },
      {
        id: 'notification-2',
        userId: 'customer-2',
        type: 'طلب',
        title: 'تم تأكيد طلبك',
        message: 'تم تأكيد طلبك رقم #1002 وهو قيد التحضير الآن',
        isRead: false,
        orderId: 'order-2',
        createdAt: serverTimestamp()
      }
    ];

    // إضافة الإشعارات إلى قاعدة البيانات
    for (const notification of notifications) {
      await setDoc(doc(notificationsCollection, notification.id), notification);
    }
    console.log(`✅ تم إضافة ${notifications.length} من الإشعارات`);
    
    // إنشاء مجموعة معاملات المخزون
    const inventoryTransactionsCollection = collection(db, 'inventoryTransactions');
    
    // إضافة بيانات معاملات المخزون
    const transactions = [
      {
        id: 'trans-1',
        inventoryItemId: 'inventory-1', // دقيق القمح
        type: 'in', // إضافة للمخزون
        quantity: 50,
        reason: 'استلام مخزون',
        previousQuantity: 0,
        newQuantity: 50,
        cost: 425,
        performedBy: 'system',
        timestamp: serverTimestamp()
      },
      {
        id: 'trans-2',
        inventoryItemId: 'inventory-3', // جبن موزاريلا
        type: 'out', // خصم من المخزون
        quantity: 0.2,
        reason: 'استخدام في الطلب #1002',
        previousQuantity: 12.2,
        newQuantity: 12,
        orderId: 'order-2',
        performedBy: 'system',
        timestamp: serverTimestamp()
      }
    ];
    
    // إضافة معاملات المخزون إلى قاعدة البيانات
    for (const transaction of transactions) {
      await setDoc(doc(inventoryTransactionsCollection, transaction.id), transaction);
    }
    console.log(`✅ تم إضافة ${transactions.length} من معاملات المخزون`);

    // إنشاء مجموعة التقارير
    const reportsCollection = collection(db, 'reports');
    
    // إضافة تقارير دورية للنظام
    const reports = [
      {
        id: 'report-1',
        type: 'inventory',
        title: 'تقرير المخزون',
        period: 'أسبوعي',
        date: new Date().toISOString(),
        data: {
          totalItems: 3,
          lowStockItems: 0,
          outOfStockItems: 0,
          totalValue: 2210,
          mostUsedItems: [
            { inventoryId: 'inventory-3', name: 'جبن موزاريلا', usageCount: 1 }
          ]
        },
        createdAt: serverTimestamp()
      }
    ];

    // إضافة التقارير إلى قاعدة البيانات
    for (const report of reports) {
      await setDoc(doc(reportsCollection, report.id), report);
    }
    console.log(`✅ تم إضافة ${reports.length} من التقارير`);

    console.log('✅ تم تهيئة قاعدة بيانات Firebase بنجاح');
    return true;
  } catch (error) {
    console.error('❌ حدث خطأ أثناء تهيئة قاعدة البيانات:', error);
    return false;
  }
};

// تصدير الدوال باستخدام نظام CommonJS
module.exports = {
  uploadImage,
  updateInventoryOnOrderConfirmation,
  initializeFirebaseDatabase
};
