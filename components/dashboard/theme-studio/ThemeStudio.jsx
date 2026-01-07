"use client";

/**
 * Theme Studio - Main Component
 * 
 * Central hub for all theme customization.
 * Mobile-responsive accordion interface with live preview.
 */

import { useState } from 'react';
import { useRestaurantStore } from '@/hooks/use-restaurant-store';
import { BackgroundDesigner } from './BackgroundDesigner';
import { ColorLab } from './ColorLab';
import { SeasonalManager } from './SeasonalManager';
import { TypographyControls } from './TypographyControls';
import { CardDesigner } from './CardDesigner';
import { DEFAULT_THEMES, getAvailablePresets } from '@/lib/theme-engine/defaults';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
    Paintbrush,
    Sparkles,
    Save,
    RotateCcw,
    ChevronDown,
    Check,
    Loader2
} from 'lucide-react';

export function ThemeStudio() {
    const { restaurant, updateBranding, setPreviewData } = useRestaurantStore();
    const [themeConfig, setThemeConfig] = useState(
        restaurant?.experienceConfig?.themeConfig || DEFAULT_THEMES['modern-clean']
    );
    const [isSaving, setIsSaving] = useState(false);
    const [expandedSection, setExpandedSection] = useState('presets');

    // Update preview whenever theme changes
    const updatePreview = (updates) => {
        const newConfig = { ...themeConfig, ...updates };
        setThemeConfig(newConfig);

        // Send ONLY themeConfig to live preview (don't spread experienceConfig)
        setPreviewData({
            experienceConfig: {
                themeConfig: newConfig
            }
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Send ONLY themeConfig (don't spread entire experienceConfig)
            await updateBranding({
                experienceConfig: {
                    themeConfig
                }
            });
            toast.success('Theme saved successfully!');
        } catch (error) {
            toast.error('Failed to save theme');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        const defaultTheme = DEFAULT_THEMES['modern-clean'];
        setThemeConfig(defaultTheme);
        // Send ONLY themeConfig to preview
        setPreviewData({
            experienceConfig: {
                themeConfig: defaultTheme
            }
        });
        toast.success('Reset to default theme');
    };

    const applyPreset = (presetId) => {
        const preset = DEFAULT_THEMES[presetId];
        if (preset) {
            setThemeConfig(preset);
            // Send ONLY themeConfig to preview
            setPreviewData({
                experienceConfig: {
                    themeConfig: preset
                }
            });
            toast.success('Preset applied!');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
                        <Paintbrush className="w-6 h-6" />
                        Theme Studio
                    </h2>
                    <p className="text-sm text-zinc-600 mt-1">
                        Customize your menu's visual identity
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-zinc-200 hover:border-zinc-300 text-sm font-medium transition-all"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span className="hidden sm:inline">Reset</span>
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>Save Theme</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Quick Start Presets */}
            <section>
                <AccordionSection
                    id="presets"
                    title="🎨 Quick Start Presets"
                    description="Apply a professional theme instantly"
                    isExpanded={expandedSection === 'presets'}
                    onToggle={() => setExpandedSection(expandedSection === 'presets' ? null : 'presets')}
                >
                    <PresetGallery
                        activePreset={null}
                        onSelect={applyPreset}
                    />
                </AccordionSection>
            </section>

            {/* Background Designer */}
            <section>
                <AccordionSection
                    id="background"
                    title="🖼️ Background Designer"
                    description="Customize your menu background"
                    isExpanded={expandedSection === 'background'}
                    onToggle={() => setExpandedSection(expandedSection === 'background' ? null : 'background')}
                >
                    <BackgroundDesigner
                        value={themeConfig.background}
                        onChange={(bg) => updatePreview({ background: bg })}
                    />
                </AccordionSection>
            </section>

            {/* Color Lab */}
            <section>
                <AccordionSection
                    id="colors"
                    title="🎨 Color Lab"
                    description="Brand colors and palettes"
                    isExpanded={expandedSection === 'colors'}
                    onToggle={() => setExpandedSection(expandedSection === 'colors' ? null : 'colors')}
                >
                    <ColorLab
                        value={themeConfig.colors}
                        onChange={(colors) => updatePreview({ colors })}
                    />
                </AccordionSection>
            </section>

            {/* Typography */}
            <section>
                <AccordionSection
                    id="typography"
                    title="✍️ Typography"
                    description="Fonts and text styling"
                    isExpanded={expandedSection === 'typography'}
                    onToggle={() => setExpandedSection(expandedSection === 'typography' ? null : 'typography')}
                >
                    <TypographyControls
                        value={themeConfig.typography}
                        onChange={(typography) => updatePreview({ typography })}
                    />
                </AccordionSection>
            </section>

            {/* Seasonal Manager */}
            <section>
                <AccordionSection
                    id="seasonal"
                    title="🎄 Seasonal Themes"
                    description="Automatic seasonal overlays"
                    isExpanded={expandedSection === 'seasonal'}
                    onToggle={() => setExpandedSection(expandedSection === 'seasonal' ? null : 'seasonal')}
                >
                    <SeasonalManager
                        value={themeConfig.seasonal}
                        atmosphere={themeConfig.atmosphere}
                        onChange={(updates) => updatePreview(updates)}
                    />
                </AccordionSection>
            </section>

            {/* Card Designer */}
            <section>
                <AccordionSection
                    id="cards"
                    title="🍽️ Card Designer"
                    description="Menu item card styling"
                    isExpanded={expandedSection === 'cards'}
                    onToggle={() => setExpandedSection(expandedSection === 'cards' ? null : 'cards')}
                >
                    <CardDesigner
                        value={themeConfig.menuItem}
                        onChange={(menuItem) => updatePreview({ menuItem })}
                    />
                </AccordionSection>
            </section>
        </div>
    );
}

/**
 * Accordion Section Component
 */
function AccordionSection({
    id,
    title,
    description,
    isExpanded,
    onToggle,
    children,
    disabled = false
}) {
    return (
        <div
            className={cn(
                "border-2 rounded-2xl transition-all overflow-hidden",
                isExpanded
                    ? "border-zinc-900 shadow-xl"
                    : "border-zinc-200 hover:border-zinc-300",
                disabled && "opacity-60"
            )}
        >
            <button
                onClick={onToggle}
                disabled={disabled}
                className="w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-zinc-50 transition-colors disabled:cursor-not-allowed"
            >
                <div className="flex-1 min-w-0 pr-4">
                    <h3 className="text-lg font-bold text-zinc-900 mb-1">
                        {title}
                    </h3>
                    <p className="text-sm text-zinc-600">
                        {description}
                    </p>
                </div>

                <ChevronDown
                    className={cn(
                        "w-5 h-5 text-zinc-400 transition-transform flex-shrink-0",
                        isExpanded && "rotate-180"
                    )}
                />
            </button>

            {isExpanded && !disabled && (
                <div className="p-4 md:p-6 pt-0 border-t-2 border-zinc-100">
                    {children}
                </div>
            )}
        </div>
    );
}

/**
 * Preset Gallery Component
 */
function PresetGallery({ activePreset, onSelect }) {
    const presets = [
        { id: 'modern-clean', name: 'Modern Clean', emoji: '🤍' },
        { id: 'retro-diner', name: 'Retro Diner', emoji: '🕹️' },
        { id: 'minimal-luxury', name: 'Minimal Luxury', emoji: '👑' },
        { id: 'playful-burger', name: 'Playful Burger', emoji: '🍔' }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {presets.map((preset) => {
                const isActive = activePreset === preset.id;

                return (
                    <button
                        key={preset.id}
                        onClick={() => onSelect(preset.id)}
                        className={cn(
                            "group relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all",
                            "hover:border-zinc-400 hover:shadow-lg hover:scale-105",
                            isActive
                                ? "border-zinc-900 bg-zinc-50 shadow-xl"
                                : "border-zinc-200 bg-white"
                        )}
                    >
                        {isActive && (
                            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                        )}

                        <div className="text-5xl mb-2">
                            {preset.emoji}
                        </div>

                        <div className="text-center">
                            <p className="font-bold text-zinc-900">
                                {preset.name}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">
                                Click to apply
                            </p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
