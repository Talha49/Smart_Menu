'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SplitLayout from './SplitLayout';
import ControlsPanel from './ControlsPanel';
import PreviewPanel from './PreviewPanel';
import SectionCard from './SectionCard';
import ControlGroup from './ControlGroup';
import AnimatedContainer from './AnimatedContainer';
import { Upload, Image as ImageIcon, Palette } from 'lucide-react';
import { toastSuccess, toastError } from '@/lib/toast';
import ColorPickerModal from './ColorPickerModal';

export default function BrandingTab({ 
  logoUrl, 
  brandColor, 
  onLogoUpload, 
  onColorChange, 
  onSave, 
  isUploading, 
  isSaving 
}) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileInputRef = useRef(null);
  const colorButtonRef = useRef(null);

  // Always center color picker to prevent overlap
  const getColorPickerPosition = () => {
    return { top: '50%', left: '50%' };
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toastError('Image size must be less than 5MB');
      return;
    }

    await onLogoUpload(file);
  };

  return (
    <SplitLayout
      leftPanel={
        <ControlsPanel
          title="Branding Settings"
          description="Customize your restaurant's logo and brand colors. These will appear on your public menu pages."
        >
          <SectionCard
            title="Logo"
            description="Upload your restaurant logo. Recommended: 200x200px, Max: 5MB"
            index={0}
          >
            <ControlGroup
              label="Restaurant Logo"
              description="Your logo will appear on menu pages and TV displays"
            >
              <div className="flex items-start gap-6">
                {/* Logo Preview */}
                <div className="shrink-0">
                  {logoUrl ? (
                    <div className="relative">
                      <img
                        src={logoUrl}
                        alt="Restaurant Logo"
                        className="h-24 w-24 object-contain rounded-lg border-2 border-gray-200"
                      />
                    </div>
                  ) : (
                    <div className="h-24 w-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="cursor-pointer"
                    variant="outline"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? 'Uploading...' : logoUrl ? 'Change Logo' : 'Upload Logo'}
                  </Button>
                  {logoUrl && (
                    <p className="text-xs text-gray-500 mt-2">Logo uploaded successfully</p>
                  )}
                </div>
              </div>
            </ControlGroup>
          </SectionCard>

          <SectionCard
            title="Brand Color"
            description="Choose your primary brand color. This will be used for headings and accents."
            index={1}
            showSeparator={false}
          >
            <ControlGroup
              label="Primary Brand Color"
              description="This color will appear on menu headers and accents"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    ref={colorButtonRef}
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors shadow-sm"
                    style={{ backgroundColor: brandColor || '#000000' }}
                    aria-label="Select brand color"
                  />
                  <ColorPickerModal
                    isOpen={showColorPicker}
                    onClose={() => setShowColorPicker(false)}
                    color={brandColor || '#000000'}
                    onChange={(color) => onColorChange(color)}
                    position={getColorPickerPosition()}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="text"
                    value={brandColor || '#000000'}
                    onChange={(e) => onColorChange(e.target.value)}
                    placeholder="#000000"
                    className="font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter hex color code</p>
                </div>
              </div>
            </ControlGroup>
          </SectionCard>

          {/* Save Button */}
          <AnimatedContainer variant="slideUp" delay={0.3}>
            <div className="sticky bottom-0 pt-6 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent">
              <Button
                onClick={onSave}
                disabled={isSaving}
                className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
                size="lg"
              >
                {isSaving ? 'Saving...' : 'Save Branding Settings'}
              </Button>
            </div>
          </AnimatedContainer>
        </ControlsPanel>
      }
      rightPanel={
        <PreviewPanel title="Brand Preview">
          <div className="flex flex-col items-center justify-center space-y-6 h-full">
            {/* Logo Preview */}
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Logo Preview</h3>
              {logoUrl ? (
                <div className="flex justify-center">
                  <img
                    src={logoUrl}
                    alt="Logo Preview"
                    className="h-24 w-auto object-contain rounded-lg border-2 border-gray-200 p-2 bg-white"
                  />
                </div>
              ) : (
                <div className="h-24 w-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Color Preview */}
            <div className="text-center w-full">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Color Preview</h3>
              <div className="space-y-3">
                <div
                  className="h-16 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md"
                  style={{ backgroundColor: brandColor || '#000000' }}
                >
                  Restaurant Name
                </div>
                <p className="text-xs text-gray-500">
                  Brand color preview
                </p>
              </div>
            </div>
          </div>
        </PreviewPanel>
      }
    />
  );
}

