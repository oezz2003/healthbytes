// تنسيق التاريخ
export const formatDate = (dateInput: any): string => {
  if (!dateInput) return 'غير متوفر';
  
  try {
    // التعامل مع كائنات Firestore Timestamp
    if (dateInput && typeof dateInput === 'object' && dateInput.toDate && typeof dateInput.toDate === 'function') {
      return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(dateInput.toDate());
    }
    
    // التعامل مع النصوص
    if (typeof dateInput === 'string') {
      // محاولة إنشاء كائن تاريخ من النص
      const date = new Date(dateInput);
      if (!isNaN(date.getTime())) {
        return new Intl.DateTimeFormat('ar-EG', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(date);
      }
      // إذا فشل التحويل، إرجاع النص كما هو
      return dateInput;
    }
    
    // التعامل مع كائنات التاريخ
    if (dateInput instanceof Date) {
      if (!isNaN(dateInput.getTime())) {
        return new Intl.DateTimeFormat('ar-EG', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(dateInput);
      }
    }
    
    // التعامل مع الأرقام (timestamps)
    if (typeof dateInput === 'number') {
      const date = new Date(dateInput);
      return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    }
    
    // إذا وصلنا إلى هنا، فإن نوع البيانات غير معروف أو غير صالح
    console.log('نوع تاريخ غير معروف:', typeof dateInput, dateInput);
    return 'تاريخ غير صالح';
  } catch (error) {
    console.error('خطأ في تنسيق التاريخ:', error, 'القيمة:', dateInput);
    return 'تاريخ غير صالح';
  }
};

// تنسيق العملة
export const formatCurrency = (amount: number): string => {
  if (isNaN(amount)) return '0.00';
  
  try {
    return new Intl.NumberFormat('ar-EG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error('خطأ في تنسيق العملة:', error);
    return amount.toFixed(2);
  }
}; 