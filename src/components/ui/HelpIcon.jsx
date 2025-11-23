'use client';

import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Help icon with tooltip
 * Shows helpful information when hovered
 */
export default function HelpIcon({ content, className = '' }) {
  if (!content) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors ${className}`}
          aria-label="Help"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-xs">
        <p className="text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}

