'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * Optimized image component for mobile
 * - Lazy loading
 * - Responsive sizes
 * - WebP support
 * - Placeholder while loading
 */
export default function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  objectFit = 'cover',
  priority = false,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // For external URLs (Vercel Blob), use regular img with optimizations
  if (src && (src.startsWith('http://') || src.startsWith('https://'))) {
    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
        )}
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          style={{ objectFit, width: '100%', height: '100%' }}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setError(true);
            setIsLoading(false);
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
            <span className="text-xs">Image unavailable</span>
          </div>
        )}
      </div>
    );
  }

  // For local images, use Next.js Image component
  return (
    <Image
      src={src || '/placeholder.png'}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ objectFit }}
      loading={priority ? 'eager' : 'lazy'}
      quality={85}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}

