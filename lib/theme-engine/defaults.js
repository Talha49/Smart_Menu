/**
 * Default Theme Presets
 * 
 * These are professionally-designed theme configurations that serve as:
 * 1. Quick-start templates for new restaurants
 * 2. Inspiration for custom themes
 * 3. Fallback defaults when themeConfig is not set
 * 
 * Each preset is a complete themeConfig object that can be used directly.
 */

/**
 * Modern Clean - Minimalist, professional aesthetic
 * Perfect for: Cafes, bakeries, clean eateries
 */
export const MODERN_CLEAN = {
  version: "2.0",
  
  background: {
    type: 'solid',
    color: '#FFFFFF'
  },
  
  typography: {
    fonts: {
      heading: { family: 'Inter', weight: 700 },
      body: { family: 'Inter', weight: 400 },
      accent: { family: 'Inter', weight: 600 }
    },
    sizes: {
      base: 16,
      scale: 1.25,
      categoryTitle: 32,
      itemName: 20,
      itemDescription: 14,
      price: 18
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    },
    letterSpacing: {
      tight: -0.02,
      normal: 0,
      wide: 0.05
    }
  },
  
  colors: {
    brand: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#D1D5DB'
    },
    backgrounds: {
      page: '#FFFFFF',
      card: '#F9FAFB',
      elevated: '#FFFFFF'
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      inverse: '#FFFFFF'
    },
    borders: {
      light: '#E5E7EB',
      medium: '#D1D5DB',
      dark: '#9CA3AF'
    },
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    }
  },
  
  spacing: {
    unit: 4,
    scale: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128],
    cardPadding: 20,
    sectionGap: 64,
    itemGap: 16
  },
  
  borders: {
    radius: {
      none: 0,
      sm: 4,
      md: 8,
      lg: 16,
      xl: 24,
      xxl: 32,
      full: 9999
    },
    widths: {
      none: 0,
      thin: 1,
      medium: 2,
      thick: 4
    }
  },
  
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
    xl: '0 20px 25px rgba(0,0,0,0.15)',
    xxl: '0 25px 50px rgba(0,0,0,0.25)'
  },
  
  menuItem: {
    layout: 'horizontal',
    image: {
      enabled: true,
      shape: 'rounded',
      aspectRatio: '1/1',
      position: 'left',
      objectFit: 'cover',
      borderRadius: 'lg'
    },
    card: {
      background: 'card',
      borderRadius: 'xl',
      shadow: 'sm',
      border: {
        width: 'thin',
        color: 'light'
      },
      padding: 20,
      hoverEffect: 'lift'
    },
    content: {
      alignment: 'left',
      nameSize: 20,
      descriptionSize: 14,
      priceSize: 18,
      pricePosition: 'inline'
    }
  },
  
  categorySection: {
    header: {
      style: 'minimal',
      size: 28,
      color: 'primary',
      alignment: 'left',
      decoration: {
        type: 'none'
      }
    },
    spacing: {
      top: 64,
      bottom: 24
    }
  },
  
  decorations: {
    enabled: false,
    elements: [],
    borderDecoration: {
      type: 'none'
    }
  },
  
  animations: {
    reducedMotion: false,
    pageLoad: {
      type: 'fade',
      duration: 600,
      easing: 'easeOut'
    },
    itemEntrance: {
      type: 'stagger',
      duration: 400,
      delay: 40
    },
    interactions: {
      hover: 'lift',
      tap: 'shrink'
    }
  }
};

/**
 * Retro Diner - Vintage 80s neon aesthetic
 * Perfect for: American diners, burger joints, retro-themed restaurants
 */
