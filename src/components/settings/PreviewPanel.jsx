'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Reusable preview panel container
 * Sticky, full-height preview area
 */
export default function PreviewPanel({ 
  children, 
  className,
  title,
  headerContent 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={cn('h-full', className)}
    >
      <Card className="h-full overflow-hidden flex flex-col">
        {(title || headerContent) && (
          <div className="px-6 py-4 border-b border-gray-200 shrink-0 flex items-center justify-between gap-4">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {headerContent && (
              <div className="flex-1 flex justify-end">
                {headerContent}
              </div>
            )}
          </div>
        )}
        <div className="flex-1 overflow-hidden min-h-0 h-full">
          {children}
        </div>
      </Card>
    </motion.div>
  );
}

