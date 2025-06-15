import { NextResponse } from 'next/server';
import { storage } from '../../../../lib/firebase/config';
import { v4 as uuidv4 } from 'uuid';

/**
 * معالج طلبات رفع الصور إلى Firebase Storage
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'uploads'; // المجلد الافتراضي إذا لم يتم تحديده
    
    if (!file) {
      return NextResponse.json(
        { error: 'لم يتم تقديم ملف للرفع' },
        { status: 400 }
      );
    }

    // استخراج الملف من FormData
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${folder}/${uuidv4()}-${file.name}`;
    const fileRef = storage.bucket().file(filename);
    
    // رفع الملف إلى Firebase Storage
    await fileRef.save(buffer, {
      contentType: file.type,
      metadata: {
        contentType: file.type,
        firebaseStorageDownloadTokens: uuidv4()
      }
    });
    
    // الحصول على رابط التنزيل
    const [url] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '01-01-2500' // تاريخ انتهاء طويل جداً
    });
    
    return NextResponse.json({ success: true, url, path: filename });
  } catch (error) {
    console.error('خطأ في رفع الملف:', error);
    return NextResponse.json(
      { error: 'فشل في رفع الملف', details: error.message },
      { status: 500 }
    );
  }
} 