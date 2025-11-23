'use client';

import { memo } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import ControlGroup from './ControlGroup';

const TextFormatControls = memo(function TextFormatControls({ useSettings }) {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Text Formatting</h3>
      
      <div className="space-y-4">
        <ControlGroup label="Text Formatting Options" description="Enable text formatting styles">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-gray-700">Bold Text</Label>
                <p className="text-xs text-gray-500">Make item names bold</p>
              </div>
              <Switch
                checked={settings.textBold || false}
                onCheckedChange={(checked) => updateSetting('textBold', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-gray-700">Italic Text</Label>
                <p className="text-xs text-gray-500">Make item names italic</p>
              </div>
              <Switch
                checked={settings.textItalic || false}
                onCheckedChange={(checked) => updateSetting('textItalic', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-gray-700">Underline Text</Label>
                <p className="text-xs text-gray-500">Underline item names</p>
              </div>
              <Switch
                checked={settings.textUnderline || false}
                onCheckedChange={(checked) => updateSetting('textUnderline', checked)}
              />
            </div>
          </div>
        </ControlGroup>
      </div>
    </div>
  );
});

export default TextFormatControls;

