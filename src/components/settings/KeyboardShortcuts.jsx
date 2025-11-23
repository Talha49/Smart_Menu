'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Keyboard, Command } from 'lucide-react';

/**
 * Keyboard shortcuts component
 * Shows available keyboard shortcuts and handles them
 */
export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: ['Ctrl', 'K'], mac: ['⌘', 'K'], description: 'Open command palette' },
        { keys: ['Esc'], description: 'Close dialogs/modals' },
      ],
    },
    {
      category: 'Settings',
      items: [
        { keys: ['Ctrl', 'S'], mac: ['⌘', 'S'], description: 'Save settings' },
        { keys: ['Ctrl', 'Z'], mac: ['⌘', 'Z'], description: 'Undo changes' },
        { keys: ['Ctrl', 'Shift', 'Z'], mac: ['⌘', 'Shift', 'Z'], description: 'Redo changes' },
      ],
    },
    {
      category: 'Menu Management',
      items: [
        { keys: ['N'], description: 'New menu item' },
        { keys: ['Delete'], description: 'Delete selected item' },
        { keys: ['Ctrl', 'F'], mac: ['⌘', 'F'], description: 'Search items' },
      ],
    },
  ];

  const formatKeys = (keys, isMacDevice) => {
    const keysToShow = isMacDevice && keys.mac ? keys.mac : keys.keys;
    return keysToShow.map((key, index) => (
      <span key={index}>
        <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg shadow-sm">
          {key}
        </kbd>
        {index < keysToShow.length - 1 && <span className="mx-1 text-gray-400">+</span>}
      </span>
    ));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
            onClick={() => setOpen(true)}
          >
            <Keyboard className="h-4 w-4 mr-2" />
            Shortcuts
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {shortcuts.map((category) => (
              <div key={category.category}>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-sm text-gray-600">{item.description}</span>
                      <div className="flex items-center gap-1">
                        {formatKeys(item, isMac)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Tip: Press <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 rounded">?</kbd> to toggle this help
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

