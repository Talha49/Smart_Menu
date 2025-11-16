'use client';

import { useSyncSession } from '@/hooks/use-sync-session';
import { useAuthStore } from '@/lib/store';
import { signOut } from 'next-auth/react';
import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LogOut, Plus, Edit2, ExternalLink, Copy, Check } from 'lucide-react';
import MenuItemForm from '@/components/dashboard/menu-item-form';
import CategoryManager from '@/components/dashboard/category-manager';
import { toastSuccess, toastError } from '@/lib/toast';
import QrModal from '@/components/public/qr-modal';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function DashboardPage() {
  // Sync NextAuth session to Zustand
  const { session, status } = useSyncSession();
  
  // Get data from Zustand store
  const restaurantId = useAuthStore((state) => state.restaurantId);
  const restaurantSlug = useAuthStore((state) => state.restaurantSlug);
  const restaurantName = useAuthStore((state) => state.restaurantName);
  const plan = useAuthStore((state) => state.plan);
  const [copiedUrl, setCopiedUrl] = useState(null);
  
  const router = useRouter();

  // Redirect to onboarding if user doesn't have a restaurant
  useEffect(() => {
    if (status === 'loading') return;
    if (session && !restaurantId) {
      router.push('/onboarding');
    }
  }, [session, status, restaurantId, router]);
  
  // Fetch menu items using Zustand restaurantId
  const { data: items, mutate } = useSWR(
    restaurantId ? `/api/menu-items?restaurantId=${restaurantId}` : null,
    fetcher
  );
  const itemCount = Array.isArray(items) ? items.length : 0;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleToggleAvailability = async (itemId, currentStatus) => {
    const response = await fetch(`/api/menu-items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable: !currentStatus }),
    });

    if (response.ok) {
      mutate();
      toastSuccess(!currentStatus ? 'Item is now available' : 'Item is now unavailable');
    } else {
      toastError('Failed to update availability');
    }
  };

  const handleItemSaved = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    mutate();
  };

  const handleLogout = async () => {
    const store = useAuthStore.getState();
    store.clearSession();
    await signOut({ callbackUrl: '/auth/login' });
    toastSuccess('Signed out');
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(type);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Use slug if available, otherwise fall back to MongoDB _id
  const publicMenuId = restaurantSlug || restaurantId;

  // Show loading or redirect message
  if (status === 'loading' || (session && !restaurantId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Menu Management</h1>
            {restaurantName && (
              <p className="text-base text-gray-600 mt-2">{restaurantName}</p>
            )}
            <div className="flex items-center gap-3 mt-3">
              {plan && (
                <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                  plan === 'pro' 
                    ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}>
                  {plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                </span>
              )}
              <span className="text-xs text-gray-600">
                Items: {itemCount}{plan === 'free' ? '/3' : ''}
              </span>
            </div>
            {publicMenuId && (
              <Card className="mt-4 p-4 bg-blue-50 border-blue-200">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900">Public Menu URLs</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 flex-1">QR Menu:</span>
                      <code className="text-xs bg-white px-2 py-1 rounded border flex-1">
                        {typeof window !== 'undefined' ? `${window.location.origin}/menu/${publicMenuId}` : ''}
                      </code>
                      <QrModal
                        url={typeof window !== 'undefined' ? `${window.location.origin}/menu/${publicMenuId}` : ''}
                        label="QR Menu"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`${typeof window !== 'undefined' ? window.location.origin : ''}/menu/${publicMenuId}`, 'menu')}
                        className="h-7 w-7 p-0"
                      >
                        {copiedUrl === 'menu' ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/menu/${publicMenuId}`, '_blank')}
                        className="h-7 w-7 p-0"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 flex-1">TV Display:</span>
                      <code className="text-xs bg-white px-2 py-1 rounded border flex-1">
                        {typeof window !== 'undefined' ? `${window.location.origin}/tv/${publicMenuId}` : ''}
                      </code>
                      <QrModal
                        url={typeof window !== 'undefined' ? `${window.location.origin}/tv/${publicMenuId}` : ''}
                        label="TV Display"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`${typeof window !== 'undefined' ? window.location.origin : ''}/tv/${publicMenuId}`, 'tv')}
                        className="h-7 w-7 p-0"
                      >
                        {copiedUrl === 'tv' ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/tv/${publicMenuId}`, '_blank')}
                        className="h-7 w-7 p-0"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
            {plan === 'free' && itemCount >= 3 && (
              <Card className="mt-4 p-4 bg-amber-50 border-amber-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-sm text-amber-800">
                    You’ve reached the Free plan limit of 15 items. Upgrade to Pro for unlimited items.
                  </p>
                  <Button
                    onClick={() => toastError('Upgrade flow will be available in Milestone 3')}
                    className="sm:ml-4"
                  >
                    Upgrade to Pro
                  </Button>
                </div>
              </Card>
            )}
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Category Management Section */}
        <div className="mb-8">
          <CategoryManager onCategoryChange={mutate} />
        </div>

        {/* Menu Items Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Menu Items</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setEditingItem(null)}
                className="flex items-center gap-2"
                disabled={plan === 'free' && itemCount >= 3}
                title={plan === 'free' && itemCount >= 3 ? 'Free plan limit reached' : ''}
              >
                <Plus className="h-4 w-4" />
                {plan === 'free' && itemCount >= 3 ? 'Limit Reached' : 'Add Menu Item'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
              </DialogHeader>
              <MenuItemForm item={editingItem} onSaved={handleItemSaved} />
            </DialogContent>
          </Dialog>
        </div>

        {items && items.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Card key={item._id} className="p-6 hover:shadow-lg transition-shadow border border-gray-200">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.isAvailable 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-gray-900">${item.price.toFixed(2)}</span>
                      <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm font-medium text-gray-700">Toggle Availability</span>
                      <Switch 
                        checked={item.isAvailable} 
                        onCheckedChange={() => handleToggleAvailability(item._id, item.isAvailable)} 
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingItem(item);
                        setIsDialogOpen(true);
                      }}
                      className="flex items-center gap-1"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-2 border-dashed border-gray-300">
            <div className="space-y-4">
              <p className="text-lg font-medium text-gray-600">No menu items yet</p>
              <p className="text-sm text-gray-500">Get started by creating your first menu item</p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="flex items-center gap-2 mx-auto"
                    disabled={plan === 'free' && itemCount >= 3}
                    title={plan === 'free' && itemCount >= 3 ? 'Free plan limit reached' : ''}
                  >
                    <Plus className="h-4 w-4" />
                    {plan === 'free' && itemCount >= 3 ? 'Limit Reached' : 'Create Your First Item'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Add Menu Item</DialogTitle>
                  </DialogHeader>
                  <MenuItemForm item={null} onSaved={handleItemSaved} />
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
