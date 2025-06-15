'use client';

import { useState } from 'react';
import Image from 'next/image';

/**
 * مكون لرفع الصور إلى Firebase Storage
 * @param {Object} props - خصائص المكون
 * @param {Function} props.onUploadComplete - دالة يتم استدعاؤها بعد اكتمال الرفع مع URL الصورة
 * @param {string} props.folder - مجلد التخزين في Firebase Storage (افتراضي: 'uploads')
 * @param {string} props.defaultImage - رابط الصورة الافتراضية
 */
export default function ImageUploader({ 
  onUploadComplete, 
  folder = 'uploads', 
  defaultImage = '/images/placeholder.svg' 
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(defaultImage);
  const [error, setError] = useState('');

  /**
   * معالجة رفع الصورة
   */
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة صالح');
      return;
    }

    try {
      setIsUploading(true);
      setError('');

      // إنشاء معاينة محلية للصورة
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      // إعداد FormData للرفع
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // رفع الصورة إلى الخادم
      const response = await fetch('/api/firebase/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل في رفع الصورة');
      }

      // استدعاء دالة إكمال الرفع مع رابط الصورة
      if (onUploadComplete) {
        onUploadComplete(data.url);
      }
    } catch (err) {
      console.error('خطأ في رفع الصورة:', err);
      setError(err.message || 'حدث خطأ أثناء رفع الصورة');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 mb-4 border rounded-lg overflow-hidden">
        {previewImage && (
          <Image
            src={previewImage}
            alt="Preview"
            fill
            className="object-cover"
          />
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
            جاري الرفع...
          </div>
        )}
      </div>

      <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors">
        اختر صورة
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleUpload}
          disabled={isUploading}
        />
      </label>

      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  );
} 