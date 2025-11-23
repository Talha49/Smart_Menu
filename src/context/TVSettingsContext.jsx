'use client';

import { createContext, useContext, useState, useCallback } from 'react';

// Default TV settings (optimized for TV display)
const defaultTVSettings = {
  // Colors (TV optimized - darker backgrounds)
  backgroundColor: '#000000',
  textColor: '#ffffff',
  accentColor: '#ffffff',
  cardBackgroundColor: '#1a1a1a',
  borderColor: '#333333',
  priceColor: '#ffffff',
  
  // Typography (TV optimized - larger sizes)
  fontFamily: 'Inter',
  headingSize: 'large',
  bodySize: 'large',
  priceSize: 'large',
  fontWeight: 'bold',
  
  // Layout (TV optimized)
  cardStyle: 'minimal',
  gridColumns: 2,
  spacing: 'spacious',
  borderRadius: 'rounded',
  
  // Visual
  backgroundType: 'solid',
  showDescriptions: true,
  showCategoryHeaders: true,
  
  // Advanced Customization (TV optimized)
  headingWeight: 'bold',
  headingStyle: 'normal',
  textBold: false,
  textItalic: false,
  textUnderline: false,
  showBulletPoints: false,
  bulletStyle: 'disc',
  bulletColor: '#ffffff',
  pricePosition: 'right',
  priceFormat: 'standard',
  showCurrencySymbol: true,
  priceBold: true,
  cardShadow: 'none',
  cardBorderWidth: '0',
  cardHoverEffect: false,
  cardPadding: 'spacious',
  sections: [],
  defaultItemImageUrl: '',
};

export function TVSettingsProvider({ children, initialSettings = null }) {
  const [settings, setSettings] = useState(initialSettings || defaultTVSettings);

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
    setSettings(defaultTVSettings);
  }, []);

  return (
    <TVSettingsContext.Provider
      value={{
        settings,
        updateSetting,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </TVSettingsContext.Provider>
  );
}

const TVSettingsContext = createContext(null);

export function useTVSettings() {
  const context = useContext(TVSettingsContext);
  if (!context) {
    throw new Error('useTVSettings must be used within TVSettingsProvider');
  }
  return context;
}

