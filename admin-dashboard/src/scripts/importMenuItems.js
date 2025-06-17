// سكربت استيراد الوجبات من ملف JSON ورفعها إلى Firebase
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// تهيئة Firebase Admin SDK
// استخدام البيانات من ملف .env.local
const firebaseConfig = {
  type: "service_account",
  project_id: "application-63412",
  private_key_id: "459e7b84cf01b8c421740476bf0eb52890614f9f",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDHoZEWlgfbgkc7\nSVp1MQYQ8khZAzBAntuTt1HCRH+I6mUrjNvuKS/b/yWPQZWei6g2suSqTV37SJ0z\npC5GPEpRVvnlZia34KgNtpH/5XP0Ce1L/gP1R487VnE0pEvukUmBofkVqVpJY99T\nxToz/PJ9EVm6oYBCPz/pEJqP2yUY4baSYyJxsyoiyTh/XmnFJzYCKTmtpU8W2O2+\nkElfIh0OC5pnaNM6UHnxmDSsJ+qaCRn/N1yH5Bp461BsmLEGFPFgHOk8Rb2jT5wc\n6BLG5THRD7kyorLdZk1eRJFZpr5IQjOpqhanjX9IQ2tFjQvnl3wZcCiD3TdcrGWs\n8BMWUPFlAgMBAAECggEADCXUwl8W01C2LPFlw8Pb7qQPqvr6sLP6AJ8jJoMsj5RT\n27aSm4d+FhEMpA8Fn8Q31DxGleZnVacxibbv6e45R4HXaxIwQPg2wb7eW4gG6k7A\nVeN7Mi3MlXvJH77vr/C/XFgS5DKN//FH4b0asZcu2lV39FdniqB2ryQHg8F+HGlk\nOIfYLFwtX6XkmKNDN3Awg2kUQQujgGXt+wSzfp42JfTGpAkyUaVmBNKNJ36nhtl8\npX1b8ibjj4xHsnJvpiPyvVuflB/X8cfy4SNYDoyCeXxB3jwxJH30a0BBb4FohVW+\nAsM9MJJaPq+NKFbOPl3n/XfpYoPmgcp8Ti+x8QTYgQKBgQDu+BkPcWQUWx/7bEur\nhsUgOna1EXpyJ6cg1R4HYBD9k05s4NQBogiQxz5AnwGHVcll84nowCs572CF9K0K\nTW6Dqi6cFPCRTvJOCDMO7z7qAEbnt7T1eCNe7tXW4alHrfueK3pZlyv7j0jGXrjK\nK4eXKEmouus1KnXTlj36RJTgeQKBgQDV28L3xTqwXes2fifOwqhxeQX9aZcvWvI5\nuL6dMYqGsLrUHhYUbe6ThLKrQQejXNVuyIgg3+7yGRZEAKRkLkbaf1gH14Ok6EVi\nCglqbdLkkvv1AuJ7XJbWOLJ4wDd933Vbr+t0A7s0DqADqC316YA1WetCQtQoWKo9\nT7Lb6zuVTQKBgQDROPCf/7QSynGm7HsX80f13pn+EA53kdYWveCrrmVRzj30v6d+\nwoHjWD5dz5lEB0zscRyGZnGyKK4GumEiSwb+SerDBuZVIpysyysA4WDg+VsbF1Fd\nNVEqlcstdqeCNYa+Rey6Mcv1VM7vtxDtGM1+/2v2SakTBFji5oDe9FqwaQKBgCOn\nRbPlD8nDfqlREvXnggmY8aSz696bPPLel/jA/6VA5YTjly7EvRee8eKXLtzPZ03W\n5MsGSmHWSN4BdWa2SF25CUYVaf8eMiMMJVG3CYfN8W+BkZybbRI91ZNICHhVvs0Q\nYSKwVI9zOL4jVbY/vX4nhY9AcPpg/dDG7ry3VPGpAoGBAJGJXmr4pLRZbgINWYd0\nvEcAnKY/C1i3TDqGl15cjCfM5Mmx8TpetXlAz2Ke6MSB3CSW0v6pGVEHhA5Kir7U\nJRnU2Bl0hkpGDx14dRjEqpMPsXXOinPi1WxzcCszftrkLMExGOUfVpDi0b9sWlCZ\njvhUuWXxEflPuLAg+Lb6h4Gx\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
  client_email: "firebase-adminsdk-fbsvc@application-63412.iam.gserviceaccount.com",
  client_id: "109284832433198895331",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40application-63412.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// تهيئة Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig)
  });
  console.log('✅ تم تهيئة Firebase Admin بنجاح');
}

