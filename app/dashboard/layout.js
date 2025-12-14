"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { useRestaurantStore } from "@/hooks/use-restaurant-store";
import { cn } from "@/lib/utils";
import { ImageUploadProvider } from "@/context/ImageUploadContext";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fetchRestaurant = useRestaurantStore((state) => state.fetchRestaurant);

  // Fetch restaurant data on mount
  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  return (
    <ImageUploadProvider>
    <div className="flex h-screen overflow-hidden bg-muted/20">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex w-64 flex-shrink-0" />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out md:hidden",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar isMobile onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
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
