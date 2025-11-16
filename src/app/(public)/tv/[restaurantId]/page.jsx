'use client';

import useSWR from 'swr';
import { useParams } from 'next/navigation';
import Watermark from '@/components/public/watermark';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function TVMenuPage() {
  const params = useParams();
  const { data, isLoading } = useSWR(`/api/public-menu?id=${params.restaurantId}`, fetcher, {
    refreshInterval: 30000,
  });

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

  if (!data || !data.restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Menu Not Found</h1>
          <p className="text-xl text-gray-400">The menu you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const { restaurant, items } = data;
  const isFreeTier = restaurant.plan === 'free' || !restaurant.plan;
  const brandColor = restaurant.brandColor || '#ffffff';

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
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
            className="text-6xl lg:text-7xl font-bold mb-4 tracking-tight"
            style={{ color: brandColor }}
          >
            {restaurant.name}
          </h1>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-12 lg:gap-16">
          {Object.entries(items || {}).map(([category, categoryItems]) => (
            <div key={category} className="space-y-6">
              <h2 
                className="text-4xl lg:text-5xl font-bold mb-8 border-b-4 pb-4"
                style={{ borderColor: brandColor, color: brandColor }}
              >
                {category}
              </h2>
              <div className="space-y-6">
                {categoryItems?.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex justify-between items-baseline gap-4">
                      <h3 className="text-2xl lg:text-3xl font-semibold flex-1">{item.name}</h3>
                      <span className="text-2xl lg:text-3xl font-bold whitespace-nowrap">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-base lg:text-lg text-gray-300 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Watermark for Free Tier */}
        {isFreeTier && <Watermark variant="tv" />}
      </div>
    </div>
  );
}
