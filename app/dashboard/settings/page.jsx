"use client";

import { useState } from "react";
import { useRestaurantStore } from "@/hooks/use-restaurant-store";
import { useMenuStore } from "@/hooks/use-menu-store";
import { useCategoryStore } from "@/hooks/use-category-store";
import { LivePreview } from "@/components/settings/LivePreview";
import { BusinessProfileTab } from "./BusinessProfileTab";
import { DesignStudio } from "@/components/dashboard/design-studio/DesignStudio";
import { deepMerge } from "@/lib/object-utils";
import { Store, Sparkles, Monitor, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/store/useTranslation";

const DEVICES = [
    { id: 'iPhone X', label: 'iPhone X' },
    { id: 'iPhone 8', label: 'iPhone 8' },
    { id: 'iPhone 8 Plus', label: 'iPhone 8+' },
    { id: 'iPhone 5s', label: 'iPhone 5s' },
    { id: 'iPhone 5c', label: 'iPhone 5c' },
    { id: 'iPhone 4s', label: 'iPhone 4s' },
    { id: 'Galaxy Note 8', label: 'Galaxy Note 8' },
    { id: 'Samsung Galaxy S5', label: 'Galaxy S5' },
    { id: 'Nexus 5', label: 'Nexus 5' },
    { id: 'Lumia 920', label: 'Lumia 920' },
    { id: 'iPad Mini', label: 'iPad Mini' },
    { id: 'MacBook Pro', label: 'MacBook Pro' },
];

export default function SettingsPage() {
    const { restaurant, previewData } = useRestaurantStore();
    const { items: menuItems } = useMenuStore();
    const { categories } = useCategoryStore();
    const { t } = useTranslation();
    const [activeView, setActiveView] = useState("studio");
    const [selectedDevice, setSelectedDevice] = useState("iPhone X");
    const [previewScale, setPreviewScale] = useState(60);

    const activeData = previewData ? deepMerge(restaurant, previewData) : restaurant;

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b bg-white shrink-0">
                {/* Left: View toggle */}
                <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveView("studio")}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all",
                            activeView === "studio"
                                ? "bg-white text-zinc-900 shadow-sm"
                                : "text-zinc-500 hover:text-zinc-700"
                        )}
                    >
                        <Sparkles className="w-4 h-4" />
                        {t('dashboard.settings.studio')}
                    </button>
                    <button
                        onClick={() => setActiveView("profile")}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all",
                            activeView === "profile"
                                ? "bg-white text-zinc-900 shadow-sm"
                                : "text-zinc-500 hover:text-zinc-700"
                        )}
                    >
                        <Store className="w-4 h-4" />
                        {t('dashboard.settings.profile')}
                    </button>
                </div>

                {/* Right: Device selector + size slider + sync */}
                {activeView === "studio" && (
                    <div className="flex items-center gap-4">
                        {/* Device picker */}
                        <div className="flex items-center gap-2 bg-zinc-100 px-3 py-1.5 rounded-lg">
                            <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                            <select
                                value={selectedDevice}
                                onChange={(e) => setSelectedDevice(e.target.value)}
                                className="bg-transparent text-xs font-semibold text-zinc-700 focus:outline-none cursor-pointer"
                            >
                                {DEVICES.map(d => (
                                    <option key={d.id} value={d.id}>{d.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Size slider */}
                        <div className="flex items-center gap-2 bg-zinc-100 px-3 py-1.5 rounded-lg hidden sm:flex">
                            <ZoomIn className="w-3.5 h-3.5 text-zinc-400" />
                            <input
                                type="range"
                                min={30}
                                max={100}
                                value={previewScale}
                                onChange={(e) => setPreviewScale(Number(e.target.value))}
                                className="w-20 h-1 accent-zinc-700 cursor-pointer"
                            />
                            <span className="text-[10px] font-bold text-zinc-500 w-8">{previewScale}%</span>
                        </div>

                        {/* Live indicator */}
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs text-zinc-400 font-medium">{t('dashboard.settings.live')}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0 overflow-hidden">
                {activeView === "studio" ? (
                    <div className="h-full flex">
                        {/* Design Studio - left */}
                        <div className="flex-1 min-w-0 h-full overflow-hidden border-r rtl:border-r-0 rtl:border-l">
                            <DesignStudio />
                        </div>

                        {/* Live Preview - right */}
                        <div className="w-[420px] shrink-0 bg-zinc-50 flex items-center justify-center overflow-auto hidden lg:flex">
                            <div
                                className="origin-center"
                                style={{ transform: `scale(${previewScale / 100})` }}
                            >
                                <LivePreview
                                    restaurant={activeData}
                                    device={selectedDevice}
                                    branding={{
                                        brandColor: activeData?.brandColor || "#4f46e5",
                                        fontFamily: activeData?.fontFamily || "Inter",
                                        logoUrl: activeData?.logoUrl || "",
                                        layoutID: activeData?.experienceConfig?.layoutID || "grid",
                                        themeConfig: activeData?.experienceConfig?.designSystem?.config || activeData?.experienceConfig?.themeConfig
                                    }}
                                    menuItems={menuItems}
                                    categories={categories}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto p-8">
                        <div className="max-w-3xl mx-auto">
                            <BusinessProfileTab />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
