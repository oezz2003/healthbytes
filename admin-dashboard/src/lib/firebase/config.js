// ملف يوفر واجهة Firebase Admin SDK
let db;
let auth;
let storage;

// استخدام Firebase Admin فقط على الخادم
if (typeof window === 'undefined') {
  // استيراد ديناميكي لـ firebase-admin (فقط على الخادم)
  const admin = require('firebase-admin');
  const adminConfig = require('./adminConfig');

  console.log("🔄 تهيئة Firebase Admin SDK");

  // تهيئة Firebase Admin SDK إذا لم تكن مهيأة بالفعل
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(adminConfig)
    });
  }

  // واجهة Firestore
  db = admin.firestore();

  // واجهة المصادقة
  auth = admin.auth();

  // واجهة التخزين
  storage = admin.storage();

  console.log("✅ تم تهيئة Firebase Admin SDK بنجاح");
} else {
  console.warn("⚠️ محاولة استخدام Firebase Admin في المتصفح. هذا غير مدعوم.");
  // توفير كائنات وهمية للمتصفح لتجنب الأخطاء
  db = {
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: false, data: () => ({}) }),
        set: async () => {},
        update: async () => {}
      }),
      where: () => ({ get: async () => ({ forEach: () => {} }) }),
      limit: () => ({ get: async () => ({ forEach: () => {} }) }),
      get: async () => ({ forEach: () => {} }),
      add: async () => ({ id: 'mock-id' })
    })
  };
  
  auth = {
    verifyIdToken: async () => ({ uid: 'mock-uid' })
  };
  
  storage = {
    bucket: () => ({
      file: () => ({
        save: async () => {},
        getSignedUrl: async () => ['https://example.com/mock-url']
      })
    })
  };
}

export {
  db,
  auth,
  storage
}; 