export const RETRO_DINER = {
  version: "2.0",
  
  background: {
    type: 'solid',
    color: '#1a1a1a'
  },
  
  typography: {
    fonts: {
      heading: { family: 'Bebas Neue', weight: 700 },
      body: { family: 'Roboto', weight: 400 },
      accent: { family: 'Pacifico', weight: 400 }
    },
    sizes: {
      base: 16,
      scale: 1.3,
      categoryTitle: 42,
      itemName: 24,
      itemDescription: 14,
      price: 22
    },
    lineHeights: {
      tight: 1.1,
      normal: 1.4,
      relaxed: 1.6
    },
    letterSpacing: {
      tight: 0,
      normal: 0.05,
      wide: 0.1
    }
  },
  
  colors: {
    brand: {
      primary: '#FF1493', // Neon pink
      secondary: '#00FFFF', // Cyan
      tertiary: '#FFD700'  // Gold
    },
    backgrounds: {
      page: '#1a1a1a',
      card: '#2a2a2a',
      elevated: '#333333'
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
      tertiary: '#B0B0B0',
      inverse: '#1a1a1a'
    },
    borders: {
      light: '#FF1493',
      medium: '#00FFFF',
      dark: '#FFD700'
    },
    semantic: {
      success: '#00FF00',
      warning: '#FFA500',
      error: '#FF0000',
      info: '#00FFFF'
    }
  },
  
  spacing: {
    unit: 4,
    scale: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128],
    cardPadding: 24,
    sectionGap: 48,
    itemGap: 20
  },
  
  borders: {
    radius: {
      none: 0,
      sm: 8,
      md: 12,
      lg: 20,
      xl: 32,
      xxl: 48,
      full: 9999
    },
    widths: {
      none: 0,
      thin: 2,
      medium: 3,
      thick: 5
    }
  },
  
  shadows: {
    none: 'none',
    sm: '0 0 10px rgba(255, 20, 147, 0.3)',
    md: '0 0 20px rgba(255, 20, 147, 0.5)',
    lg: '0 0 30px rgba(255, 20, 147, 0.7)',
    xl: '0 0 40px rgba(0, 255, 255, 0.8)',
    xxl: '0 0 60px rgba(255, 215, 0, 1)'
  },
  
  menuItem: {
    layout: 'horizontal',
    image: {
      enabled: true,
      shape: 'circle',
      aspectRatio: '1/1',
      position: 'left',
      objectFit: 'cover',
      borderRadius: 'full'
    },
    card: {
      background: 'card',
      borderRadius: 'lg',
      shadow: 'md',
      border: {
        width: 'medium',
        color: 'primary'
      },
      padding: 24,
      hoverEffect: 'glow'
    },
    content: {
      alignment: 'left',
      nameSize: 24,
      descriptionSize: 14,
      priceSize: 22,
      pricePosition: 'badge'
    }
  },
  
  categorySection: {
    header: {
      style: 'playful',
      size: 42,
      color: 'primary',
      alignment: 'center',
      decoration: {
        type: 'line',
        color: 'secondary',
        thickness: 3
      }
    },
    spacing: {
      top: 48,
      bottom: 32
    }
  },
  
  decorations: {
    enabled: false,
    elements: [],
    borderDecoration: {
      type: 'none'
    }
  },
  
  animations: {
    reducedMotion: false,
    pageLoad: {
      type: 'scale',
      duration: 800,
      easing: 'easeOut'
    },
    itemEntrance: {
      type: 'scale',
      duration: 500,
      delay: 60
    },
    interactions: {
      hover: 'glow',
      tap: 'shrink'
    }
  }
};

/**
 * Minimal Luxury - Premium, high-end aesthetic
 * Perfect for: Fine dining, upscale restaurants, luxury cafes
 */
