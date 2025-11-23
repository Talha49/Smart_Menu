'use client';

import { useEffect } from 'react';

/**
 * Component to add mobile-specific optimizations
 * - Preload critical resources
 * - Optimize font loading
 * - Add mobile meta tags dynamically
 */
export default function MobileOptimizations() {
  useEffect(() => {
    // Add mobile-specific optimizations
    if (typeof window !== 'undefined') {
      // Preconnect to Google Fonts for faster loading
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = 'https://fonts.googleapis.com';
      document.head.appendChild(preconnect);

      const preconnect2 = document.createElement('link');
      preconnect2.rel = 'preconnect';
      preconnect2.href = 'https://fonts.gstatic.com';
      preconnect2.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect2);

      // Add DNS prefetch for external resources
      const dnsPrefetch = document.createElement('link');
      dnsPrefetch.rel = 'dns-prefetch';
      dnsPrefetch.href = 'https://fonts.googleapis.com';
      document.head.appendChild(dnsPrefetch);

      // Optimize scroll performance
      if ('scrollBehavior' in document.documentElement.style) {
        document.documentElement.style.scrollBehavior = 'smooth';
      }

      // Add touch action optimizations
      document.body.style.touchAction = 'pan-y';
    }
  }, []);

  return null;
}