const db = admin.firestore();

/**
 * قراءة ملف JSON
 * @param {string} filePath - مسار الملف
 */
function readJsonFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('❌ خطأ في قراءة ملف JSON:', error.message);
    return null;
  }
}

/**
 * رفع عناصر القائمة إلى Firebase
 * @param {Object} menuData - بيانات القائمة
 */
async function uploadMenuItems(menuData) {
  try {
    if (!menuData || !menuData.meals || !Array.isArray(menuData.meals)) {
      console.error('❌ بنية البيانات غير صالحة');
      return false;
    }

    // رفع معلومات القائمة
    await db.collection('menuInfo').doc('details').set({
      title: menuData.menu_title || 'Healthy Menu',
      footer: menuData.footer || '',
      totalMeals: menuData.meals.length,
      measurementSystem: menuData.measurement_system || 'grams',
      nutritionNotes: menuData.nutrition_notes || '',
      updatedAt: new Date()
    });
    console.log('✅ تم رفع معلومات القائمة بنجاح');

    // رفع عناصر الوجبات (استخدام النمط التتابعي للتبسيط)
    console.log(`🔄 جاري رفع ${menuData.meals.length} وجبة...`);
    
    for (let i = 0; i < menuData.meals.length; i++) {
      const meal = menuData.meals[i];
      const docRef = db.collection('menuItems').doc();
      
      await docRef.set({
        name: meal.name,
        category: meal.category || 'other',
        calories: meal.calories || 0,
        protein: meal.protein || 0,
        carbs: meal.carbs || 0,
        ingredients: meal.ingredients || [],
        createdAt: new Date(),
        id: docRef.id
      });
      
      console.log(`✅ (${i + 1}/${menuData.meals.length}) تم رفع: ${meal.name}`);
    }
    
    console.log(`✅ تم رفع جميع الوجبات بنجاح (${menuData.meals.length} وجبة)`);
    return true;
  } catch (error) {
    console.error('❌ حدث خطأ أثناء رفع البيانات:', error);
    
    // مساعدة في تشخيص مشكلة المصادقة
    if (error.message && error.message.includes('UNAUTHENTICATED')) {
      console.error(`
      🔑 مشكلة في المصادقة: تأكد من:
      1. صحة بيانات اعتماد Firebase Admin SDK
      2. تطابق معرف المشروع مع مشروع Firebase الخاص بك
      3. أن لديك الصلاحيات المناسبة للكتابة في قاعدة البيانات
      `);
    }
    
    return false;
  }
}

/**
 * الوظيفة الرئيسية للسكربت
 */
async function main() {
  // التحقق من وسيطات سطر الأوامر للحصول على مسار الملف
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('❌ يرجى تحديد مسار ملف JSON للوجبات');
    console.log('استخدام: node importMenuItems.js <path-to-json-file>');
    return;
  }
  
  const filePath = args[0];
  console.log(`🔄 قراءة البيانات من الملف: ${filePath}`);
  
  // قراءة الملف
  const menuData = readJsonFile(filePath);
  
  if (!menuData) {
    console.error('❌ فشل قراءة ملف البيانات');
    return;
  }
  
  console.log(`📋 تم العثور على ${menuData.meals ? menuData.meals.length : 0} وجبة في الملف`);
  
  // رفع البيانات
  const success = await uploadMenuItems(menuData);
  
  if (success) {
    console.log('✅ تمت العملية بنجاح!');
  } else {
    console.error('❌ فشلت العملية');
  }
}

// تنفيذ السكربت
main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ حدث خطأ غير متوقع:', err);
    process.exit(1);
  });

/**
 * كيفية استخدام السكربت:
 * 
 * 1. حفظ بيانات الوجبات في ملف JSON (مثال: menu-data.json)
 * 2. تشغيل السكربت مع مسار الملف:
 * 
 * node src/scripts/importMenuItems.js ./menu-data.json
 */ 