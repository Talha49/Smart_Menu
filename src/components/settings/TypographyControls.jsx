'use client';

import { memo } from 'react';
import { useMenuSettings } from '@/context/MenuSettingsContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFontOptions } from '@/lib/google-fonts';
import GoogleFontLoader from './GoogleFontLoader';
import ControlGroup from './ControlGroup';
import HelpIcon from '@/components/ui/HelpIcon';

const fontFamilies = getFontOptions();

const sizeOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const weightOptions = [
  { value: 'light', label: 'Light' },
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' },
];

const TypographyControls = memo(function TypographyControls({ useSettings = useMenuSettings }) {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="space-y-4">
      <GoogleFontLoader fontFamily={settings.fontFamily} />
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900">Typography</h3>
        <HelpIcon content="Choose fonts and text sizes that match your brand. Google Fonts are loaded automatically for a professional look." />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ControlGroup 
          label="Font Family"
          helpText="Select a font that represents your brand. All fonts are from Google Fonts and load automatically."
        >
          <Select
            value={settings.fontFamily || 'Inter'}
            onValueChange={(value) => updateSetting('fontFamily', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ControlGroup>

        <ControlGroup 
          label="Font Weight"
          helpText="Controls the thickness of text. Light for elegant, Bold for emphasis."
        >
          <Select
            value={settings.fontWeight || 'normal'}
            onValueChange={(value) => updateSetting('fontWeight', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {weightOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ControlGroup>

        <ControlGroup 
          label="Heading Size"
          helpText="Size of category and section headings. Larger sizes create more visual hierarchy."
        >
          <Select
            value={settings.headingSize || 'large'}
            onValueChange={(value) => updateSetting('headingSize', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ControlGroup>

        <ControlGroup 
          label="Body Text Size"
          helpText="Size for menu item names and descriptions. Medium is recommended for readability."
        >
          <Select
            value={settings.bodySize || 'medium'}
            onValueChange={(value) => updateSetting('bodySize', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ControlGroup>

        <ControlGroup 
          label="Price Size"
          helpText="Size for price display. Can match body text or be larger for emphasis."
        >
          <Select
            value={settings.priceSize || 'medium'}
            onValueChange={(value) => updateSetting('priceSize', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ControlGroup>
      </div>
    </div>
  );
});

export default TypographyControls;

