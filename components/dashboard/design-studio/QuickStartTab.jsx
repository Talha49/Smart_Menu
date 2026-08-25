"use client";

import { useState } from 'react';
import { Sparkles, Check, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DESIGN_PRESETS, getCategories } from './presets';
import { ResponsiveGrid } from '@/components/ui/ResponsiveGrid';

export function QuickStartTab({ onApplyPreset, onReset, currentPresetId, contentWidth = 600 }) {
    const categories = ['All', ...getCategories()];
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredPresets = activeCategory === 'All' 
        ? DESIGN_PRESETS 
        : DESIGN_PRESETS.filter(p => p.category === activeCategory);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-3">
                    <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />
                    <h2 className="text-2xl font-black tracking-tight">Quick Start Themes</h2>
                </div>
                <p className="text-zinc-500 font-medium">Professional presets for instant menu branding</p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center justify-center gap-2 flex-wrap pb-2">
                <Filter className="w-4 h-4 text-zinc-400 mr-2" />
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-xs font-bold transition-all border-2",
                            activeCategory === cat
                                ? "bg-zinc-900 border-zinc-900 text-white shadow-md"
                                : "bg-white border-zinc-100 text-zinc-500 hover:border-zinc-200"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Presets Grid */}
            <ResponsiveGrid width={contentWidth} cols={{ base: 1, 448: 2, 672: 3 }} className="gap-6">
                {/* Reset Action Card */}
                <button
                    onClick={() => {
                        console.log("Reset card clicked");
                        onReset && onReset();
                    }}
                    className="group relative p-6 rounded-[2rem] border-2 border-dashed border-red-100 bg-red-50/30 transition-all text-left flex flex-col items-start gap-4 hover:border-red-200 hover:bg-red-50 hover:shadow-xl active:scale-95"
                >
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:rotate-12 transition-transform">
                        🗑️
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-black tracking-tight text-red-600">Reset Studio</h3>
                        <p className="text-xs text-red-400 font-medium leading-relaxed">
                            Clear everything and start designing from absolute scratch.
                        </p>
                    </div>
                    <div className="mt-auto pt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-300">Clean Slate</span>
                    </div>
                </button>

                {filteredPresets.map((preset) => (
                    <button
                        key={preset.id}
                        onClick={() => onApplyPreset(preset)}
                        className={cn(
                            "group relative p-6 rounded-[2rem] border-2 transition-all text-left flex flex-col items-start gap-4",
                            "hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]",
                            currentPresetId === preset.id
                                ? "border-zinc-900 bg-zinc-50 shadow-xl"
                                : "border-zinc-100 bg-white hover:border-zinc-200"
                        )}
                    >
                        <div className="text-5xl group-hover:rotate-12 transition-transform duration-300">
                            {preset.emoji}
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-black tracking-tight">{preset.name}</h3>
                                <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                                    {preset.category}
                                </span>
                            </div>
                            <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{preset.description}</p>
                        </div>

                        {/* Color Swatch Preview */}
                        <div className="flex gap-1.5 w-full mt-auto pt-2">
                            <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: preset.config.colors.brand.primary }} />
                            <div className="flex-1 h-1.5 rounded-full opacity-60" style={{ backgroundColor: preset.config.colors.brand.secondary }} />
                            <div className="flex-1 h-1.5 rounded-full opacity-30" style={{ backgroundColor: preset.config.colors.brand.tertiary }} />
                        </div>

                        {currentPresetId === preset.id && (
                            <div className="absolute top-4 right-4 w-7 h-7 bg-zinc-900 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </button>
                ))}
            </ResponsiveGrid>
        </div>
    );
}
