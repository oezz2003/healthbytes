import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  noPadding?: boolean;
  noShadow?: boolean;
  bordered?: boolean;
  icon?: React.ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  titleClassName = '',
  subtitleClassName = '',
  noPadding = false,
  noShadow = false,
  bordered = false,
  icon,
  hoverable = false,
}) => {
  const cardClasses = `bg-white rounded-lg ${
    noShadow ? '' : 'shadow-md'
  } ${bordered ? 'border border-neutral-200' : ''} ${
    hoverable ? 'transition-all duration-200 hover:shadow-lg hover:border-primary-300' : ''
  } ${className}`;
  
  const headerClasses = `border-b border-neutral-200 px-6 py-4 ${headerClassName}`;
  const bodyClasses = `${noPadding ? '' : 'p-6'} ${bodyClassName}`;
  const footerClasses = `border-t border-neutral-200 px-6 py-4 ${footerClassName}`;
  const titleClasses = `text-lg font-semibold text-primary-700 ${titleClassName}`;
  const subtitleClasses = `text-sm font-normal text-neutral-500 mt-1 ${subtitleClassName}`;

  return (
    <div className={cardClasses}>
      {(title || subtitle) && (
        <div className={headerClasses}>
          <div className="flex items-center">
            {icon && <div className="mr-3 text-primary-600">{icon}</div>}
            <div>
              {title && <h3 className={titleClasses}>{title}</h3>}
              {subtitle && <p className={subtitleClasses}>{subtitle}</p>}
            </div>
          </div>
        </div>
      )}
      <div className={bodyClasses}>{children}</div>
      {footer && <div className={footerClasses}>{footer}</div>}
    </div>
  );
};

export default Card; 