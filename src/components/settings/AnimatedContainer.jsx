'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Reusable animated container component
 * Provides consistent animation patterns
 */
export default function AnimatedContainer({ 
  children, 
  className,
  delay = 0,
  duration = 0.3,
  variant = 'fadeIn'
}) {
  const variants = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
    },
    slideLeft: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
    },
    slideRight: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
    },
  };

  const selectedVariant = variants[variant] || variants.fadeIn;

  return (
    <motion.div
      initial={selectedVariant.initial}
      animate={selectedVariant.animate}
      transition={{ duration, delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

