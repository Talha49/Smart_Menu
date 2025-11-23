'use client';

import React, { memo } from 'react';
import useSWR from 'swr';
import { useMenuSettings } from '@/context/MenuSettingsContext';
import GoogleFontLoader from './GoogleFontLoader';
import {
  formatPrice,
  getTextStyleClasses,
  getHeadingStyleClasses,
  getCardShadowClass,
  getCardPaddingClass,
  getBulletStyle,
  getBulletContent,
} from '@/lib/menu-utils';

const fetcher = (url) => fetch(url).then((r) => r.json());

const MenuPreview = memo(function MenuPreview() {
  const { settings } = useMenuSettings();
  const { data, isLoading, error } = useSWR('/api/menu-items/preview', fetcher, {
    refreshInterval: 5000, // Refresh every 5 seconds
  });

  const menuData = data?.items || {};

  // Get size classes
  const getSizeClass = (size) => {
    switch (size) {
      case 'small':
        return { heading: 'text-2xl', body: 'text-sm', price: 'text-base' };
      case 'medium':
        return { heading: 'text-3xl', body: 'text-base', price: 'text-lg' };
      case 'large':
        return { heading: 'text-4xl', body: 'text-lg', price: 'text-xl' };
      default:
        return { heading: 'text-3xl', body: 'text-base', price: 'text-lg' };
    }
  };

  const getWeightClass = (weight) => {
    switch (weight) {
      case 'light':
        return 'font-light';
      case 'normal':
        return 'font-normal';
      case 'bold':
        return 'font-bold';
      default:
        return 'font-normal';
    }
  };

  const getCardStyleClasses = (style) => {
    switch (style) {
      case 'minimal':
        return 'border-0 shadow-sm';
      case 'bordered':
        return 'border-2 border-gray-200 shadow-none';
      case 'elevated':
        return 'border border-gray-200 shadow-lg';
      case 'flat':
        return 'border-2 border-gray-200 shadow-none';
      default:
        return 'border border-gray-200 shadow-lg';
    }
  };

  const getBorderRadiusClass = (radius) => {
    switch (radius) {
      case 'sharp':
        return 'rounded-none';
      case 'rounded':
        return 'rounded-lg';
      case 'very-rounded':
        return 'rounded-2xl';
      default:
        return 'rounded-lg';
    }
  };

  const getSpacingClass = (spacing) => {
    switch (spacing) {
      case 'compact':
        return 'gap-2';
      case 'normal':
        return 'gap-4';
      case 'spacious':
        return 'gap-6';
      default:
        return 'gap-4';
    }
  };

  const sizes = getSizeClass(settings.headingSize);
  const bodySizes = getSizeClass(settings.bodySize);
  const priceSizes = getSizeClass(settings.priceSize);
  const weight = getWeightClass(settings.fontWeight);
  const cardStyle = getCardStyleClasses(settings.cardStyle);
  const borderRadius = getBorderRadiusClass(settings.borderRadius);
  const spacing = getSpacingClass(settings.spacing);

  // Get grid columns class
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[settings.gridColumns || 3] || 'grid-cols-3';

  // Background style
  const backgroundStyle =
    settings.backgroundType === 'gradient'
      ? {
          background: `linear-gradient(135deg, ${settings.backgroundColor || '#f9fafb'} 0%, ${settings.cardBackgroundColor || '#ffffff'} 100%)`,
        }
      : { backgroundColor: settings.backgroundColor || '#f9fafb' };

  if (isLoading) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
        <div className="rounded-lg p-6 min-h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading menu items...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
        <div className="rounded-lg p-6 min-h-[600px] flex items-center justify-center">
          <p className="text-red-600">Failed to load menu items</p>
        </div>
      </div>
    );
  }

  const hasItems = Object.keys(menuData).length > 0;

  // Apply Google Font
  const fontStyle = settings.fontFamily ? { fontFamily: settings.fontFamily } : {};

  // Get style classes
  const textStyleClasses = getTextStyleClasses(settings);
  const headingStyleClasses = getHeadingStyleClasses(settings);
  const cardShadow = getCardShadowClass(settings.cardShadow);
  const cardPadding = getCardPaddingClass(settings.cardPadding);
  const hoverEffect = settings.cardHoverEffect !== false ? 'hover:shadow-xl transition-shadow' : '';

  return (
    <div className="w-full">
      <GoogleFontLoader fontFamily={settings.fontFamily} />
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
      <div
        className="rounded-lg p-6 min-h-[600px] transition-all"
        style={{ ...backgroundStyle, ...fontStyle }}
      >
        {/* Preview Header */}
        <div className="mb-8 text-center">
          <h1
            className={`${sizes.heading} ${headingStyleClasses} mb-3 tracking-tight`}
            style={{ color: settings.accentColor || '#000000' }}
          >
            Restaurant Menu
          </h1>
        </div>

        {/* Preview Menu */}
        {hasItems ? (
          <div className="space-y-8">
            {Object.entries(menuData).map(([category, items]) => (
            <div key={category} className="space-y-4">
              {settings.showCategoryHeaders !== false && (
                <h2
                  className={`${sizes.heading} ${headingStyleClasses} mb-4 pb-3 border-b-2`}
                  style={{
                    borderColor: settings.accentColor || '#000000',
                    color: settings.accentColor || '#000000',
                  }}
                >
                  {category}
                </h2>
              )}
              <div className={`grid ${gridCols} ${spacing}`}>
                {items.map((item) => {
                  // Price position logic
                  const pricePosition = settings.pricePosition || 'right';
                  const showBullet = settings.showBulletPoints !== false;
                  const bulletStyle = getBulletStyle(settings.bulletStyle);
                  const bulletContent = getBulletContent(settings.bulletStyle);
                  
                  return (
                    <div
                      key={item.id}
                      className={`${cardPadding} ${cardStyle} ${borderRadius} ${cardShadow} ${hoverEffect} transition-all`}
                      style={{
                        backgroundColor: settings.cardBackgroundColor || '#ffffff',
                        borderColor: settings.borderColor || '#e5e7eb',
                        borderWidth: settings.cardBorderWidth ? `${settings.cardBorderWidth}px` : '1px',
                      }}
                    >
                      <div className="space-y-2">
                        {/* Price position: left or inline */}
                        {(pricePosition === 'left' || pricePosition === 'inline') && (
                          <div className="flex items-start justify-between gap-3">
                            {pricePosition === 'left' && (
                              <span
                                className={`${priceSizes.price} ${textStyleClasses} whitespace-nowrap`}
                                style={{ color: settings.priceColor || '#111827' }}
                              >
                                {formatPrice(item.price, settings)}
                              </span>
                            )}
                            <h3
                              className={`${bodySizes.body} ${textStyleClasses} flex-1`}
                              style={{ color: settings.textColor || '#111827' }}
                            >
                              {showBullet && settings.bulletStyle !== 'none' && (
                                <span
                                  className="mr-2"
                                  style={{ color: settings.bulletColor || settings.accentColor || '#000000' }}
                                >
                                  {bulletContent}
                                </span>
                              )}
                              {item.name}
                            </h3>
                            {pricePosition === 'inline' && (
                              <span
                                className={`${priceSizes.price} ${textStyleClasses} whitespace-nowrap`}
                                style={{ color: settings.priceColor || '#111827' }}
                              >
                                {formatPrice(item.price, settings)}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Price position: right (default) */}
                        {pricePosition === 'right' && (
                          <div className="flex items-start justify-between gap-3">
                            <h3
                              className={`${bodySizes.body} ${textStyleClasses} flex-1`}
                              style={{ color: settings.textColor || '#111827' }}
                            >
                              {showBullet && settings.bulletStyle !== 'none' && (
                                <span
                                  className="mr-2"
                                  style={{ color: settings.bulletColor || settings.accentColor || '#000000' }}
                                >
                                  {bulletContent}
                                </span>
                              )}
                              {item.name}
                            </h3>
                            <span
                              className={`${priceSizes.price} ${textStyleClasses} whitespace-nowrap`}
                              style={{ color: settings.priceColor || '#111827' }}
                            >
                              {formatPrice(item.price, settings)}
                            </span>
                          </div>
                        )}

                        {/* Price position: below */}
                        {pricePosition === 'below' && (
                          <>
                            <h3
                              className={`${bodySizes.body} ${textStyleClasses}`}
                              style={{ color: settings.textColor || '#111827' }}
                            >
                              {showBullet && settings.bulletStyle !== 'none' && (
                                <span
                                  className="mr-2"
                                  style={{ color: settings.bulletColor || settings.accentColor || '#000000' }}
                                >
                                  {bulletContent}
                                </span>
                              )}
                              {item.name}
                            </h3>
                            <span
                              className={`${priceSizes.price} ${textStyleClasses}`}
                              style={{ color: settings.priceColor || '#111827' }}
                            >
                              {formatPrice(item.price, settings)}
                            </span>
                          </>
                        )}

                        {settings.showDescriptions !== false && item.description && (
                          <p
                            className={`${bodySizes.body} leading-relaxed`}
                            style={{ color: settings.textColor || '#111827', opacity: 0.7 }}
                          >
                            {item.description}
                          </p>
                        )}

                        {/* Item Image */}
                        {item.imageUrl && (
                          <div className="mt-2">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-500 mb-2">No menu items yet</p>
              <p className="text-sm text-gray-400">Add items in the dashboard to see them here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default MenuPreview;

