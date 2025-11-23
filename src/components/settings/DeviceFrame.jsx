'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * CSS-based device frame component
 * No images needed - pure CSS styling
 * Supports Phone and TV frames
 */
export default function DeviceFrame({ 
  type = 'phone', // 'phone' | 'tv'
  children,
  className = '',
  scale = 1 
}) {
  if (type === 'phone') {
    return (
      <div 
        className={cn('relative mx-auto', className)}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      >
        {/* iPhone Frame - Pure CSS */}
        <div className="relative w-[375px] h-[812px] mx-auto">
          {/* Phone Outer Frame */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl">
            {/* Screen Bezel */}
            <div className="w-full h-full bg-black rounded-[2.5rem] p-1">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />
              
              {/* Screen Content */}
              <div className="w-full h-full bg-white rounded-[2.25rem] overflow-hidden relative">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'tv') {
    return (
      <div 
        className={cn('relative mx-auto', className)}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      >
        {/* TV Frame - Pure CSS */}
        <div className="relative w-[800px] h-[450px] mx-auto">
          {/* TV Outer Frame */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg p-3 shadow-2xl">
            {/* Screen Bezel */}
            <div className="w-full h-full bg-black rounded-md p-2">
              {/* Screen Content */}
              <div className="w-full h-full bg-black rounded-sm overflow-hidden relative">
                {children}
              </div>
            </div>
            {/* TV Stand (optional) */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-8 bg-gray-800 rounded-b-lg" />
          </div>
        </div>
      </div>
    );
  }

  return <div className={className}>{children}</div>;
}

