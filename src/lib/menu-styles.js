/**
 * Utility functions to apply menu settings to components
 */

import {
  formatPrice,
  getTextStyleClasses,
  getHeadingStyleClasses,
  getCardShadowClass,
  getCardPaddingClass,
  getBulletStyle,
  getBulletContent,
} from './menu-utils';

export function getSizeClasses(size) {
  switch (size) {
    case 'small':
      return { heading: 'text-2xl', body: 'text-sm', price: 'text-base' };
    case 'medium':
      return { heading: 'text-3xl', body: 'text-base', price: 'text-lg' };
    case 'large':
      return { heading: 'text-4xl', body: 'text-lg', price: 'text-xl' };
    default:
      return { heading: 'text-3xl', body: 'text-base', price: 'text-lg' };
  }
}

export function getWeightClass(weight) {
  switch (weight) {
    case 'light':
      return 'font-light';
    case 'normal':
      return 'font-normal';
    case 'bold':
      return 'font-bold';
    default:
      return 'font-normal';
  }
}

export function getCardStyleClasses(style) {
  switch (style) {
    case 'minimal':
      return 'border-0 shadow-sm';
    case 'bordered':
      return 'border-2 border-gray-200 shadow-none';
    case 'elevated':
      return 'border border-gray-200 shadow-lg';
    case 'flat':
      return 'border-2 border-gray-200 shadow-none';
    default:
      return 'border border-gray-200 shadow-lg';
  }
}

export function getBorderRadiusClass(radius) {
  switch (radius) {
    case 'sharp':
      return 'rounded-none';
    case 'rounded':
      return 'rounded-lg';
    case 'very-rounded':
      return 'rounded-2xl';
    default:
      return 'rounded-lg';
  }
}

export function getSpacingClass(spacing) {
  switch (spacing) {
    case 'compact':
      return 'gap-2';
    case 'normal':
      return 'gap-4';
    case 'spacious':
      return 'gap-6';
    default:
      return 'gap-4';
  }
}

export function getGridColsClass(columns) {
  // Mobile-first responsive grid
  // Always 1 column on mobile, then responsive based on setting
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };
  return gridCols[columns] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
}

export function getBackgroundStyle(settings) {
  if (settings?.backgroundType === 'gradient') {
    return {
      background: `linear-gradient(135deg, ${settings.backgroundColor || '#f9fafb'} 0%, ${settings.cardBackgroundColor || '#ffffff'} 100%)`,
    };
  }
  return { backgroundColor: settings?.backgroundColor || '#f9fafb' };
}

export function getFontFamily(settings) {
  const fontFamily = settings?.fontFamily || 'Inter';
  return { fontFamily };
}

