// نقطة نهاية API لرفع بيانات القائمة إلى مجموعة menuItems في Firebase
import { db } from '../../lib/firebase/adminApi';

export default async function handler(req, res) {
  // فقط طلبات POST مسموحة
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { menuData } = req.body;

    if (!menuData || !menuData.meals || !Array.isArray(menuData.meals)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid data format. Expected menuData object with meals array' 
      });
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

    // رفع عناصر الوجبات
    const batch = db.batch();
    let successCount = 0;
    
    // استخدام الدفعات لتحسين الأداء
    for (let i = 0; i < menuData.meals.length; i++) {
      const meal = menuData.meals[i];
      const docRef = db.collection('menuItems').doc();
      
      batch.set(docRef, {
        name: meal.name,
        category: meal.category || 'other',
        calories: meal.calories || 0,
        protein: meal.protein || 0,
        carbs: meal.carbs || 0,
        ingredients: meal.ingredients || [],
        createdAt: new Date(),
        id: docRef.id
      });
      
      successCount++;
    }
    
    // تنفيذ جميع العمليات
    await batch.commit();
    
    // إرسال استجابة نجاح
    return res.status(200).json({ 
      success: true, 
      message: `Successfully uploaded ${successCount} menu items`,
      count: successCount
    });

  } catch (error) {
    console.error('Error uploading menu items:', error);
    
    // معالجة خاصة لأخطاء المصادقة
    if (error.code === 16 || (error.message && error.message.includes('UNAUTHENTICATED'))) {
      return res.status(401).json({ 
        success: false, 
        error: 'Firebase authentication failed. Please check your service account credentials.' 
      });
    }
    
    // معالجة الأخطاء الأخرى
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Error uploading menu data'
    });
  }
} 