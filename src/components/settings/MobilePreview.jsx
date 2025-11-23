'use client';

import { useState, useEffect, useRef } from 'react';
import { DeviceFrameset } from 'react-device-frameset';
import { useAuthStore } from '@/lib/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Available devices from react-device-frameset
const DEVICES = [
  { value: 'iPhone X', label: 'iPhone X' },
  { value: 'iPhone 8', label: 'iPhone 8', colors: ['black', 'silver', 'gold'] },
  { value: 'iPhone 8 Plus', label: 'iPhone 8 Plus', colors: ['black', 'silver', 'gold'] },
  { value: 'iPhone 5s', label: 'iPhone 5s', colors: ['black', 'silver', 'gold'] },
  { value: 'iPhone 5c', label: 'iPhone 5c', colors: ['white', 'red', 'yellow', 'green', 'blue'] },
  { value: 'iPhone 4s', label: 'iPhone 4s', colors: ['black', 'silver'] },
  { value: 'Galaxy Note 8', label: 'Galaxy Note 8' },
  { value: 'Nexus 5', label: 'Nexus 5' },
  { value: 'Lumia 920', label: 'Lumia 920', colors: ['black', 'white', 'yellow', 'red', 'blue'] },
  { value: 'Samsung Galaxy S5', label: 'Samsung Galaxy S5', colors: ['white', 'black'] },
  { value: 'HTC One', label: 'HTC One' },
  { value: 'iPad Mini', label: 'iPad Mini', colors: ['black', 'silver'] },
  { value: 'MacBook Pro', label: 'MacBook Pro' },
];

/**
 * Real Mobile Preview Component
 * Loads actual menu page in iframe with professional device frame
 * Supports multiple device options via dropdown
 */
export default function MobilePreview({ refreshKey = 0, selectedDevice, onDeviceChange }) {
  const restaurantId = useAuthStore((state) => state.restaurantId);
  const restaurantSlug = useAuthStore((state) => state.restaurantSlug);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deviceColor, setDeviceColor] = useState(null);
  const iframeRef = useRef(null);

  // Load CSS from public folder
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const existing1 = document.querySelector('link[data-device-frameset="marvel"]');
      const existing2 = document.querySelector('link[data-device-frameset="selector"]');
      
      if (!existing1) {
        const link1 = document.createElement('link');
        link1.rel = 'stylesheet';
        link1.setAttribute('data-device-frameset', 'marvel');
        link1.href = '/styles/marvel-devices.min.css';
        document.head.appendChild(link1);
      }

      if (!existing2) {
        const link2 = document.createElement('link');
        link2.rel = 'stylesheet';
        link2.setAttribute('data-device-frameset', 'selector');
        link2.href = '/styles/device-selector.min.css';
        document.head.appendChild(link2);
      }
    }
  }, []);

  // Get device config
  const currentDevice = DEVICES.find(d => d.value === selectedDevice) || DEVICES[0];
  const deviceConfig = {
    device: currentDevice.value,
    ...(currentDevice.colors && deviceColor ? { color: deviceColor } : {}),
    zoom: 0.75,
  };

  // Reset color when device changes
  useEffect(() => {
    if (currentDevice.colors && currentDevice.colors.length > 0) {
      setDeviceColor(currentDevice.colors[0]);
    } else {
      setDeviceColor(null);
    }
  }, [selectedDevice]);

  const publicMenuId = restaurantSlug || restaurantId;
  const menuUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/menu/${publicMenuId}`
    : '';

  // Refresh iframe when settings change
  useEffect(() => {
    if (iframeRef.current && menuUrl) {
      setIsLoading(true);
      setError(false);
      iframeRef.current.src = `${menuUrl}?t=${Date.now()}`;
    }
  }, [refreshKey, menuUrl]);

  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  if (!publicMenuId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-sm">No restaurant ID available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Device Selector */}
      <div className="flex items-center justify-between gap-4 mb-4 shrink-0">
        <Select value={selectedDevice} onValueChange={onDeviceChange}>
          <SelectTrigger className="w-[200px] cursor-pointer">
            <SelectValue placeholder="Select device" />
          </SelectTrigger>
          <SelectContent>
            {DEVICES.map((device) => (
              <SelectItem key={device.value} value={device.value} className="cursor-pointer">
                {device.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Color selector for devices that support it */}
        {currentDevice.colors && currentDevice.colors.length > 0 && (
          <Select value={deviceColor || currentDevice.colors[0]} onValueChange={setDeviceColor}>
            <SelectTrigger className="w-[150px] cursor-pointer">
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              {currentDevice.colors.map((color) => (
                <SelectItem key={color} value={color} className="cursor-pointer capitalize">
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Device Preview - Full height with proper spacing */}
      <div className="flex-1 flex items-center justify-center min-h-0 px-4" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div 
          className="flex items-center justify-center"
          style={{ 
            transform: 'scale(0.72)', 
            transformOrigin: 'center center',
            width: '100%',
            height: '100%',
          }}
        >
          <DeviceFrameset {...deviceConfig}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                  <p className="text-xs text-gray-600">Loading menu...</p>
                </div>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <p className="text-xs text-red-600">Failed to load menu</p>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={menuUrl}
              className="w-full h-full border-0"
              onLoad={handleLoad}
              onError={handleError}
              title="Mobile Menu Preview"
              sandbox="allow-same-origin allow-scripts"
              style={{ width: '100%', height: '100%', display: 'block' }}
            />
          </DeviceFrameset>
        </div>
      </div>
    </div>
  );
}
