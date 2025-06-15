import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  initialImage?: string;
  onImageChange: (imageUrl: string) => void;
  label?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  initialImage = '',
  onImageChange,
  label = 'Image',
  className = ''
}) => {
  const [imageUrl, setImageUrl] = useState<string>(initialImage);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImageUrl(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImageUrl(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <div
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md
          ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-gray-50'}
          transition-colors duration-200 ease-in-out
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {imageUrl ? (
          <div className="space-y-2 text-center">
            <div className="relative w-full h-40 mx-auto">
              <Image
                src={imageUrl}
                alt="Uploaded image"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="px-3 py-1 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1 text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  ref={fileInputRef}
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload; 
 
 
 
 