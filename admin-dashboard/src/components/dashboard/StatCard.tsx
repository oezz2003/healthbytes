import React from 'react';
import Card from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className = '',
}) => {
  return (
    <Card className={`${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
          
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
          
          {trend && (
            <div className="mt-2 flex items-center text-sm">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  trend.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="ml-2 text-gray-500">from last period</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="flex-shrink-0 p-3 bg-gray-100 rounded-full">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard; 