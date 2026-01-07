"use client";

/**
 * Masonry Layout
 * Pinterest-style dynamic grid layout
 * Pure CSS implementation using column-count
 */

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

import { MenuItem } from "../MenuItem";

export function MasonryLayout({ groupedItems, setSelectedItem, isTVMode }) {
    const theme = useTheme();
    const config = theme.config;

    // Flatten all items from all categories
    const allItems = groupedItems.flatMap(category =>
        category.items.map(item => ({ ...item, categoryName: category.name }))
    );

    // Responsive column counts from layoutConfig
    const columns = {
        mobile: config.layoutConfig?.responsive?.mobile?.columns || 1,
        tablet: config.layoutConfig?.responsive?.tablet?.columns || 2,
        desktop: config.layoutConfig?.responsive?.desktop?.columns || 3
    };

    const gap = config.layoutConfig?.responsive?.desktop?.gap || 24;

    return (
        <div className="space-y-12">
            {groupedItems.map((category, catIndex) => (
                <section key={category.name} className="masonry-section">
                    {/* Category Header */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: catIndex * 0.1 }}
                        className={cn(
                            "font-bold mb-6",
                            config.categorySection?.header?.alignment === 'center' ? "text-center" : "text-left"
                        )}
                        style={{
                            fontSize: `${config.categorySection?.header?.size || 32}px`,
                            color: config.colors?.brand?.primary || '#111827'
                        }}
                    >
                        {category.name}
                    </motion.h2>

                    {/* Masonry Grid */}
                    <div className="masonry-grid">
                        <style jsx>{`
              .masonry-grid {
                column-count: ${columns.mobile};
                column-gap: ${gap}px;
              }
              
              @media (min-width: 640px) {
                .masonry-grid {
                  column-count: ${columns.tablet};
                }
              }
              
              @media (min-width: 1024px) {
                .masonry-grid {
                  column-count: ${columns.desktop};
                }
              }
              
              .masonry-item {
                break-inside: avoid;
                page-break-inside: avoid;
                margin-bottom: ${gap}px;
              }
            `}</style>

                        {category.items.map((item, index) => (
                            <motion.div
                                key={item._id}
                                className="masonry-item menu-item"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <MenuItem
                                    item={item}
                                    theme={config}
                                    onClick={() => setSelectedItem(item)}
                                />
                            </motion.div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
