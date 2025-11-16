'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Store } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const setRestaurant = useAuthStore((state) => state.setRestaurant);
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const response = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurantName }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Onboarding failed');
      setLoading(false);
      return;
    }

    // Update session to include restaurantId
    await updateSession();
    
    // Update Zustand store with restaurant data
    if (data.restaurant) {
      setRestaurant(data.restaurant);
    }
    
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Store className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome to SmartMenu</CardTitle>
          <CardDescription className="text-base">
            Let's get your restaurant set up in just a moment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="restaurantName" className="text-sm font-semibold text-gray-700">
                Restaurant Name
              </label>
              <Input
                id="restaurantName"
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g., The Anchor Pub"
                required
                className="h-11"
              />
              <p className="text-xs text-gray-500">
                This will be displayed on your public menu
              </p>
            </div>

            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
              {loading ? 'Setting up...' : 'Continue to Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
