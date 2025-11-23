'use client';

import { memo } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import ControlGroup from './ControlGroup';

const positionOptions = [
  { value: 'right', label: 'Right (Default)' },
  { value: 'left', label: 'Left' },
  { value: 'below', label: 'Below Name' },
  { value: 'inline', label: 'Inline with Name' },
];

const formatOptions = [
  { value: 'standard', label: 'Standard ($12.99)' },
  { value: 'no-decimal', label: 'No Decimal ($13)' },
  { value: 'currency-symbol', label: 'Currency Symbol (12.99$)' },
  { value: 'text', label: 'Text (Twelve Dollars)' },
];

const PriceDisplayControls = memo(function PriceDisplayControls({ useSettings }) {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Price Display</h3>
      
      <div className="space-y-4">
        <ControlGroup label="Price Position" description="Where to display the price">
          <Select
            value={settings.pricePosition || 'right'}
            onValueChange={(value) => updateSetting('pricePosition', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {positionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ControlGroup>

        <ControlGroup label="Price Format" description="How to format the price">
          <Select
            value={settings.priceFormat || 'standard'}
            onValueChange={(value) => updateSetting('priceFormat', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {formatOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ControlGroup>

        <ControlGroup label="Show Currency Symbol" description="Display currency symbol">
          <Switch
            checked={settings.showCurrencySymbol !== false}
            onCheckedChange={(checked) => updateSetting('showCurrencySymbol', checked)}
          />
        </ControlGroup>

        <ControlGroup label="Bold Price" description="Make price text bold">
          <Switch
            checked={settings.priceBold || false}
            onCheckedChange={(checked) => updateSetting('priceBold', checked)}
          />
        </ControlGroup>
      </div>
    </div>
  );
});

export default PriceDisplayControls;

