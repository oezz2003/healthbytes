import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number; // Duration in milliseconds before auto-dismissal
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ 
  id,
  type, 
  title, 
  message, 
  duration = 5000, // Default 5 seconds
  onClose 
}) => {
  const [visible, setVisible] = useState(true);

  // Auto-dismiss timer
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onClose(id), 300); // Allow time for exit animation
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  // Handle manual close
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  // Icon and color based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircleIcon className="h-6 w-6" />,
          background: 'bg-green-50',
          border: 'border-green-200',
          iconColor: 'text-success',
          titleColor: 'text-green-800',
          textColor: 'text-green-700'
        };
      case 'error':
        return {
          icon: <XCircleIcon className="h-6 w-6" />,
          background: 'bg-red-50',
          border: 'border-red-200',
          iconColor: 'text-error',
          titleColor: 'text-red-800',
          textColor: 'text-red-700'
        };
      case 'warning':
        return {
          icon: <ExclamationCircleIcon className="h-6 w-6" />,
          background: 'bg-yellow-50',
          border: 'border-yellow-200',
          iconColor: 'text-warning',
          titleColor: 'text-yellow-800',
          textColor: 'text-yellow-700'
        };
      case 'info':
      default:
        return {
          icon: <InformationCircleIcon className="h-6 w-6" />,
          background: 'bg-blue-50',
          border: 'border-blue-200',
          iconColor: 'text-info',
          titleColor: 'text-blue-800',
          textColor: 'text-blue-700'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div 
      className={`
        fixed bottom-4 right-4 z-50 w-full max-w-sm transform 
        rounded-lg border shadow-lg 
        transition-all duration-300 ease-in-out
        ${styles.background} ${styles.border}
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
      `}
      role="alert"
    >
      <div className="flex p-4">
        <div className={`flex-shrink-0 ${styles.iconColor}`}>
          {styles.icon}
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className={`text-sm font-medium ${styles.titleColor}`}>{title}</p>
          <p className={`mt-1 text-sm ${styles.textColor}`}>{message}</p>
        </div>
        <div className="ml-4 flex flex-shrink-0">
          <button
            type="button"
            className="inline-flex text-neutral-400 hover:text-neutral-500 focus:outline-none"
            onClick={handleClose}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast; 