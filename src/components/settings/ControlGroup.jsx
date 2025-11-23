'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import HelpIcon from '@/components/ui/HelpIcon';

/**
 * Reusable control group component
 * Groups related controls with consistent spacing
 */
export default function ControlGroup({ 
  children, 
  label,
  description,
  helpText,
  className,
  required = false 
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={cn('space-y-2', className)}
    >
      {label && (
        <div className="flex items-center gap-2">
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {helpText && <HelpIcon content={helpText} />}
        </div>
      )}
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      <div className="space-y-3">
        {children}
      </div>
    </motion.div>
  );
}

