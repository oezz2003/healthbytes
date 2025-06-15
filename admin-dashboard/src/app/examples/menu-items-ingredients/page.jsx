'use client';

import { useState, useEffect } from 'react';
import { getCollection } from '@/lib/firebase/helpers';
import Image from 'next/image';

/**
 * صفحة مثال لعرض قائمة مكونات عناصر القائمة
 */
export default function MenuItemsIngredientsExample() {
  const [menuItems, setMenuItems] = useState([]);
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  // الحصول على عناصر القائمة والمخزون عند تحميل الصفحة
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // الحصول على عناصر القائمة من Firestore
        const menuItemsData = await getCollection('menuItems');
        setMenuItems(menuItemsData);
        
        // الحصول على عناصر المخزون من Firestore
        const inventoryData = await getCollection('inventory');
        
        // تحويل مصفوفة المخزون إلى كائن للبحث السريع
        const inventoryMap = {};
        inventoryData.forEach((item) => {
          inventoryMap[item.id] = item;
        });
        
        setInventory(inventoryMap);
      } catch (err) {
        console.error('خطأ في الحصول على البيانات:', err);
        setError('حدث خطأ أثناء تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // عرض تفاصيل عنصر القائمة
  const showDetails = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  // إغلاق تفاصيل عنصر القائمة
  const closeDetails = () => {
    setSelectedMenuItem(null);
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">قائمة عناصر القائمة والمكونات</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {menuItems.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-gray-500">لا توجد عناصر قائمة متاحة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((menuItem) => (
            <div 
              key={menuItem.id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
              onClick={() => showDetails(menuItem)}
            >
              <div className="relative h-48 w-full">
                {menuItem.photoURL ? (
                  <Image
                    src={menuItem.photoURL}
                    alt={menuItem.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">لا توجد صورة</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{menuItem.name}</h2>
                <p className="text-gray-600 text-sm mb-2">{menuItem.description}</p>
                <p className="text-blue-600 font-bold">{menuItem.price} ج.م</p>
                <div className="mt-3 flex items-center">
                  <span className="text-sm text-gray-500 ml-1">المكونات:</span>
                  <span className="text-sm">
                    {menuItem.ingredientsList && menuItem.ingredientsList.length
                      ? `${menuItem.ingredientsList.length} عنصر`
                      : 'لا توجد مكونات'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* نافذة تفاصيل عنصر القائمة */}
      {selectedMenuItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{selectedMenuItem.name}</h2>
                <button 
                  onClick={closeDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4">
                {selectedMenuItem.photoURL ? (
                  <Image
                    src={selectedMenuItem.photoURL}
                    alt={selectedMenuItem.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">لا توجد صورة</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <p className="text-gray-600">{selectedMenuItem.description}</p>
                <p className="text-blue-600 font-bold mt-2">{selectedMenuItem.price} ج.م</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">المعلومات الغذائية</h3>
                {selectedMenuItem.nutritionalInfo ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-500">السعرات الحرارية:</span> {selectedMenuItem.nutritionalInfo.calories}
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-500">البروتين:</span> {selectedMenuItem.nutritionalInfo.protein}غ
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-500">الكربوهيدرات:</span> {selectedMenuItem.nutritionalInfo.carbs}غ
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-500">الدهون:</span> {selectedMenuItem.nutritionalInfo.fat}غ
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">لا توجد معلومات غذائية متاحة</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">المكونات من المخزون</h3>
                {selectedMenuItem.ingredientsList && selectedMenuItem.ingredientsList.length > 0 ? (
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-right py-2 px-4 border">المكون</th>
                        <th className="text-right py-2 px-4 border">الكمية</th>
                        <th className="text-right py-2 px-4 border">حالة المخزون</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMenuItem.ingredientsList.map((ingredient, index) => {
                        const inventoryItem = inventory[ingredient.inventoryItemId];
                        return (
                          <tr key={index}>
                            <td className="py-2 px-4 border">{ingredient.name}</td>
                            <td className="py-2 px-4 border">
                              {ingredient.quantity} {ingredient.unit}
                            </td>
                            <td className="py-2 px-4 border">
                              {inventoryItem ? (
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    inventoryItem.status === 'Out of Stock'
                                      ? 'bg-red-100 text-red-800'
                                      : inventoryItem.status === 'Low Stock'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-green-100 text-green-800'
                                  }`}
                                >
                                  {inventoryItem.status === 'Out of Stock'
                                    ? 'نفذت الكمية'
                                    : inventoryItem.status === 'Low Stock'
                                    ? 'كمية منخفضة'
                                    : 'متوفر'}
                                  {inventoryItem.status !== 'Out of Stock' && ` (${inventoryItem.quantity} ${inventoryItem.unit})`}
                                </span>
                              ) : (
                                <span className="text-gray-500">غير متوفر</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">لا توجد مكونات مرتبطة بهذا العنصر</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 