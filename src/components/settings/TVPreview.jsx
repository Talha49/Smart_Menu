'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/store';

/**
 * Real TV Preview Component
 * Loads actual TV display page in iframe with TV frame
 */
export default function TVPreview({ refreshKey = 0 }) {
  const restaurantId = useAuthStore((state) => state.restaurantId);
  const restaurantSlug = useAuthStore((state) => state.restaurantSlug);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const iframeRef = useRef(null);

  const publicMenuId = restaurantSlug || restaurantId;
  const tvUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/tv/${publicMenuId}`
    : '';

  // Refresh iframe when settings change
  useEffect(() => {
    if (iframeRef.current && tvUrl) {
      setIsLoading(true);
      setError(false);
      // Force reload by changing src
      iframeRef.current.src = `${tvUrl}?t=${Date.now()}`;
    }
  }, [refreshKey, tvUrl]);

  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  if (!publicMenuId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white text-sm">No restaurant ID available</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full overflow-hidden p-6">
      <div className="relative" style={{ transform: 'scale(0.65)', transformOrigin: 'center center' }}>
        {/* TV Frame - Pure CSS */}
        <div className="relative w-[1200px] h-[675px] mx-auto">
          {/* TV Outer Frame */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg p-4 shadow-2xl">
            {/* Screen Bezel */}
            <div className="w-full h-full bg-black rounded-md p-3">
              {/* Screen Content */}
              <div className="w-full h-full bg-black rounded-sm overflow-hidden relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-white text-sm">Loading TV display...</p>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                    <p className="text-white text-sm">Failed to load TV display</p>
                  </div>
                )}
                <iframe
                  ref={iframeRef}
                  src={tvUrl}
                  className="w-full h-full border-0"
                  onLoad={handleLoad}
                  onError={handleError}
                  title="TV Display Preview"
                  sandbox="allow-same-origin allow-scripts"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
            {/* TV Stand */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-48 h-12 bg-gray-800 rounded-b-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
