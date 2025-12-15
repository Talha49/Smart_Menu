"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { useRestaurantStore } from "@/hooks/use-restaurant-store";
import { cn } from "@/lib/utils";
import { ImageUploadProvider } from "@/context/ImageUploadContext";

export default function DashboardLayout({ children }) {
  // Mobile state
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Desktop state - default open
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);

  const fetchRestaurant = useRestaurantStore((state) => state.fetchRestaurant);

  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
        setIsMobileOpen(!isMobileOpen);
    } else {
        setIsDesktopOpen(!isDesktopOpen);
    }
  };

  return (
    <ImageUploadProvider>
    <div className="flex h-screen overflow-hidden bg-muted/20">
      {/* Desktop Sidebar - Collapsible */}
      <div className={cn(
          "hidden md:block flex-shrink-0 transition-all duration-300 ease-in-out border-r bg-card h-full overflow-hidden",
          isDesktopOpen ? "w-64 opacity-100" : "w-0 opacity-0 border-none"
      )}>
         <Sidebar className="w-64 h-full" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in"
            onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out md:hidden shadow-2xl",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar isMobile onClose={() => setIsMobileOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
           <div className="mx-auto max-w-6xl animate-fade-in">
              {children}
           </div>
        </main>
      </div>
    </div>
    </ImageUploadProvider>
  );
}
