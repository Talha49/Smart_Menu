'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Reusable full-screen split layout component
 * Left: Controls panel (scrollable)
 * Right: Preview panel (sticky)
 */
export default function SplitLayout({ 
  leftPanel, 
  rightPanel, 
  className,
  leftClassName,
  rightClassName 
}) {
  return (
    <div className={cn('flex h-[calc(100vh-8rem)] gap-6', className)}>
      {/* Left Panel - Controls */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'w-full lg:w-1/2 xl:w-2/5 shrink-0',
          leftClassName
        )}
      >
        <div className="h-full overflow-y-auto pr-2">
          {leftPanel}
        </div>
      </motion.div>

      {/* Right Panel - Preview */}
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.3, delay: 0.1 }}
             className={cn(
               'hidden lg:block w-full lg:w-1/2 xl:w-3/5 shrink-0',
               rightClassName
             )}
           >
             <div className="sticky top-6 h-[calc(100vh-8rem)]">
               {rightPanel}
             </div>
           </motion.div>
    </div>
  );
}

