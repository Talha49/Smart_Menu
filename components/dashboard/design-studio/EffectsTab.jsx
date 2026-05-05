"use client";

/**
 * Effects Tab
 * 
 * Atmosphere effects and seasonal themes.
 * Combines Vibe Studio atmosphere + Theme Studio seasonal manager.
 */

import { Slider } from '@/components/ui/Slider';
import { cn } from '@/lib/utils';
import { Sparkles, Snowflake, Wind, Ban } from 'lucide-react';

export function EffectsTab({ config, onChange }) {
    const atmosphereOptions = [
        { id: 'none', label: 'None', icon: Ban, emoji: '🚫' },
        { id: 'snow', label: 'Snow', icon: Snowflake, emoji: '❄️' },
        { id: 'stars', label: 'Stars', icon: Sparkles, emoji: '✨' },
        { id: 'bubbles', label: 'Bubbles', icon: Wind, emoji: '🫧' }
    ];

    const currentAtmosphere = config.effects?.atmosphere?.active || 'none';
    const currentIntensity = config.effects?.atmosphere?.intensity || 50;

    return (
        <div className="space-y-10 py-4">
            {/* Header */}
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Seasonal & Effects</h3>
                <p className="text-sm text-zinc-500 font-medium">
                    Add dynamic atmosphere to your menu
                </p>
            </div>

            {/* Atmosphere Effects */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-white">
                        <Wind className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-zinc-900">Atmosphere Designer</h4>
                        <p className="text-xs text-zinc-500">Environmental effects</p>
                    </div>
                </div>

                <div className="grid gap-8 bg-zinc-50/50 p-6 rounded-[2rem] border border-zinc-100">
                    {/* Effect Selection */}
                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-zinc-700 tracking-tight">Active Effect</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {atmosphereOptions.map((opt) => {
                                const Icon = opt.icon;
                                const isActive = currentAtmosphere === opt.id;

                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => onChange({
                                            ...config,
                                            effects: {
                                                ...config.effects,
                                                atmosphere: {
                                                    ...(config.effects?.atmosphere || {}),
                                                    active: opt.id,
                                                    intensity: currentIntensity
                                                }
                                            }
                                        })}
                                        className={cn(
                                            "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                                            isActive
                                                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                                : "border-zinc-100 bg-white hover:border-zinc-200"
                                        )}
                                    >
                                        <div className="text-4xl">{opt.emoji}</div>
                                        <div className="space-y-1 text-center">
                                            <p className="text-xs font-bold text-zinc-900">{opt.label}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Intensity Slider */}
                    {currentAtmosphere !== 'none' && (
                        <Slider
                            label="Effect Intensity"
                            value={currentIntensity}
                            min={10}
                            max={100}
                            suffix="%"
                            onChange={(val) => onChange({
                                ...config,
                                effects: {
                                    ...config.effects,
                                    atmosphere: {
                                        ...config.effects.atmosphere,
                                        intensity: val
                                    }
                                }
                            })}
                        />
                    )}
                </div>
            </section>

            {/* Info Note */}
            <div className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
                <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">Preview Effects</p>
                        <p className="text-blue-700 text-xs">
                            Atmosphere effects will appear on your live menu. Seasonal themes coming soon!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
