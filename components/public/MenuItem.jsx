"use client";

/**
 * Polymorphic Menu Item Cards
 * 
 * 4 card variants that adapt to themeConfig:
 * - HorizontalCard: Image left, content right (default)
 * - VerticalCard: Image top, content bottom (Instagram-style)
 * - OverlayCard: Image background, content overlay
 * - MinimalCard: Text-only, compact
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

/**
 * Main MenuItem Component (Polymorphic)
 * Selects card variant based on themeConfig
 */
export function MenuItem({ item, theme, onClick }) {
    const layout = theme?.menuItem?.layout || 'horizontal';

    const CardComponent = {
        horizontal: HorizontalCard,
        vertical: VerticalCard,
        overlay: OverlayCard,
        minimal: MinimalCard
    }[layout] || HorizontalCard;

    return <CardComponent item={item} theme={theme} onClick={onClick} />;
}

/**
 * Horizontal Card
 * Image left, content right - classic restaurant menu style
 */
export function HorizontalCard({ item, theme, onClick }) {
    const [imageLoaded, setImageLoaded] = useState(false);

    const cardRadius = theme?.borders?.radius?.[theme?.menuItem?.card?.borderRadius] || 16;
    const cardShadow = theme?.shadows?.[theme?.menuItem?.card?.shadow] || '0 2px 4px rgba(0,0,0,0.05)';
    const cardBg = theme?.colors?.backgrounds?.card || '#FFFFFF';
    const imageEnabled = theme?.menuItem?.image?.enabled !== false && item.imageUrl;

    return (
        <motion.div
            onClick={onClick}
            className="group flex items-center gap-4 cursor-pointer transition-all duration-300"
            style={{
                backgroundColor: cardBg,
                borderRadius: `${cardRadius}px`,
                boxShadow: cardShadow,
                padding: `${theme?.menuItem?.card?.padding || 16}px`
            }}
            whileHover={{
                scale: theme?.menuItem?.card?.hoverEffect === 'scale' ? 1.02 : 1,
                y: theme?.menuItem?.card?.hoverEffect === 'lift' ? -4 : 0,
                boxShadow: theme?.menuItem?.card?.hoverEffect === 'glow'
                    ? `0 8px 20px ${theme?.colors?.brand?.primary}30`
                    : cardShadow
            }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Image */}
            {imageEnabled && (
                <div
                    className="flex-shrink-0 overflow-hidden"
                    style={{
                        width: theme?.menuItem?.image?.position === 'left' ? '120px' : '80px',
                        height: theme?.menuItem?.image?.position === 'left' ? '120px' : '80px',
                        borderRadius: `${theme?.borders?.radius?.[theme?.menuItem?.image?.borderRadius] || 12}px`
                    }}
                >
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className={cn(
                            "w-full h-full transition-all duration-500",
                            theme?.menuItem?.image?.objectFit || 'object-cover',
                            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110",
                            "group-hover:scale-110"
                        )}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />
                </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3
                    className="font-bold line-clamp-2 mb-2"
                    style={{
                        fontSize: `${theme?.typography?.sizes?.itemName || 18}px`,
                        color: theme?.colors?.text?.primary
                    }}
                >
                    {item.name}
                </h3>

                {item.description && (
                    <p
                        className="line-clamp-2"
                        style={{
                            fontSize: `${theme?.typography?.sizes?.itemDescription || 14}px`,
                            color: theme?.colors?.text?.secondary
                        }}
                    >
                        {item.description}
                    </p>
                )}
            </div>

            {/* Price */}
            <div
                className="flex-shrink-0 font-bold"
                style={{
                    fontSize: `${theme?.typography?.sizes?.price || 18}px`,
                    color: theme?.colors?.brand?.primary
                }}
            >
                ${item.price}
            </div>
        </motion.div>
    );
}

/**
 * Vertical Card
 * Image top, content bottom - Instagram/Pinterest style
 */
export function VerticalCard({ item, theme, onClick }) {
    const [imageLoaded, setImageLoaded] = useState(false);

    const cardRadius = theme?.borders?.radius?.[theme?.menuItem?.card?.borderRadius] || 16;
    const cardShadow = theme?.shadows?.[theme?.menuItem?.card?.shadow] || '0 4px 6px rgba(0,0,0,0.1)';
    const cardBg = theme?.colors?.backgrounds?.card || '#FFFFFF';
    const imageEnabled = theme?.menuItem?.image?.enabled !== false && item.imageUrl;

    return (
        <motion.div
            onClick={onClick}
            className="group cursor-pointer overflow-hidden transition-all duration-300"
            style={{
                backgroundColor: cardBg,
                borderRadius: `${cardRadius}px`,
                boxShadow: cardShadow
            }}
            whileHover={{
                scale: theme?.menuItem?.card?.hoverEffect === 'scale' ? 1.03 : 1,
                y: theme?.menuItem?.card?.hoverEffect === 'lift' ? -6 : 0
            }}
            whileTap={{ scale: 0.97 }}
        >
            {/* Image */}
            {imageEnabled && (
                <div
                    className="relative overflow-hidden"
                    style={{
                        aspectRatio: theme?.menuItem?.image?.aspectRatio || '4/3'
                    }}
                >
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className={cn(
                            "w-full h-full transition-all duration-500",
                            theme?.menuItem?.image?.objectFit || 'object-cover',
                            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110",
                            "group-hover:scale-105"
                        )}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />
                </div>
            )}

            {/* Content */}
            <div style={{ padding: `${theme?.menuItem?.card?.padding || 20}px` }}>
                <h3
                    className="font-bold line-clamp-2 mb-2"
                    style={{
                        fontSize: `${theme?.typography?.sizes?.itemName || 20}px`,
                        color: theme?.colors?.text?.primary
                    }}
                >
                    {item.name}
                </h3>

                {item.description && (
                    <p
                        className="line-clamp-3 mb-3"
                        style={{
                            fontSize: `${theme?.typography?.sizes?.itemDescription || 14}px`,
                            color: theme?.colors?.text?.secondary
                        }}
                    >
                        {item.description}
                    </p>
                )}

                {/* Price */}
                <div
                    className="font-bold"
                    style={{
                        fontSize: `${theme?.typography?.sizes?.price || 20}px`,
                        color: theme?.colors?.brand?.primary
                    }}
                >
                    ${item.price}
                </div>
            </div>
        </motion.div>
    );
}

/**
 * Overlay Card
 * Image background with content overlay - dramatic presentation
 */
export function OverlayCard({ item, theme, onClick }) {
    const [imageLoaded, setImageLoaded] = useState(false);

    const cardRadius = theme?.borders?.radius?.[theme?.menuItem?.card?.borderRadius] || 16;
    const cardShadow = theme?.shadows?.[theme?.menuItem?.card?.shadow] || '0 8px 16px rgba(0,0,0,0.2)';
    const imageEnabled = theme?.menuItem?.image?.enabled !== false && item.imageUrl;

    return (
        <motion.div
            onClick={onClick}
            className="group relative cursor-pointer overflow-hidden"
            style={{
                borderRadius: `${cardRadius}px`,
                boxShadow: cardShadow,
                aspectRatio: '4/3',
                minHeight: '250px'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Background Image */}
            {imageEnabled ? (
                <img
                    src={item.imageUrl}
                    alt={item.name}
                    className={cn(
                        "absolute inset-0 w-full h-full transition-all duration-700",
                        theme?.menuItem?.image?.objectFit || 'object-cover',
                        imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110",
                        "group-hover:scale-110"
                    )}
                    onLoad={() => setImageLoaded(true)}
                    loading="lazy"
                />
            ) : (
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: theme?.colors?.brand?.primary }}
                />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3
                    className="font-bold line-clamp-2 mb-2"
                    style={{
                        fontSize: `${theme?.typography?.sizes?.itemName || 22}px`
                    }}
                >
                    {item.name}
                </h3>

                {item.description && (
                    <p
                        className="line-clamp-2 mb-3 text-white/90"
                        style={{
                            fontSize: `${theme?.typography?.sizes?.itemDescription || 14}px`
                        }}
                    >
                        {item.description}
                    </p>
                )}

                {/* Price Badge */}
                <div
                    className="inline-flex items-center justify-center px-4 py-2 rounded-full font-bold self-start"
                    style={{
                        fontSize: `${theme?.typography?.sizes?.price || 18}px`,
                        backgroundColor: theme?.colors?.brand?.primary,
                        color: 'white'
                    }}
                >
                    ${item.price}
                </div>
            </div>
        </motion.div>
    );
}

/**
 * Minimal Card
 * Text-only, compact - for high-density menus
 */
export function MinimalCard({ item, theme, onClick }) {
    return (
        <motion.div
            onClick={onClick}
            className="group cursor-pointer border-b transition-all duration-200 py-4"
            style={{
                borderColor: theme?.colors?.borders?.light || '#E5E7EB'
            }}
            whileHover={{
                backgroundColor: theme?.colors?.backgrounds?.card || '#F9FAFB',
                paddingLeft: '8px'
            }}
        >
            <div className="flex items-baseline justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h3
                        className="font-semibold line-clamp-1"
                        style={{
                            fontSize: `${theme?.typography?.sizes?.itemName || 16}px`,
                            color: theme?.colors?.text?.primary
                        }}
                    >
                        {item.name}
                    </h3>

                    {item.description && (
                        <p
                            className="line-clamp-1 mt-1"
                            style={{
                                fontSize: `${theme?.typography?.sizes?.itemDescription || 13}px`,
                                color: theme?.colors?.text?.secondary
                            }}
                        >
                            {item.description}
                        </p>
                    )}
                </div>

                {/* Price */}
                <div
                    className="flex-shrink-0 font-bold"
                    style={{
                        fontSize: `${theme?.typography?.sizes?.price || 16}px`,
                        color: theme?.colors?.brand?.primary
                    }}
                >
                    ${item.price}
                </div>
            </div>
        </motion.div>
    );
}
