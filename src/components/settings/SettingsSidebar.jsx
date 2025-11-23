'use client';

import { motion } from 'framer-motion';
import { Palette, Image, Tv, ChevronRight, ChevronLeft, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    id: 'branding',
    label: 'Branding',
    icon: Palette,
    description: 'Logo & Colors',
  },
  {
    id: 'menu',
    label: 'Menu Design',
    icon: Image,
    description: 'Mobile Menu',
  },
  {
    id: 'tv',
    label: 'TV Display',
    icon: Tv,
    description: 'TV Screen',
  },
];

/**
 * Settings Sidebar Component
 * Clean, professional sidebar navigation
 * Fixed position, collapsible on mobile
 */
export default function SettingsSidebar({ activeSection, onSectionChange, isCollapsed = false, onToggleCollapse }) {
  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggleCollapse}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? '0' : '280px',
          opacity: isCollapsed ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 lg:relative lg:z-auto',
          'overflow-hidden flex flex-col',
          isCollapsed && 'lg:w-0'
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <>
                <h2 className="text-lg font-bold text-gray-900">Settings</h2>
                <button
                  onClick={onToggleCollapse}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Collapse sidebar"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
              </>
            )}
            {isCollapsed && (
              <button
                onClick={onToggleCollapse}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors w-full flex justify-center"
                aria-label="Expand sidebar"
                title="Expand sidebar"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
            )}
          </div>
          {!isCollapsed && (
            <p className="text-xs text-gray-500 mt-1">Customize your menu</p>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {!isCollapsed && menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                  'text-left group',
                  isActive
                    ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <div
                  className={cn(
                    'p-1.5 rounded-lg transition-colors shrink-0',
                    isActive
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div
                    className={cn(
                      'text-xs truncate',
                      isActive ? 'text-purple-600' : 'text-gray-500'
                    )}
                  >
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
          {isCollapsed && menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  'w-full p-2 rounded-lg transition-all',
                  isActive
                    ? 'bg-purple-100 text-purple-600'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
                title={item.label}
              >
                <Icon className="h-5 w-5 mx-auto" />
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200 shrink-0">
            <p className="text-xs text-gray-500 text-center">
              Pro Plan Features
            </p>
          </div>
        )}
      </motion.aside>
    </>
  );
}

