/**
 * Utility functions for menu rendering
 */

/**
 * Format price based on settings
 */
export function formatPrice(price, settings = {}) {
  const format = settings.priceFormat || 'standard';
  const showSymbol = settings.showCurrencySymbol !== false;

  switch (format) {
    case 'no-decimal':
      return showSymbol ? `$${Math.round(price)}` : `${Math.round(price)}`;
    case 'currency-symbol':
      return showSymbol ? `${price.toFixed(2)}$` : `${price.toFixed(2)}`;
    case 'text':
      // Simple text conversion (can be enhanced)
      return showSymbol ? `$${price.toFixed(2)}` : `${price.toFixed(2)}`;
    case 'standard':
    default:
      return showSymbol ? `$${price.toFixed(2)}` : `${price.toFixed(2)}`;
  }
}

/**
 * Get text style classes based on settings
 */
export function getTextStyleClasses(settings) {
  const classes = [];
  
  if (settings.textBold) classes.push('font-bold');
  if (settings.textItalic) classes.push('italic');
  if (settings.textUnderline) classes.push('underline');
  if (settings.priceBold) classes.push('font-bold');
  
  return classes.join(' ');
}

/**
 * Get heading style classes
 */
export function getHeadingStyleClasses(settings) {
  const classes = [];
  
  const weight = settings.headingWeight || settings.fontWeight || 'bold';
  switch (weight) {
    case 'light':
      classes.push('font-light');
      break;
    case 'normal':
      classes.push('font-normal');
      break;
    case 'bold':
      classes.push('font-bold');
      break;
  }
  
  if (settings.headingStyle === 'italic') {
    classes.push('italic');
  }
  
  return classes.join(' ');
}

/**
 * Get card shadow class
 */
export function getCardShadowClass(shadow) {
  switch (shadow) {
    case 'none':
      return 'shadow-none';
    case 'sm':
      return 'shadow-sm';
    case 'md':
      return 'shadow-md';
    case 'lg':
      return 'shadow-lg';
    case 'xl':
      return 'shadow-xl';
    default:
      return 'shadow-lg';
  }
}

/**
 * Get card padding class
 */
export function getCardPaddingClass(padding) {
  switch (padding) {
    case 'compact':
      return 'p-3';
    case 'normal':
      return 'p-4';
    case 'spacious':
      return 'p-6';
    default:
      return 'p-4';
  }
}

/**
 * Get bullet point style
 */
export function getBulletStyle(style) {
  switch (style) {
    case 'disc':
      return 'list-disc';
    case 'circle':
      return 'list-circle';
    case 'square':
      return 'list-square';
    case 'dash':
      return 'list-none';
    case 'arrow':
      return 'list-none';
    case 'none':
    default:
      return 'list-none';
  }
}

/**
 * Get bullet point content
 */
export function getBulletContent(style) {
  switch (style) {
    case 'dash':
      return '—';
    case 'arrow':
      return '→';
    default:
      return '•';
  }
}

