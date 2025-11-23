'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import Watermark from '@/components/public/watermark';
import {
  getSizeClasses,
  getWeightClass,
  getCardStyleClasses,
  getBorderRadiusClass,
  getSpacingClass,
  getGridColsClass,
  getBackgroundStyle,
  getFontFamily,
} from '@/lib/menu-styles';
import {
  formatPrice,
  getTextStyleClasses,
  getHeadingStyleClasses,
  getCardShadowClass,
  getCardPaddingClass,
  getBulletContent,
} from '@/lib/menu-utils';
import { loadGoogleFont } from '@/lib/google-fonts';
import OptimizedImage from '@/components/public/OptimizedImage';
import MobileOptimizations from '@/components/public/MobileOptimizations';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function PublicMenuPage() {
  const params = useParams();
  const { data, isLoading } = useSWR(`/api/public-menu?id=${params.restaurantId}`, fetcher, {
    refreshInterval: 30000,
  });

  // Extract data safely (hooks must be called before any returns)
  const restaurant = data?.restaurant;
  const items = data?.items;
  const isFreeTier = restaurant?.plan === 'free' || !restaurant?.plan;
  const settings = restaurant?.menuSettings || {};

  // Memoize style calculations for performance (must be called before conditional returns)
  const styleClasses = useMemo(() => {
    if (!restaurant || !settings) {
      return {
        sizes: getSizeClasses('medium'),
        bodySizes: getSizeClasses('medium'),
        priceSizes: getSizeClasses('medium'),
        weight: getWeightClass('normal'),
        cardStyle: getCardStyleClasses('elevated'),
        borderRadius: getBorderRadiusClass('rounded'),
        spacing: getSpacingClass('normal'),
        gridCols: getGridColsClass(3),
        backgroundStyle: getBackgroundStyle({}),
        fontFamily: getFontFamily({}),
        accentColor: '#000000',
      };
    }
    return {
      sizes: getSizeClasses(settings.headingSize),
      bodySizes: getSizeClasses(settings.bodySize),
      priceSizes: getSizeClasses(settings.priceSize),
      weight: getWeightClass(settings.fontWeight),
      cardStyle: getCardStyleClasses(settings.cardStyle),
      borderRadius: getBorderRadiusClass(settings.borderRadius),
      spacing: getSpacingClass(settings.spacing),
      gridCols: getGridColsClass(settings.gridColumns),
      backgroundStyle: getBackgroundStyle(settings),
      fontFamily: getFontFamily(settings),
      accentColor: settings.accentColor || restaurant.brandColor || '#000000',
    };
  }, [settings, restaurant?.brandColor, restaurant]);

  // Now safe to have conditional returns
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (!data || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Menu Not Found</h1>
          <p className="text-gray-600">The menu you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const { sizes, bodySizes, priceSizes, weight, cardStyle, borderRadius, spacing, gridCols, backgroundStyle, fontFamily, accentColor } = styleClasses;

  // Load Google Font
  if (settings.fontFamily && typeof window !== 'undefined') {
    loadGoogleFont(settings.fontFamily);
  }

  // Get additional style classes
  const textStyleClasses = getTextStyleClasses(settings);
  const headingStyleClasses = getHeadingStyleClasses(settings);
  const cardShadow = getCardShadowClass(settings.cardShadow);
  const cardPadding = getCardPaddingClass(settings.cardPadding);
  const hoverEffect = settings.cardHoverEffect !== false ? 'hover:shadow-xl transition-shadow' : '';

  return (
    <>
      <MobileOptimizations />
      <div
        className="min-h-screen transition-all touch-pan-y"
        style={{ ...backgroundStyle, ...fontFamily }}
      >
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          {restaurant.logoUrl && (
            <div className="mb-6 flex justify-center">
              <OptimizedImage
                src={restaurant.logoUrl}
                alt={restaurant.name}
                className="h-24 w-auto object-contain"
                width={96}
                height={96}
                objectFit="contain"
                priority={true}
              />
            </div>
          )}
          <h1 
            className={`${sizes.heading} ${headingStyleClasses} mb-3 tracking-tight`}
            style={{ color: accentColor }}
          >
            {restaurant.name}
          </h1>
        </div>

        {/* Menu Items */}
        <div className="space-y-10">
          {Object.entries(items || {}).map(([category, categoryItems]) => (
            <div key={category} className="space-y-4">
              {settings.showCategoryHeaders !== false && (
                <h2 
                  className={`${sizes.heading} ${headingStyleClasses} mb-6 pb-3 border-b-2`}
                  style={{ borderColor: accentColor, color: accentColor }}
                >
                  {category}
                </h2>
              )}
              <div className={`grid ${gridCols} ${spacing}`}>
                {categoryItems?.map((item) => {
                  const pricePosition = settings.pricePosition || 'right';
                  const showBullet = settings.showBulletPoints !== false;
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
                        {pricePosition === 'right' && (
                          <div className="flex items-start justify-between gap-3">
                            <h3
                              className={`${bodySizes.body} ${textStyleClasses} flex-1`}
                              style={{ color: settings.textColor || '#111827' }}
                            >
                              {showBullet && settings.bulletStyle !== 'none' && (
                                <span
                                  className="mr-2"
                                  style={{ color: settings.bulletColor || accentColor }}
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
                        {pricePosition === 'below' && (
                          <>
                            <h3
                              className={`${bodySizes.body} ${textStyleClasses}`}
                              style={{ color: settings.textColor || '#111827' }}
                            >
                              {showBullet && settings.bulletStyle !== 'none' && (
                                <span
                                  className="mr-2"
                                  style={{ color: settings.bulletColor || accentColor }}
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
                        {item.imageUrl && (
                          <div className="mt-2">
                            <OptimizedImage
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-32 object-cover rounded-lg"
                              width={400}
                              height={128}
                              objectFit="cover"
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

        {/* Watermark for Free Tier */}
        {isFreeTier && <Watermark variant="page" />}
      </div>
    </div>
    </>
  );
}
