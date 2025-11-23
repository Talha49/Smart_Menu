'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle, BookOpen, Video, MessageCircle } from 'lucide-react';

/**
 * Help System Component
 * Foundation for future tutorial/guide system
 */
export default function HelpSystem() {
  const [open, setOpen] = useState(false);

  const helpSections = [
    {
      icon: BookOpen,
      title: 'Getting Started Guide',
      description: 'Learn the basics of customizing your menu',
      status: 'coming-soon',
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides',
      status: 'coming-soon',
    },
    {
      icon: MessageCircle,
      title: 'FAQ & Support',
      description: 'Find answers to common questions',
      status: 'coming-soon',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Help & Support
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <p className="text-sm text-gray-600">
            Get help with customizing your menu, managing settings, and more.
          </p>
          <div className="grid grid-cols-1 gap-4">
            {helpSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={index}
                  className={`p-4 border rounded-lg transition-all ${
                    section.status === 'coming-soon'
                      ? 'border-gray-200 bg-gray-50 opacity-60'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {section.title}
                        {section.status === 'coming-soon' && (
                          <span className="ml-2 text-xs text-gray-500 font-normal">
                            (Coming Soon)
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need immediate help? Look for the <HelpCircle className="h-3 w-3 inline" /> icon next to any setting for quick tips.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

