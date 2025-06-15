'use client';

import { useState } from 'react';
import ImageUploader from '../../../components/ImageUploader';

/**
 * صفحة مثال لرفع الصور إلى Firebase Storage
 */
export default function ImageUploadExample() {
  const [userImage, setUserImage] = useState('');
  const [menuItemImage, setMenuItemImage] = useState('');
  const [inventoryImage, setInventoryImage] = useState('');

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">مثال على رفع الصور إلى Firebase Storage</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* رفع صورة المستخدم */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">صورة المستخدم</h2>
          <ImageUploader
            folder="users"
            onUploadComplete={(url) => setUserImage(url)}
          />
          {userImage && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">تم رفع الصورة بنجاح:</p>
              <div className="bg-gray-100 p-2 rounded text-xs break-all">
                {userImage}
              </div>
            </div>
          )}
        </div>

        {/* رفع صورة عنصر القائمة */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">صورة عنصر القائمة</h2>
          <ImageUploader
            folder="menu-items"
            onUploadComplete={(url) => setMenuItemImage(url)}
          />
          {menuItemImage && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">تم رفع الصورة بنجاح:</p>
              <div className="bg-gray-100 p-2 rounded text-xs break-all">
                {menuItemImage}
              </div>
            </div>
          )}
        </div>

        {/* رفع صورة عنصر المخزون */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">صورة عنصر المخزون</h2>
          <ImageUploader
            folder="inventory"
            onUploadComplete={(url) => setInventoryImage(url)}
          />
          {inventoryImage && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">تم رفع الصورة بنجاح:</p>
              <div className="bg-gray-100 p-2 rounded text-xs break-all">
                {inventoryImage}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 