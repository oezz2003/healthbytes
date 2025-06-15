'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

const UnauthorizedPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto h-24 w-24 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Unauthorized</h1>
        
        <p className="mt-2 text-lg text-gray-600">
          You don't have the necessary permissions to access this page.
        </p>
        
        <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Button
            variant="primary"
            onClick={() => router.push('/dashboard')}
          >
            Return to Dashboard
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </div>
        
        <p className="mt-6 text-sm text-gray-500">
          If you believe this is an error, please contact your system administrator.
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedPage; 
 
 
 
 