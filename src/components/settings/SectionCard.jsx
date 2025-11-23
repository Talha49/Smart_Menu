'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

/**
 * Reusable section card for grouping controls
 * Provides consistent styling and animations
 */
export default function SectionCard({ 
  children, 
  title,
  description,
  className,
  showSeparator = true,
  index = 0 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className={cn('p-6', className)}>
        {(title || description) && (
          <div className="mb-6">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </div>
        )}
        <div className="space-y-6">
          {children}
        </div>
      </Card>
      {showSeparator && <Separator className="my-6" />}
    </motion.div>
  );
}

