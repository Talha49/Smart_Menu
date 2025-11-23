'use client';

import { memo } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import ControlGroup from './ControlGroup';

const shadowOptions = [
  { value: 'none', label: 'None' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

const borderWidthOptions = [
  { value: '0', label: 'None' },
  { value: '1', label: 'Thin (1px)' },
  { value: '2', label: 'Medium (2px)' },
  { value: '4', label: 'Thick (4px)' },
];

const CardStyleControls = memo(function CardStyleControls({ useSettings }) {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Card Styling</h3>
      
      <div className="space-y-4">
        <ControlGroup label="Card Shadow" description="Shadow depth for menu item cards">
          <Select
            value={settings.cardShadow || 'lg'}
            onValueChange={(value) => updateSetting('cardShadow', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {shadowOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ControlGroup>

        <ControlGroup label="Border Width" description="Border thickness for cards">
          <Select
            value={settings.cardBorderWidth || '1'}
            onValueChange={(value) => updateSetting('cardBorderWidth', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {borderWidthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ControlGroup>

        <ControlGroup label="Card Hover Effect" description="Add hover animation to cards">
          <Switch
            checked={settings.cardHoverEffect !== false}
            onCheckedChange={(checked) => updateSetting('cardHoverEffect', checked)}
          />
        </ControlGroup>

        <ControlGroup label="Card Padding" description="Internal spacing in cards">
          <Select
            value={settings.cardPadding || 'normal'}
            onValueChange={(value) => updateSetting('cardPadding', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="spacious">Spacious</SelectItem>
            </SelectContent>
          </Select>
        </ControlGroup>
      </div>
    </div>
  );
});

export default CardStyleControls;

