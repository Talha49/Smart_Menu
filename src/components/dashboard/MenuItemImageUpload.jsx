'use client';

import { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Image as ImageIcon, Sparkles, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { toastSuccess, toastError } from '@/lib/toast';
import dynamic from 'next/dynamic';

// Lazy load react-easy-crop
const Cropper = dynamic(
  () => import('react-easy-crop').then((mod) => mod.default),
  { ssr: false }
);

// Lazy load TensorFlow.js for background removal
let tf = null;
let model = null;
let modelLoading = false;

const loadTensorFlowModel = async () => {
  if (modelLoading) {
    // Wait for existing load
    while (modelLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return { tf, model };
  }

  if (!tf && typeof window !== 'undefined') {
    modelLoading = true;
    try {
      tf = await import('@tensorflow/tfjs');
      await tf.ready();
      
      // Load BodyPix model for background removal (optimized for speed)
      const bodyPix = await import('@tensorflow-models/body-pix');
      model = await bodyPix.load({
        architecture: 'MobileNetV1',
        outputStride: 8, // Faster processing
        multiplier: 0.5, // Smaller model for speed
        quantBytes: 1, // Faster inference
      });
    } catch (error) {
      console.warn('Background removal model failed to load:', error);
      model = null;
    } finally {
      modelLoading = false;
    }
  }
  return { tf, model };
};

export default function MenuItemImageUpload({ imageUrl, onImageChange, onRemove }) {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showCrop, setShowCrop] = useState(false);
  const [showBackgroundRemoval, setShowBackgroundRemoval] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [bgRemovalProgress, setBgRemovalProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toastError('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toastError('Image size must be less than 10MB');
      return;
    }

    // Read file and show crop dialog
    const reader = new FileReader();
    reader.onload = () => {
      setOriginalImage(reader.result);
      setCropImage(reader.result);
      setShowCrop(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    multiple: false,
    disabled: uploading || processing,
  });

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropComplete = async () => {
    if (!cropImage || !croppedAreaPixels) {
      toastError('Please adjust the crop area');
      return;
    }

    try {
      setProcessing(true);

      // Create image element
      const image = new Image();
      image.src = cropImage;

      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });

      // Create canvas for cropping
      const canvas = document.createElement('canvas');
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext('2d');

      // Apply rotation if needed
      if (rotation !== 0) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
      }

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      if (rotation !== 0) {
        ctx.restore();
      }

      // Show background removal option
      const croppedDataUrl = canvas.toDataURL('image/png');
      setCropImage(croppedDataUrl);
      setShowCrop(false);
      setShowBackgroundRemoval(true);
      setProcessing(false);
    } catch (error) {
      console.error('Crop error:', error);
      toastError('Failed to crop image');
      setProcessing(false);
    }
  };

  const handleBackgroundRemoval = async () => {
    if (!cropImage) return;

    try {
      setProcessing(true);
      setBgRemovalProgress(5);
      
      // Load TensorFlow model
      setBgRemovalProgress(15);
      const { tf: tfLoaded, model: modelLoaded } = await loadTensorFlowModel();
      setBgRemovalProgress(30);

      if (!modelLoaded || !tfLoaded) {
        // Fallback: use edge detection for simple background removal
        toastError('AI model not available. Using edge detection method.');
        await handleSimpleBackgroundRemoval();
        return;
      }

      setBgRemovalProgress(40);

      // Create image element
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = cropImage;

      await new Promise((resolve) => {
        image.onload = resolve;
      });

      setBgRemovalProgress(50);

      // Resize image if too large for faster processing (max 512px)
      const maxSize = 512;
      let processWidth = image.width;
      let processHeight = image.height;
      let scale = 1;

      if (image.width > maxSize || image.height > maxSize) {
        scale = Math.min(maxSize / image.width, maxSize / image.height);
        processWidth = Math.floor(image.width * scale);
        processHeight = Math.floor(image.height * scale);
      }

      setBgRemovalProgress(60);

      // Create temporary canvas for resizing
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = processWidth;
      tempCanvas.height = processHeight;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(image, 0, 0, processWidth, processHeight);

      // Convert to tensor
      const tensor = tfLoaded.browser.fromPixels(tempCanvas);
      setBgRemovalProgress(70);

      // Perform segmentation (using segmentPerson for general objects)
      const segmentation = await modelLoaded.segmentPerson(tensor, {
        flipHorizontal: false,
        internalResolution: 'low', // Faster
        segmentationThreshold: 0.5, // More lenient
      });

      setBgRemovalProgress(80);

      // Create mask and apply to original size
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = image.width;
      maskCanvas.height = image.height;
      const maskCtx = maskCanvas.getContext('2d');
      
      // Scale up the mask
      const maskImageData = new ImageData(
        new Uint8ClampedArray(segmentation.data.map((v) => (v > 0.5 ? 255 : 0)).flatMap((v) => [v, v, v, v])),
        processWidth,
        processHeight
      );
      maskCtx.putImageData(maskImageData, 0, 0);
      maskCtx.scale(image.width / processWidth, image.height / processHeight);
      maskCtx.drawImage(maskCanvas, 0, 0);

      // Apply mask to original image
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = image.width;
      finalCanvas.height = image.height;
      const finalCtx = finalCanvas.getContext('2d');
      
      finalCtx.drawImage(image, 0, 0);
      finalCtx.globalCompositeOperation = 'destination-in';
      finalCtx.drawImage(maskCanvas, 0, 0);

      // Clean up tensors
      tensor.dispose();

      setBgRemovalProgress(95);

      // Convert to blob and upload
      finalCanvas.toBlob(async (blob) => {
        setBgRemovalProgress(100);
        await uploadImage(blob);
      }, 'image/png', 0.95);
    } catch (error) {
      console.error('Background removal error:', error);
      toastError('Background removal failed. Using simple method.');
      await handleSimpleBackgroundRemoval();
    }
  };

  const handleSimpleBackgroundRemoval = async () => {
    // Simple edge-based background removal (faster fallback)
    const image = new Image();
    image.src = cropImage;
    
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Simple background removal: make edges transparent
    // This is a basic implementation - for better results, use the AI model
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Simple threshold: if pixel is too light (likely background), make transparent
      const brightness = (r + g + b) / 3;
      if (brightness > 240) {
        data[i + 3] = 0; // Make transparent
      }
    }

    ctx.putImageData(imageData, 0, 0);

    canvas.toBlob(async (blob) => {
      await uploadImage(blob);
    }, 'image/png', 0.95);
  };

  const uploadImage = async (blob) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', blob, 'menu-item.png');

      const response = await fetch('/api/upload/menu-item-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      onImageChange(data.url);
      toastSuccess('Image uploaded successfully!');
      setShowCrop(false);
      setShowBackgroundRemoval(false);
      setCropImage(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setOriginalImage(null);
      setCroppedAreaPixels(null);
      setBgRemovalProgress(0);
    } catch (error) {
      console.error('Upload error:', error);
      toastError(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      setProcessing(false);
      setBgRemovalProgress(0);
    }
  };

  const handleSkipBackgroundRemoval = async () => {
    // Upload cropped image without background removal
    const image = new Image();
    image.src = cropImage;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      canvas.toBlob(async (blob) => {
        await uploadImage(blob);
      }, 'image/png', 0.95);
    };
  };

  const handleCancel = () => {
    setShowCrop(false);
    setShowBackgroundRemoval(false);
    setCropImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setOriginalImage(null);
    setCroppedAreaPixels(null);
    setProcessing(false);
    setBgRemovalProgress(0);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">Menu Item Image</Label>
      
      {imageUrl ? (
        <div className="relative inline-block">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={imageUrl}
              alt="Menu item"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 cursor-pointer transition-colors"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${uploading || processing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            {isDragActive ? 'Drop image here' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          {uploading && (
            <div className="mt-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mx-auto"></div>
            </div>
          )}
        </div>
      )}

      {/* Crop Dialog */}
      {showCrop && cropImage && !showBackgroundRemoval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Crop Image</h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="relative flex-1 min-h-[400px] max-h-[60vh] bg-gray-900 rounded-lg overflow-hidden">
              <Cropper
                image={cropImage}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                cropShape="round"
                showGrid={true}
                style={{
                  containerStyle: {
                    width: '100%',
                    height: '100%',
                  },
                }}
              />
            </div>

            {/* Controls */}
            <div className="mt-4 space-y-4">
              {/* Zoom Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <ZoomIn className="h-4 w-4" />
                    Zoom
                  </Label>
                  <span className="text-sm text-gray-600">{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              {/* Rotation Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <RotateCw className="h-4 w-4" />
                    Rotation
                  </Label>
                  <span className="text-sm text-gray-600">{rotation}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={processing}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCropComplete}
                disabled={processing || !croppedAreaPixels}
                className="cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {processing ? 'Processing...' : 'Continue to Background Removal'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Background Removal Dialog */}
      {showBackgroundRemoval && cropImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Background Removal
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Remove the background from your image using AI. This will create a transparent PNG perfect for menu items.
              </p>
              
              {/* Preview */}
              <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={cropImage}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Progress Bar */}
              {processing && bgRemovalProgress > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">Processing...</span>
                    <span className="text-xs text-gray-600">{bgRemovalProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${bgRemovalProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleSkipBackgroundRemoval}
                disabled={processing}
                className="cursor-pointer"
              >
                Skip & Upload
              </Button>
              <Button
                onClick={handleBackgroundRemoval}
                disabled={processing}
                className="cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </span>
                ) : (
                  'Remove Background & Upload'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
