import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

const Badge = ({ children, className }: BadgeProps) => {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      className
    )}>
      {children}
    </span>
  );
};

export default Badge; 