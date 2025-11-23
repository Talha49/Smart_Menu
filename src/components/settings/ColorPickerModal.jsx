'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';

// Lazy load color picker
const SketchPicker = dynamic(
  () => import('react-color').then((mod) => mod.SketchPicker),
  { ssr: false }
);

/**
 * Color Picker Modal with Portal
 * Fixed z-index (102) - Always on top
 * Properly centered and positioned
 */
export default function ColorPickerModal({ 
  isOpen, 
  onClose, 
  color, 
  onChange,
  position = { top: '50%', left: '50%' } // Default center
}) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || typeof window === 'undefined') return null;

  // Always center the color picker to prevent overlap
  const getPosition = () => {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Color Picker - Always centered */}
      <div
        className="fixed z-[102]"
        style={getPosition()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-white rounded-lg shadow-2xl p-2">
          <SketchPicker
            color={color}
            onChange={(color) => onChange(color.hex)}
            disableAlpha
          />
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors z-10 border-2 border-gray-200"
            aria-label="Close color picker"
          >
            <span className="text-gray-700 text-lg font-bold leading-none">×</span>
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}