export const MINIMAL_LUXURY = {
  version: "2.0",
  
  background: {
    type: 'solid',
    color: '#0F172A' // Deep navy
  },
  
  typography: {
    fonts: {
      heading: { family: 'Playfair Display', weight: 700 },
      body: { family: 'Lato', weight: 300 },
      accent: { family: 'Cinzel', weight: 600 }
    },
    sizes: {
      base: 16,
      scale: 1.2,
      categoryTitle: 36,
      itemName: 22,
      itemDescription: 15,
      price: 20
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.6,
      relaxed: 1.8
    },
    letterSpacing: {
      tight: -0.01,
      normal: 0.02,
      wide: 0.08
    }
  },
  
  colors: {
    brand: {
      primary: '#D4AF37', // Gold
      secondary: '#C0C0C0', // Silver
      tertiary: '#1E293B'  // Dark slate
    },
    backgrounds: {
      page: '#0F172A',
      card: '#1E293B',
      elevated: '#334155'
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#CBD5E1',
      tertiary: '#94A3B8',
      inverse: '#0F172A'
    },
    borders: {
      light: '#334155',
      medium: '#475569',
      dark: '#64748B'
    },
    semantic: {
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    }
  },
  
  spacing: {
    unit: 4,
    scale: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192],
    cardPadding: 32,
    sectionGap: 96,
    itemGap: 24
  },
  
  borders: {
    radius: {
      none: 0,
      sm: 2,
      md: 4,
      lg: 8,
      xl: 12,
      xxl: 16,
      full: 9999
    },
    widths: {
      none: 0,
      thin: 1,
      medium: 1,
      thick: 2
    }
  },
  
  shadows: {
    none: 'none',
    sm: '0 1px 3px rgba(212, 175, 55, 0.1)',
    md: '0 4px 8px rgba(212, 175, 55, 0.15)',
    lg: '0 10px 20px rgba(212, 175, 55, 0.2)',
    xl: '0 20px 30px rgba(212, 175, 55, 0.25)',
    xxl: '0 30px 50px rgba(212, 175, 55, 0.3)'
  },
  
  menuItem: {
    layout: 'vertical',
    image: {
      enabled: true,
      shape: 'rounded',
      aspectRatio: '4/3',
      position: 'top',
      objectFit: 'cover',
      borderRadius: 'sm'
    },
    card: {
      background: 'card',
      borderRadius: 'md',
      shadow: 'md',
      border: {
        width: 'thin',
        color: 'primary'
      },
      padding: 24,
      hoverEffect: 'lift'
    },
    content: {
      alignment: 'center',
      nameSize: 22,
      descriptionSize: 15,
      priceSize: 20,
      pricePosition: 'inline'
    }
  },
  
  categorySection: {
    header: {
      style: 'elegant',
      size: 36,
      color: 'primary',
      alignment: 'center',
      decoration: {
        type: 'line',
        color: 'primary',
        thickness: 1
      }
    },
    spacing: {
      top: 96,
      bottom: 48
    }
  },
  
  decorations: {
    enabled: false,
    elements: [],
    borderDecoration: {
      type: 'none'
    }
  },
  
  animations: {
    reducedMotion: false,
    pageLoad: {
      type: 'fade',
      duration: 1000,
      easing: 'easeOut'
    },
    itemEntrance: {
      type: 'fade',
      duration: 800,
      delay: 80
    },
    interactions: {
      hover: 'lift',
      tap: 'shrink'
    }
  }
};

/**
 * Playful Burger - Fun, kid-friendly aesthetic
 * Perfect for: Burger joints, family restaurants, casual dining
 */
