"use client";

import { useRestaurantStore } from "@/hooks/use-restaurant-store";
import { motion } from "framer-motion";
import { 
    Utensils, 
    QrCode, 
    Eye, 
    TrendingUp, 
    MousePointer2, 
    Layers,
    Sparkles,
    LayoutDashboard,
    ListChecks
} from "lucide-react";
import { DashboardHero } from "@/components/dashboard/overview/DashboardHero";
import { MetricCard } from "@/components/dashboard/overview/MetricCard";
import { SuccessRoadmap } from "@/components/dashboard/overview/SuccessRoadmap";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const { restaurant, isLoading } = useRestaurantStore();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Loading Intelligence...</span>
                </div>
            </div>
        );
    }

    // REAL DATA CALCULATIONS
    const categories = restaurant?.menu?.categories || [];
    const totalItems = categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
    const totalCategories = categories.length;
    const hasVisuals = !!restaurant?.experienceConfig?.designSystem?.config;
    const hasLogo = !!restaurant?.logoUrl;
    
    // Calculate Completeness %
    const completionScore = [
        totalCategories > 0,
        totalItems >= 5,
        hasVisuals,
        hasLogo
    ].filter(Boolean).length * 25;

    return (
        <div className="space-y-10 pb-20 max-w-[1400px] mx-auto animate-in fade-in duration-1000">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <LayoutDashboard className="w-3 h-3" />
                    <span>Dashboard</span>
                    <span className="opacity-30">/</span>
                    <span className="text-zinc-900">Overview</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Syncing Live</span>
                    </div>
                </div>
            </div>

            {/* Premium Hero Section */}
            <DashboardHero 
                restaurantName={restaurant?.name || 'Your Restaurant'} 
                restaurantId={restaurant?.restaurantId}
            />

            {/* Performance Metrics (Wired to Real Data) */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard 
                    title="Menu Items" 
                    value={totalItems} 
                    unit="Active Items"
                    icon={Utensils}
                    color="indigo"
                />
                <MetricCard 
                    title="Categories" 
                    value={totalCategories} 
                    unit="Sections"
                    icon={Layers}
                    color="purple"
                />
                <MetricCard 
                    title="Visual DNA" 
                    value={hasVisuals ? "Active" : "Default"} 
                    unit={hasVisuals ? "Custom Theme" : "Standard"}
                    icon={Sparkles}
                    color="orange"
                />
                <MetricCard 
                    title="RealFlow Scans" 
                    value="--" 
                    unit="Analytics Pending"
                    icon={QrCode}
                    color="emerald"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-10">
                    <SuccessRoadmap progress={completionScore} restaurant={restaurant} />
                </div>

                {/* Sidebar Side-panel */}
                <div className="space-y-6">
                    {/* Menu Health Card */}
                    <div className="p-8 rounded-[3rem] bg-white border-2 border-zinc-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <ListChecks className="w-4 h-4 text-primary" />
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">Menu Health</h4>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                    <span className="text-zinc-400">Completeness</span>
                                    <span className="text-primary">{completionScore}%</span>
                                </div>
                                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${completionScore}%` }}
                                        className="h-full bg-primary" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { label: 'Categories Created', ok: totalCategories > 0 },
                                    { label: 'Minimum 5 Items', ok: totalItems >= 5 },
                                    { label: 'Brand Visuals Set', ok: hasVisuals },
                                    { label: 'Restaurant Logo', ok: hasLogo }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-[10px] font-medium text-zinc-500">{item.label}</span>
                                        <div className={cn(
                                            "w-4 h-4 rounded-full flex items-center justify-center",
                                            item.ok ? "bg-emerald-50 text-emerald-500" : "bg-zinc-50 text-zinc-300"
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full", item.ok ? "bg-emerald-500" : "bg-zinc-300")} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Pro Plan Card */}
                    {restaurant?.plan === 'free' && (
                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="p-8 rounded-[3rem] bg-gradient-to-br from-primary to-indigo-600 text-white shadow-2xl relative overflow-hidden group"
                        >
                            <Sparkles className="absolute -right-4 -top-4 w-32 h-32 opacity-20 group-hover:rotate-12 transition-transform duration-700" />
                            <div className="relative z-10">
                                <h4 className="text-xl font-black italic tracking-tighter uppercase mb-2">Go Professional</h4>
                                <p className="text-sm text-white/70 font-medium mb-6">Unlock unlimited menu items, AI-driven heatmaps, and premium themes.</p>
                                <button className="w-full bg-white text-primary text-[10px] font-black uppercase tracking-widest py-4 px-6 rounded-2xl shadow-lg">
                                    View Pricing
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

