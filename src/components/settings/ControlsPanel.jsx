'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Reusable controls panel container
 * Provides organized sections with proper spacing
 */
export default function ControlsPanel({ 
  children, 
  className,
  title,
  description 
}) {
  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 shadow-lg flex flex-col h-full min-h-0', className)}>
      {(title || description) && (
        <div className="p-6 border-b border-gray-200 shrink-0">
          {title && (
            <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {children}
      </div>
    </div>
  );
}

