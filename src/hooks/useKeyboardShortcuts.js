'use client';

import { useEffect } from 'react';

/**
 * Custom hook for keyboard shortcuts
 * Handles global keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts = {}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      const ctrlKey = event.ctrlKey || event.metaKey; // Support both Ctrl and Cmd
      const shiftKey = event.shiftKey;
      const altKey = event.altKey;

      // Build key combination string
      let combination = [];
      if (ctrlKey) combination.push('ctrl');
      if (shiftKey) combination.push('shift');
      if (altKey) combination.push('alt');
      combination.push(key.toLowerCase());

      const keyString = combination.join('+');

      // Check if this combination matches any shortcut
      if (shortcuts[keyString]) {
        event.preventDefault();
        shortcuts[keyString](event);
        return;
      }

      // Also check for single key shortcuts (when no modifiers)
      if (!ctrlKey && !shiftKey && !altKey && shortcuts[key.toLowerCase()]) {
        // Only trigger if not typing in an input
        if (
          event.target.tagName !== 'INPUT' &&
          event.target.tagName !== 'TEXTAREA' &&
          !event.target.isContentEditable
        ) {
          event.preventDefault();
          shortcuts[key.toLowerCase()](event);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}

