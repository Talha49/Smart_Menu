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
  getBulletContent,
} from '@/lib/menu-utils';
import { loadGoogleFont } from '@/lib/google-fonts';
import MobileOptimizations from '@/components/public/MobileOptimizations';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function TVMenuPage() {
  const params = useParams();
  const { data, isLoading } = useSWR(`/api/public-menu?id=${params.restaurantId}`, fetcher, {
    refreshInterval: 30000,
  });

  // Extract data safely (hooks must be called before any returns)
  const restaurant = data?.restaurant;
  const items = data?.items;
  const isFreeTier = restaurant?.plan === 'free' || !restaurant?.plan;
  const settings = restaurant?.tvSettings || {}; // Use TV-specific settings

  // Memoize style calculations for performance (must be called before conditional returns)
  const styleClasses = useMemo(() => {
    if (!restaurant || !settings) {
      return {
        sizes: getSizeClasses('large'),
        bodySizes: getSizeClasses('large'),
        priceSizes: getSizeClasses('large'),
        weight: getWeightClass('bold'),
        spacing: getSpacingClass('spacious'),
        backgroundStyle: getBackgroundStyle({ backgroundColor: '#000000' }),
        fontFamily: getFontFamily({}),
        accentColor: '#ffffff',
        textColor: '#ffffff',
        priceColor: '#ffffff',
      };
    }
    return {
      sizes: getSizeClasses(settings.headingSize),
      bodySizes: getSizeClasses(settings.bodySize),
      priceSizes: getSizeClasses(settings.priceSize),
      weight: getWeightClass(settings.fontWeight),
      spacing: getSpacingClass(settings.spacing),
      backgroundStyle: getBackgroundStyle(settings),
      fontFamily: getFontFamily(settings),
      accentColor: settings.accentColor || restaurant.brandColor || '#ffffff',
      textColor: settings.textColor || '#ffffff',
      priceColor: settings.priceColor || '#ffffff',
    };
  }, [settings, restaurant?.brandColor, restaurant]);

  // Now safe to have conditional returns
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto"></div>
          <p className="text-2xl font-medium">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (!data || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Menu Not Found</h1>
          <p className="text-xl text-gray-400">The menu you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const { sizes, bodySizes, priceSizes, weight, spacing, backgroundStyle, fontFamily, accentColor, textColor, priceColor } = styleClasses;

  // Load Google Font
  if (settings.fontFamily && typeof window !== 'undefined') {
    loadGoogleFont(settings.fontFamily);
  }

  // Get additional style classes
  const textStyleClasses = getTextStyleClasses(settings);
  const headingStyleClasses = getHeadingStyleClasses(settings);

  return (
    <>
      <MobileOptimizations />
      <div
        className="min-h-screen text-white overflow-hidden transition-all"
        style={{ ...backgroundStyle, ...fontFamily }}
      >
      <div className="p-8 lg:p-12">
        {/* Header */}
        <div className="mb-12 text-center">
          {restaurant.logoUrl && (
            <div className="mb-6 flex justify-center">
              <img 
                src={restaurant.logoUrl} 
                alt={restaurant.name} 
                className="h-32 w-auto object-contain"
              />
            </div>
          )}
          <h1 
            className={`text-6xl lg:text-7xl ${headingStyleClasses} mb-4 tracking-tight`}
            style={{ color: accentColor }}
          >
            {restaurant.name}
          </h1>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-12 lg:gap-16">
          {Object.entries(items || {}).map(([category, categoryItems]) => (
            <div key={category} className="space-y-6">
              {settings.showCategoryHeaders !== false && (
                <h2 
                  className={`text-4xl lg:text-5xl ${headingStyleClasses} mb-8 border-b-4 pb-4`}
                  style={{ borderColor: accentColor, color: accentColor }}
                >
                  {category}
                </h2>
              )}
              <div className={`space-y-6 ${spacing}`}>
                {categoryItems?.map((item) => {
                  const pricePosition = settings.pricePosition || 'right';
                  const showBullet = settings.showBulletPoints !== false;
                  const bulletContent = getBulletContent(settings.bulletStyle);
                  
                  return (
                    <div key={item.id} className="space-y-2">
                      {pricePosition === 'right' && (
                        <div className="flex justify-between items-baseline gap-4">
                          <h3
                            className={`text-2xl lg:text-3xl ${textStyleClasses} flex-1`}
                            style={{ color: textColor }}
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
                            className={`text-2xl lg:text-3xl ${textStyleClasses} whitespace-nowrap`}
                            style={{ color: priceColor }}
                          >
                            {formatPrice(item.price, settings)}
                          </span>
                        </div>
                      )}
                      {pricePosition === 'below' && (
                        <>
                          <h3
                            className={`text-2xl lg:text-3xl ${textStyleClasses}`}
                            style={{ color: textColor }}
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
                            className={`text-2xl lg:text-3xl ${textStyleClasses}`}
                            style={{ color: priceColor }}
                          >
                            {formatPrice(item.price, settings)}
                          </span>
                        </>
                      )}
                      {settings.showDescriptions !== false && item.description && (
                        <p
                          className={`text-base lg:text-lg leading-relaxed`}
                          style={{ color: textColor, opacity: 0.7 }}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Watermark for Free Tier */}
        {isFreeTier && <Watermark variant="tv" />}
      </div>
    </div>
    </>
  );
}
