// ملف يوفر واجهة Firebase Admin SDK
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
const db = admin.firestore();

// واجهة المصادقة
const auth = admin.auth();

// واجهة التخزين
const storage = admin.storage();

console.log("✅ تم تهيئة Firebase Admin SDK بنجاح"); 

module.exports = {
  db,
  auth,
  storage
}; 