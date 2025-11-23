'use client';

import { useState, memo, useRef, useEffect } from 'react';
import { useMenuSettings } from '@/context/MenuSettingsContext';
import { Label } from '@/components/ui/label';
import ControlGroup from './ControlGroup';
import HelpIcon from '@/components/ui/HelpIcon';
import ColorPickerModal from './ColorPickerModal';

const colorFields = [
  { 
    key: 'backgroundColor', 
    label: 'Background Color', 
    default: '#f9fafb',
    helpText: 'The main background color of your menu page. Choose a color that complements your brand and ensures good readability.'
  },
  { 
    key: 'textColor', 
    label: 'Text Color', 
    default: '#111827',
    helpText: 'The default color for all text content. Ensure good contrast with the background for readability.'
  },
  { 
    key: 'accentColor', 
    label: 'Accent Color', 
    default: '#000000',
    helpText: 'Used for headings, borders, and highlights. This is your primary brand color that makes elements stand out.'
  },
  { 
    key: 'cardBackgroundColor', 
    label: 'Card Background', 
    default: '#ffffff',
    helpText: 'Background color for menu item cards. Typically lighter or darker than the main background for visual separation.'
  },
  { 
    key: 'borderColor', 
    label: 'Border Color', 
    default: '#e5e7eb',
    helpText: 'Color for card borders and dividers. Subtle borders help define card boundaries.'
  },
  { 
    key: 'priceColor', 
    label: 'Price Color', 
    default: '#111827',
    helpText: 'Color specifically for price display. Can match text color or use accent color for emphasis.'
  },
];

const ColorControls = memo(function ColorControls({ useSettings = useMenuSettings }) {
  const { settings, updateSetting } = useSettings();
  const [openPicker, setOpenPicker] = useState(null);
  const buttonRefs = useRef({});

  const handleColorChange = (key, color) => {
    updateSetting(key, color);
  };

  // Always center color picker to prevent overlap
  const getButtonPosition = () => {
    return { top: '50%', left: '50%' };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900">Colors</h3>
        <HelpIcon content="Customize the color scheme of your menu. All changes are reflected in real-time in the preview." />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {colorFields.map((field) => (
          <ControlGroup 
            key={field.key}
            label={field.label}
            helpText={field.helpText}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  ref={(el) => (buttonRefs.current[field.key] = el)}
                  type="button"
                  onClick={() => setOpenPicker(openPicker === field.key ? null : field.key)}
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors shadow-sm"
                  style={{ backgroundColor: settings[field.key] || field.default }}
                  aria-label={`Select ${field.label}`}
                />
                <ColorPickerModal
                  isOpen={openPicker === field.key}
                  onClose={() => setOpenPicker(null)}
                  color={settings[field.key] || field.default}
                  onChange={(color) => handleColorChange(field.key, color)}
                  position={getButtonPosition()}
                />
              </div>
              <input
                type="text"
                value={settings[field.key] || field.default}
                onChange={(e) => updateSetting(field.key, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                placeholder={field.default}
              />
            </div>
          </ControlGroup>
        ))}
      </div>
    </div>
  );
});

export default ColorControls;

