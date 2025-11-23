'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const MenuSettingsContext = createContext(null);

// Default menu settings
const defaultSettings = {
  // Colors
  backgroundColor: '#f9fafb',
  textColor: '#111827',
  accentColor: '#000000',
  cardBackgroundColor: '#ffffff',
  borderColor: '#e5e7eb',
  priceColor: '#111827',
  
  // Typography
  fontFamily: 'Inter',
  headingSize: 'large',
  bodySize: 'medium',
  priceSize: 'medium',
  fontWeight: 'normal',
  
  // Layout
  cardStyle: 'elevated',
  gridColumns: 3,
  spacing: 'normal',
  borderRadius: 'rounded',
  
  // Visual
  backgroundType: 'solid',
  showDescriptions: true,
  showCategoryHeaders: true,
  
  // Advanced Customization
  headingWeight: 'bold',
  headingStyle: 'normal',
  textBold: false,
  textItalic: false,
  textUnderline: false,
  showBulletPoints: false,
  bulletStyle: 'disc',
  bulletColor: '#000000',
  pricePosition: 'right',
  priceFormat: 'standard',
  showCurrencySymbol: true,
  priceBold: false,
  cardShadow: 'lg',
  cardBorderWidth: '1',
  cardHoverEffect: true,
  cardPadding: 'normal',
  sections: [],
  defaultItemImageUrl: '',
};

export function MenuSettingsProvider({ children, initialSettings = null }) {
  const [settings, setSettings] = useState(initialSettings || defaultSettings);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  return (
    <MenuSettingsContext.Provider
      value={{
        settings,
        updateSetting,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </MenuSettingsContext.Provider>
  );
}

export function useMenuSettings() {
  const context = useContext(MenuSettingsContext);
  if (!context) {
    throw new Error('useMenuSettings must be used within MenuSettingsProvider');
  }
  return context;
}

