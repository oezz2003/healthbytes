import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDate, formatCurrency } from './format';

// دمج فئات Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// تصدير وظائف التنسيق
export { formatDate, formatCurrency };

// ... existing code ... 