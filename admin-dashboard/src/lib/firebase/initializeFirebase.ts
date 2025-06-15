import { initializeDatabase } from '../utils/seedData';

/**
 * دالة لتهيئة Firebase واستخدام البيانات المترابطة
 * يمكن استدعاء هذه الدالة عند بدء تشغيل التطبيق
 */
const initializeFirebase = async () => {
  console.log('🔥 جاري تهيئة Firebase...');

  try {
    // تهيئة البيانات
    await initializeDatabase();
    
    console.log('✅ تم تهيئة Firebase بنجاح');
    return true;
  } catch (error) {
    console.error('❌ حدث خطأ أثناء تهيئة Firebase:', error);
    return false;
  }
};

export default initializeFirebase; 
 
 
 
 