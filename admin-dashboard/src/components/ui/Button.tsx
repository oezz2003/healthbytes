import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import LoadingSpinner from './LoadingSpinner';

// تعريف المتغيرات المختلفة للزر باستخدام class-variance-authority
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none shadow-sm',
  {
    variants: {
      variant: {
        primary: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500',
        secondary: 'bg-green-500 text-white hover:bg-green-600 focus-visible:ring-green-400',
        success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
        warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus-visible:ring-yellow-500',
        info: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
        outline: 'border-2 border-green-600 bg-white text-green-700 hover:bg-green-50 hover:border-green-700 focus-visible:ring-green-500',
        ghost: 'bg-white bg-opacity-95 text-green-700 hover:bg-green-100 focus-visible:ring-green-500',
        link: 'bg-transparent text-green-700 hover:underline hover:text-green-800 focus-visible:ring-green-500 p-0',
        light: 'bg-green-100 text-green-700 hover:bg-green-200 focus-visible:ring-green-500',
      },
      size: {
        xs: 'h-7 px-2 text-xs',
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
  isLoading = false,
      loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
      children,
  disabled,
  ...props
    },
    ref
  ) => {
  return (
    <button
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth ? 'w-full' : '',
          className
        )}
      disabled={disabled || isLoading}
        ref={ref}
      {...props}
    >
      {isLoading && (
          <span className={cn('mr-2', { 'mr-0': !loadingText && !children })}>
            <LoadingSpinner size="sm" color={variant === 'outline' || variant === 'ghost' || variant === 'link' ? 'primary' : 'light'} />
          </span>
      )}
        
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        
        {isLoading && loadingText ? loadingText : children}
        
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
  }
);

Button.displayName = 'Button';

export default Button; 