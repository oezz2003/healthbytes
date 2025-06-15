/**
 * سكريبت لتفعيل إنشاء قواعد البيانات على Firebase
 * يستخدم Admin SDK وينفذ عملية التهيئة
 */

// استيراد دالة التهيئة من الملف الصحيح
const firebaseInit = require('../lib/firebase/firebaseInit');

// تنفيذ العملية
(async () => {
  console.log('🚀 بدء تهيئة قاعدة بيانات Firebase...');
  
  try {
    // تنفيذ عملية التهيئة
    const result = await firebaseInit.initializeFirebaseDatabase();
    
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