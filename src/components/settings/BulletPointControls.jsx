'use client';

import { memo, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import ControlGroup from './ControlGroup';
import dynamic from 'next/dynamic';

// Lazy load color picker
const SketchPicker = dynamic(
  () => import('react-color').then((mod) => mod.SketchPicker),
  { ssr: false }
);

const bulletStyleOptions = [
  { value: 'none', label: 'None' },
  { value: 'disc', label: 'Disc (•)' },
  { value: 'circle', label: 'Circle (○)' },
  { value: 'square', label: 'Square (■)' },
  { value: 'dash', label: 'Dash (—)' },
  { value: 'arrow', label: 'Arrow (→)' },
];

const BulletPointControls = memo(function BulletPointControls({ useSettings }) {
  const { settings, updateSetting } = useSettings();
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Bullet Points</h3>
      
      <div className="space-y-4">
        <ControlGroup label="Show Bullet Points" description="Display bullet points for menu items">
          <Switch
            checked={settings.showBulletPoints !== false}
            onCheckedChange={(checked) => updateSetting('showBulletPoints', checked)}
          />
        </ControlGroup>

        {settings.showBulletPoints !== false && (
          <>
            <ControlGroup label="Bullet Style" description="Choose bullet point style">
              <Select
                value={settings.bulletStyle || 'disc'}
                onValueChange={(value) => updateSetting('bulletStyle', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bulletStyleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ControlGroup>

            <ControlGroup label="Bullet Color" description="Color of bullet points">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors shadow-sm"
                    style={{ backgroundColor: settings.bulletColor || settings.accentColor || '#000000' }}
                    aria-label="Select bullet color"
                  />
                  {showColorPicker && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowColorPicker(false)}
                      />
                      <div className="absolute z-20 mt-2">
                        <SketchPicker
                          color={settings.bulletColor || settings.accentColor || '#000000'}
                          onChange={(color) => updateSetting('bulletColor', color.hex)}
                          disableAlpha
                        />
                      </div>
                    </>
                  )}
                </div>
                <input
                  type="text"
                  value={settings.bulletColor || settings.accentColor || '#000000'}
                  onChange={(e) => updateSetting('bulletColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-mono"
                  placeholder="#000000"
                />
              </div>
            </ControlGroup>
          </>
        )}
      </div>
    </div>
  );
});

export default BulletPointControls;

