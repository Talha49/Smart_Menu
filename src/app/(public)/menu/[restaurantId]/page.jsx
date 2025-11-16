'use client';

import useSWR from 'swr';
import { useParams } from 'next/navigation';
import Watermark from '@/components/public/watermark';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function PublicMenuPage() {
  const params = useParams();
  const { data, isLoading } = useSWR(`/api/public-menu?id=${params.restaurantId}`, fetcher, {
    refreshInterval: 30000,
  });

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

  if (!data || !data.restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Menu Not Found</h1>
          <p className="text-gray-600">The menu you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const { restaurant, items } = data;
  const isFreeTier = restaurant.plan === 'free' || !restaurant.plan;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          {restaurant.logoUrl && (
            <div className="mb-6 flex justify-center">
              <img 
                src={restaurant.logoUrl} 
                alt={restaurant.name} 
                className="h-24 w-auto object-contain"
              />
            </div>
          )}
          <h1 
            className="text-5xl font-bold mb-3 tracking-tight"
            style={restaurant.brandColor ? { color: restaurant.brandColor } : {}}
          >
            {restaurant.name}
          </h1>
        </div>

        {/* Menu Items */}
        <div className="space-y-10">
          {Object.entries(items || {}).map(([category, categoryItems]) => (
            <div key={category} className="space-y-4">
              <h2 
                className="text-3xl font-bold mb-6 pb-3 border-b-2"
                style={restaurant.brandColor ? { borderColor: restaurant.brandColor, color: restaurant.brandColor } : { borderColor: '#000' }}
              >
                {category}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryItems?.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-bold text-gray-900 flex-1">{item.name}</h3>
                        <span className="text-xl font-bold text-gray-900 whitespace-nowrap">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Watermark for Free Tier */}
        {isFreeTier && <Watermark variant="page" />}
      </div>
    </div>
  );
}
