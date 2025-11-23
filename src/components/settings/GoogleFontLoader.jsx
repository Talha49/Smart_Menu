'use client';

import { useEffect } from 'react';
import { loadGoogleFont } from '@/lib/google-fonts';

/**
 * Component to dynamically load Google Fonts
 * Ensures fonts are loaded when selected
 */
export default function GoogleFontLoader({ fontFamily }) {
  useEffect(() => {
    if (fontFamily) {
      loadGoogleFont(fontFamily);
    }
  }, [fontFamily]);

  return null;
}

