import React from 'react';
import { cn } from '@/lib/utils';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
  color?: string;
}

/**
 * Loading spinner component with various size and color options
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  color = 'primary',
}) => {
  // Determine size based on selected option
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };

  // Determine color based on selected option - تحديث الألوان لتتوافق مع النظام الجديد
  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600',
    success: 'border-green-600',
    danger: 'border-red-600',
    warning: 'border-yellow-600',
    info: 'border-blue-600',
    light: 'border-neutral-300',
    dark: 'border-neutral-800',
  };

  // Use cn function to merge classes
  const spinnerClasses = cn(
    'inline-block rounded-full border-solid border-t-transparent animate-spin',
    sizeClasses[size],
    colorClasses[color as keyof typeof colorClasses] || colorClasses.primary,
    className
  );

  return <div className={spinnerClasses} />;
};

export default LoadingSpinner; 
 
 
 
 