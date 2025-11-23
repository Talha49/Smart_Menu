'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSyncSession } from '@/hooks/use-sync-session';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toastSuccess, toastError } from '@/lib/toast';
import { ArrowLeft, Menu } from 'lucide-react';
import dynamic from 'next/dynamic';
import { MenuSettingsProvider } from '@/context/MenuSettingsContext';
import { TVSettingsProvider } from '@/context/TVSettingsContext';
import BrandingTab from '@/components/settings/BrandingTab';
import SettingsSidebar from '@/components/settings/SettingsSidebar';
import KeyboardShortcuts from '@/components/settings/KeyboardShortcuts';
import HelpSystem from '@/components/settings/HelpSystem';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { TooltipProvider } from '@/components/ui/tooltip';

// Lazy load heavy customization tabs for better performance
const MenuDesignTab = dynamic(() => import('@/components/settings/MenuDesignTab'), {
  loading: () => (
    <Card className="p-6">
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading menu design...</p>
      </div>
    </Card>
  ),
  ssr: false,
});

const TVDesignTab = dynamic(() => import('@/components/settings/TVDesignTab'), {
  loading: () => (
    <Card className="p-6">
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading TV design...</p>
      </div>
    </Card>
  ),
  ssr: false,
});

export default function SettingsPage() {
  const router = useRouter();
  const { session, status } = useSyncSession();
  const restaurantId = useAuthStore((state) => state.restaurantId);
  const plan = useAuthStore((state) => state.plan);
  const restaurantName = useAuthStore((state) => state.restaurantName);

  const [activeSection, setActiveSection] = useState('branding');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [brandColor, setBrandColor] = useState('#000000');
  const [menuSettings, setMenuSettings] = useState(null);
  const [tvSettings, setTVSettings] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch current settings
  useEffect(() => {
    if (restaurantId) {
      fetchSettings();
    }
  }, [restaurantId]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/restaurant/settings`);
      if (response.ok) {
        const data = await response.json();
        if (data.logoUrl) setLogoUrl(data.logoUrl);
        if (data.brandColor) setBrandColor(data.brandColor);
        if (data.menuSettings) setMenuSettings(data.menuSettings);
        if (data.tvSettings) setTVSettings(data.tvSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleLogoUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toastError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toastError('Image size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      setLogoUrl(data.url);
      toastSuccess('Logo uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toastError(error.message || 'Failed to upload logo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSettings = async (additionalData = {}) => {
    try {
      setIsSaving(true);

      const response = await fetch('/api/restaurant/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoUrl,
          brandColor,
          ...additionalData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save settings');
      }

      toastSuccess('Settings saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toastError(error.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+s': (e) => {
      e.preventDefault();
      handleSaveSettings();
    },
    'escape': () => {
      router.push('/dashboard');
    },
  });

  // Redirect if not Pro
  useEffect(() => {
    if (status === 'loading') return;
    if (plan !== 'pro') {
      router.push('/dashboard');
    }
  }, [plan, status, router]);

  // Show loading state
  if (status === 'loading' || !session || !restaurantId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Show message if not Pro
  if (plan !== 'pro') {
    return null; // Will redirect
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-gray-900">Settings</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-6 py-4">
          <div className="max-w-[1920px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                {restaurantName && (
                  <p className="text-sm text-gray-600">{restaurantName}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <KeyboardShortcuts />
              <HelpSystem />
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex pt-16 lg:pt-20 h-[calc(100vh-4rem)] relative">
          {/* Floating Sidebar Toggle (when collapsed) */}
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="fixed left-4 top-24 z-50 lg:left-4 lg:top-24 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors"
              aria-label="Open sidebar"
              title="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Sidebar */}
          <SettingsSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Content Area */}
          <main className="flex-1 overflow-hidden min-w-0">
            <div className="h-full p-4 lg:p-6">
              {/* Branding Section */}
              {activeSection === 'branding' && (
                <BrandingTab
                  logoUrl={logoUrl}
                  brandColor={brandColor}
                  onLogoUpload={handleLogoUpload}
                  onColorChange={setBrandColor}
                  onSave={handleSaveSettings}
                  isUploading={isUploading}
                  isSaving={isSaving}
                />
              )}

              {/* Menu Design Section */}
              {activeSection === 'menu' && (
                <>
                  {menuSettings !== null ? (
                    <MenuSettingsProvider initialSettings={menuSettings}>
                      <MenuDesignTab onSave={handleSaveSettings} isSaving={isSaving} />
                    </MenuSettingsProvider>
                  ) : (
                    <Card className="p-6">
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading menu settings...</p>
                      </div>
                    </Card>
                  )}
                </>
              )}

              {/* TV Display Section */}
              {activeSection === 'tv' && (
                <>
                  {tvSettings !== null ? (
                    <TVSettingsProvider initialSettings={tvSettings}>
                      <TVDesignTab onSave={handleSaveSettings} isSaving={isSaving} />
                    </TVSettingsProvider>
                  ) : (
                    <Card className="p-6">
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading TV display settings...</p>
                      </div>
                    </Card>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

