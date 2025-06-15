const admin = require('firebase-admin');
const adminConfig = require('../lib/firebase/adminConfig');

// تهيئة Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig)
  });
}

const db = admin.firestore();

/**
 * دالة لتهيئة قاعدة بيانات Firebase
 */
const initializeFirebaseDatabase = async () => {
  console.log('🔥 جاري تهيئة قاعدة بيانات Firebase...');

  try {
    // إنشاء مجموعة المستخدمين (العملاء فقط)
    const usersCollection = db.collection('users');
    
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
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
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
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
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
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    ];

    // إضافة المستخدمين العملاء إلى قاعدة البيانات
    for (const user of customerUsers) {
      await usersCollection.doc(user.id).set(user);
    }
    console.log(`✅ تم إضافة ${customerUsers.length} من المستخدمين العملاء`);

    // إنشاء مجموعة عناصر المخزون
    const inventoryCollection = db.collection('inventory');
    
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
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
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
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
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
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    ];

    // إضافة عناصر المخزون إلى قاعدة البيانات
    for (const item of inventoryItems) {
      await inventoryCollection.doc(item.id).set(item);
    }
    console.log(`✅ تم إضافة ${inventoryItems.length} من عناصر المخزون`);

    // إنشاء مجموعة عناصر القائمة
    const menuItemsCollection = db.collection('menuItems');
    
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
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
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
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    ];

    // إضافة عناصر القائمة إلى قاعدة البيانات وتحديث روابط المخزون
    for (const menuItem of menuItems) {
      await menuItemsCollection.doc(menuItem.id).set(menuItem);
      
      // تحديث مراجع عناصر القائمة في وثائق المخزون
      if (menuItem.ingredientsList && menuItem.ingredientsList.length > 0) {
        for (const ingredient of menuItem.ingredientsList) {
          const inventoryRef = inventoryCollection.doc(ingredient.inventoryItemId);
          await inventoryRef.update({
            menuItems: admin.firestore.FieldValue.arrayUnion(menuItem.id)
          });
        }
      }
    }
    console.log(`✅ تم إضافة ${menuItems.length} من عناصر القائمة وربطها بالمخزون`);

    // إنشاء مجموعة الطلبات
    const ordersCollection = db.collection('orders');
    
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
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
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
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    ];

    // إضافة الطلبات إلى قاعدة البيانات
    for (const order of orders) {
      await ordersCollection.doc(order.id).set(order);
      
      // تحديث مراجع الطلبات في وثيقة المستخدم
      const userRef = usersCollection.doc(order.customerId);
      await userRef.update({
        orders: admin.firestore.FieldValue.arrayUnion(order.id)
      });
    }
    console.log(`✅ تم إضافة ${orders.length} من الطلبات`);

    // إنشاء مجموعة الإشعارات
    const notificationsCollection = db.collection('notifications');
    
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
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      },
      {
        id: 'notification-2',
        userId: 'customer-2',
        type: 'طلب',
        title: 'تم تأكيد طلبك',
        message: 'تم تأكيد طلبك رقم #1002 وهو قيد التحضير الآن',
        isRead: false,
        orderId: 'order-2',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }
    ];

    // إضافة الإشعارات إلى قاعدة البيانات
    for (const notification of notifications) {
      await notificationsCollection.doc(notification.id).set(notification);
    }
    console.log(`✅ تم إضافة ${notifications.length} من الإشعارات`);
    
    // إنشاء مجموعة معاملات المخزون
    const inventoryTransactionsCollection = db.collection('inventoryTransactions');
    
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
        timestamp: admin.firestore.FieldValue.serverTimestamp()
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
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      }
    ];
    
    // إضافة معاملات المخزون إلى قاعدة البيانات
    for (const transaction of transactions) {
      await inventoryTransactionsCollection.doc(transaction.id).set(transaction);
    }
    console.log(`✅ تم إضافة ${transactions.length} من معاملات المخزون`);

    // إنشاء مجموعة التقارير
    const reportsCollection = db.collection('reports');
    
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
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }
    ];

    // إضافة التقارير إلى قاعدة البيانات
    for (const report of reports) {
      await reportsCollection.doc(report.id).set(report);
    }
    console.log(`✅ تم إضافة ${reports.length} من التقارير`);

    console.log('✅ تم تهيئة قاعدة بيانات Firebase بنجاح');
    return true;
  } catch (error) {
    console.error('❌ حدث خطأ أثناء تهيئة قاعدة البيانات:', error);
    return false;
  }
};

// تنفيذ العملية
(async () => {
  console.log('🚀 بدء تهيئة قاعدة بيانات Firebase...');
  
  try {
    // تنفيذ عملية التهيئة
    const result = await initializeFirebaseDatabase();
    
    if (result) {
      console.log('✅ تمت تهيئة قاعدة بيانات Firebase بنجاح!');
      console.log('📊 تم إنشاء مجموعات:');
      console.log('   - users (المستخدمين العملاء)');
      console.log('   - inventory (المخزون)');
      console.log('   - menuItems (عناصر القائمة)');
      console.log('   - orders (الطلبات)');
      console.log('   - notifications (الإشعارات)');
      console.log('   - inventoryTransactions (معاملات المخزون)');
      console.log('   - reports (التقارير)');
    } else {
      console.error('❌ فشلت عملية تهيئة قاعدة البيانات');
    }
  } catch (error) {
    console.error('❌ حدث خطأ أثناء تنفيذ سكريبت التهيئة:', error);
  }
  
  // إنهاء العملية بعد الانتهاء
  process.exit(0);
})(); 