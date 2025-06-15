import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Helper function to efficiently merge Tailwind CSS classes
 * Uses clsx and tailwind-merge libraries
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency amounts
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string | number): string {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Format date only
 */
export function formatDate(date: Date | string | number): string {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Format time only
 */
export function formatTime(date: Date | string | number): string {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Truncate text if longer than specified limit
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Convert text to slug format
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
} 
 
 
 
 