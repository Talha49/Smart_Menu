'use client';

import { memo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import ControlGroup from './ControlGroup';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toastSuccess, toastError } from '@/lib/toast';

const ImageUploadControls = memo(function ImageUploadControls({ useSettings }) {
  const { settings, updateSetting } = useSettings();
  const [uploading, setUploading] = useState(false);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toastError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toastError('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/menu-item-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      updateSetting('defaultItemImageUrl', data.url);
      toastSuccess('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toastError(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    multiple: false,
    disabled: uploading,
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Item Images</h3>
      
      <ControlGroup
        label="Default Item Image"
        description="Upload a default image for menu items. Individual items can have their own images."
      >
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          {settings.defaultItemImageUrl ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={settings.defaultItemImageUrl}
                  alt="Default item image"
                  className="h-32 w-32 object-contain rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateSetting('defaultItemImageUrl', '');
                    toastSuccess('Image removed');
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600">Click to change image</p>
            </div>
          ) : (
            <div className="space-y-2">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-600">
                {isDragActive ? 'Drop image here' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          )}
        </div>
      </ControlGroup>
    </div>
  );
});

export default ImageUploadControls;

