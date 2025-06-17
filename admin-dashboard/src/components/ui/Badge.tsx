import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// تعريف المتغيرات المختلفة للشارات
const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary-100 text-primary-800',
        neutral: 'bg-neutral-100 text-neutral-800',
        primary: 'bg-primary-100 text-primary-800',
        secondary: 'bg-secondary-100 text-secondary-800',
        success: 'bg-green-100 text-success',
        info: 'bg-blue-100 text-info',
        warning: 'bg-yellow-100 text-warning',
        danger: 'bg-red-100 text-error',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-1',
        lg: 'text-base px-3 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

const Badge = ({ children, className, variant, size, ...props }: BadgeProps) => {
  return (
    <span 
      className={cn(badgeVariants({ variant, size }), className)} 
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge; 