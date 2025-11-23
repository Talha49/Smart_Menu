'use client';

import { memo } from 'react';
import { useMenuSettings } from '@/context/MenuSettingsContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import ControlGroup from './ControlGroup';
import HelpIcon from '@/components/ui/HelpIcon';

const cardStyleOptions = [
  { value: 'minimal', label: 'Minimal', description: 'No border, subtle shadow' },
  { value: 'bordered', label: 'Bordered', description: 'With border' },
  { value: 'elevated', label: 'Elevated', description: 'Strong shadow' },
  { value: 'flat', label: 'Flat', description: 'No shadow, just border' },
];

const spacingOptions = [
  { value: 'compact', label: 'Compact' },
  { value: 'normal', label: 'Normal' },
  { value: 'spacious', label: 'Spacious' },
];

const borderRadiusOptions = [
  { value: 'sharp', label: 'Sharp' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'very-rounded', label: 'Very Rounded' },
];

const LayoutControls = memo(function LayoutControls({ useSettings = useMenuSettings }) {
  const { settings, updateSetting } = useSettings();

  const getCardStyleClasses = (style) => {
    switch (style) {
      case 'minimal':
        return 'border-0 shadow-sm';
      case 'bordered':
        return 'border-2 shadow-none';
      case 'elevated':
        return 'border shadow-lg';
      case 'flat':
        return 'border-2 shadow-none';
      default:
        return 'border shadow-lg';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900">Layout & Design</h3>
        <HelpIcon content="Control the visual layout of your menu cards, spacing, and overall design style." />
      </div>
      
      {/* Card Style */}
      <ControlGroup 
        label="Card Style"
        helpText="Choose how menu item cards appear. Minimal for clean look, Elevated for depth, Bordered for definition."
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {cardStyleOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateSetting('cardStyle', option.value)}
              className={`p-3 rounded-lg border-2 text-left transition-all cursor-pointer ${
                settings.cardStyle === option.value
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-full h-16 rounded ${getCardStyleClasses(option.value)} mb-2`} />
              <div className="text-xs font-medium text-gray-900">{option.label}</div>
              <div className="text-xs text-gray-500">{option.description}</div>
            </button>
          ))}
        </div>
      </ControlGroup>

      {/* Grid Columns */}
      <ControlGroup 
        label={`Grid Columns: ${settings.gridColumns || 3}`}
        helpText="Number of columns in the menu grid. More columns show more items per row. Responsive on mobile."
      >
        <input
          type="range"
          min="1"
          max="4"
          value={settings.gridColumns || 3}
          onChange={(e) => updateSetting('gridColumns', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
        </div>
      </ControlGroup>

      {/* Spacing */}
      <ControlGroup 
        label="Spacing"
        helpText="Space between menu items. Compact for more items, Spacious for easier reading."
      >
        <Select
          value={settings.spacing || 'normal'}
          onValueChange={(value) => updateSetting('spacing', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {spacingOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ControlGroup>

      {/* Border Radius */}
      <ControlGroup 
        label="Border Radius"
        helpText="Roundness of card corners. Sharp for modern, Rounded for friendly, Very Rounded for playful."
      >
        <Select
          value={settings.borderRadius || 'rounded'}
          onValueChange={(value) => updateSetting('borderRadius', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {borderRadiusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ControlGroup>

      {/* Toggles */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium text-gray-700">Show Descriptions</Label>
            <p className="text-xs text-gray-500">Display item descriptions on menu</p>
          </div>
          <Switch
            checked={settings.showDescriptions !== false}
            onCheckedChange={(checked) => updateSetting('showDescriptions', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium text-gray-700">Show Category Headers</Label>
            <p className="text-xs text-gray-500">Display category section headers</p>
          </div>
          <Switch
            checked={settings.showCategoryHeaders !== false}
            onCheckedChange={(checked) => updateSetting('showCategoryHeaders', checked)}
          />
        </div>
      </div>
    </div>
  );
});

export default LayoutControls;