export const PLAYFUL_BURGER = {
  version: "2.0",
  
  background: {
    type: 'solid',
    color: '#FFFEF2'
  },
  
  typography: {
    fonts: {
      heading: { family: 'Fredoka', weight: 700 },
      body: { family: 'Nunito', weight: 400 },
      accent: { family: 'Patrick Hand', weight: 400 }
    },
    sizes: {
      base: 16,
      scale: 1.3,
      categoryTitle: 38,
      itemName: 22,
      itemDescription: 15,
      price: 20
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7
    },
    letterSpacing: {
      tight: 0,
      normal: 0.01,
      wide: 0.03
    }
  },
  
  colors: {
    brand: {
      primary: '#10B981', // Green
      secondary: '#F59E0B', // Orange/yellow
      tertiary: '#EF4444'  // Red
    },
    backgrounds: {
      page: '#FFFEF2',
      card: '#FFFFFF',
      elevated: '#FFF9E6'
    },
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
      tertiary: '#6B7280',
      inverse: '#FFFFFF'
    },
    borders: {
      light: '#10B981',
      medium: '#059669',
      dark: '#047857'
    },
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    }
  },
  
  spacing: {
    unit: 4,
    scale: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96],
    cardPadding: 20,
    sectionGap: 48,
    itemGap: 20
  },
  
  borders: {
    radius: {
      none: 0,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 40,
      full: 9999
    },
    widths: {
      none: 0,
      thin: 2,
      medium: 4,
      thick: 6
    }
  },
  
  shadows: {
    none: 'none',
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 8px rgba(0,0,0,0.15)',
    lg: '0 8px 16px rgba(0,0,0,0.2)',
    xl: '0 12px 24px rgba(0,0,0,0.25)',
    xxl: '0 16px 32px rgba(0,0,0,0.3)'
  },
  
  menuItem: {
    layout: 'vertical',
    image: {
      enabled: true,
      shape: 'rounded',
      aspectRatio: '1/1',
      position: 'top',
      objectFit: 'cover',
      borderRadius: 'xl'
    },
    card: {
      background: 'card',
      borderRadius: 'xxl',
      shadow: 'lg',
      border: {
        width: 'medium',
        color: 'primary'
      },
      padding: 20,
      hoverEffect: 'scale'
    },
    content: {
      alignment: 'center',
      nameSize: 22,
      descriptionSize: 15,
      priceSize: 20,
      pricePosition: 'badge'
    }
  },
  
  categorySection: {
    header: {
      style: 'playful',
      size: 38,
      color: 'primary',
      alignment: 'center',
      decoration: {
        type: 'dots',
        color: 'secondary',
        thickness: 4
      }
    },
    spacing: {
      top: 48,
      bottom: 32
    }
  },
  
  decorations: {
    enabled: true,
    elements: [],
    borderDecoration: {
      type: 'checkered',
      color: '#10B981',
      width: 24,
      position: 'all'
    }
  },
  
  animations: {
    reducedMotion: false,
    pageLoad: {
      type: 'scale',
      duration: 700,
      easing: 'easeOut'
    },
    itemEntrance: {
      type: 'slide-up',
      duration: 500,
      delay: 50
    },
    interactions: {
      hover: 'scale',
      tap: 'shrink'
    }
  }
};

/**
 * Default theme mapping
 * Maps preset IDs to their configurations
 */
export const DEFAULT_THEMES = {
  'modern-clean': MODERN_CLEAN,
  'retro-diner': RETRO_DINER,
  'minimal-luxury': MINIMAL_LUXURY,
  'playful-burger': PLAYFUL_BURGER
};

/**
 * Get a theme by ID with fallback
 * @param {string} id - Theme preset ID
 * @returns {object} Theme configuration
 */
export function getThemePreset(id) {
  return DEFAULT_THEMES[id] || MODERN_CLEAN;
}

/**
 * Get list of all available presets
 * @returns {Array<{id: string, name: string, description: string}>}
 */
export function getAvailablePresets() {
  return [
    {
      id: 'modern-clean',
      name: 'Modern Clean',
      description: 'Minimalist, professional aesthetic perfect for cafes and bakeries',
      thumbnail: '/presets/modern-clean.jpg'
    },
    {
      id: 'retro-diner',
      name: 'Retro Diner',
      description: 'Vintage 80s neon aesthetic for American diners and burger joints',
      thumbnail: '/presets/retro-diner.jpg'
    },
    {
      id: 'minimal-luxury',
      name: 'Minimal Luxury',
      description: 'Premium, high-end aesthetic for fine dining establishments',
      thumbnail: '/presets/minimal-luxury.jpg'
    },
    {
      id: 'playful-burger',
      name: 'Playful Burger',
      description: 'Fun, kid-friendly aesthetic for family restaurants',
      thumbnail: '/presets/playful-burger.jpg'
    }
  ];
}
