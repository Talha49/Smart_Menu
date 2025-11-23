'use client';

import { memo } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ControlGroup from './ControlGroup';

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

const styleOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'italic', label: 'Italic' },
];

const HeadingControls = memo(function HeadingControls({ useSettings }) {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Heading Styles</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ControlGroup label="Heading Size" description="Size of category and section headings">
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

        <ControlGroup label="Heading Weight" description="Font weight for headings">
          <Select
            value={settings.headingWeight || settings.fontWeight || 'bold'}
            onValueChange={(value) => updateSetting('headingWeight', value)}
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

        <ControlGroup label="Heading Style" description="Text style for headings">
          <Select
            value={settings.headingStyle || 'normal'}
            onValueChange={(value) => updateSetting('headingStyle', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {styleOptions.map((option) => (
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

export default HeadingControls;

