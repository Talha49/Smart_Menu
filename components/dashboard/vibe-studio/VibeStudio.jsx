"use client";

import { useState, useEffect } from "react";
import { useRestaurantStore } from "@/hooks/use-restaurant-store";
import { Slider } from "@/components/ui/Slider";
import { ColorPicker } from "@/components/settings/ColorPicker";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import {
    Sparkles,
    MousePointer2,
    Zap,
    Wind,
    Sun,
    Moon,
    CloudRain,
    Snowflake,
    Ban,
    Save
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOTION_PROFILES = [
    { id: "liquid-spring", label: "Liquid", icon: CloudRain, description: "Smooth, organic fluid motion." },
    { id: "haptic-snap", label: "Haptic", icon: Zap, description: "Crisp, precise tactile snaps." },
    { id: "airy-float", label: "Airy", icon: Wind, description: "Lightweight, floating transitions." },
    { id: "minimal", label: "Classic", icon: MousePointer2, description: "Standard professional animations." },
];

const VIBE_PRESETS = [
    {
        id: "midnight-neon",
        label: "Midnight Neon",
        description: "Cyberpunk aesthetics with dark glass and neon accents.",
        dna: { radius: "12px", glass: 45, motion: "haptic-snap", glow: "high" },
        palette: { primary: "#2dd4bf", accent: "#f472b6", surface: "glass-black", background: "dark" },
        atmosphere: { active: "stars", intensity: 80, effects: ["nebula"] }
    },
    {
        id: "alpine-frost",
        label: "Alpine Frost",
        description: "Pure, crisp design with frosted glass and snow effects.",
        dna: { radius: "32px", glass: 75, motion: "liquid-spring", glow: "soft" },
        palette: { primary: "#0ea5e9", accent: "#f8fafc", surface: "glass-white", background: "minimal" },
        atmosphere: { active: "snow", intensity: 60, effects: ["vignette"] }
    },
    {
        id: "organic-matcha",
        label: "Organic Matcha",
        description: "Earthy tones and smooth motion for a calm experience.",
        dna: { radius: "24px", glass: 15, motion: "airy-float", glow: "none" },
        palette: { primary: "#65a30d", accent: "#78350f", surface: "minimal", background: "warm" },
        atmosphere: { active: "bubbles", intensity: 40, effects: [] }
    }
];

const ATMOSPHERE_OPTIONS = [
    { id: "none", label: "None", icon: Ban },
    { id: "snow", label: "Snow", icon: Snowflake },
    { id: "stars", label: "Stars", icon: Moon },
    { id: "bubbles", label: "Bubbles", icon: Wind },
];

export function VibeStudio() {
    const { restaurant, updateBranding, setPreviewData } = useRestaurantStore();
    const tokens = restaurant?.experienceConfig?.vibeTokens || {};

    const [dna, setDna] = useState(tokens.dna || {
        radius: "24px",
        glass: 20,
        motion: "liquid-spring",
        glow: "none"
    });

    const [palette, setPalette] = useState(tokens.palette || {
        primary: restaurant?.brandColor || "#4f46e5",
        accent: "#f43f5e",
        surface: "glass-white",
        background: "minimal"
    });

    const [atmosphere, setAtmosphere] = useState(tokens.atmosphere || {
        active: "none",
        intensity: 50,
        effects: []
    });

    const [autoSchedule, setAutoSchedule] = useState(restaurant?.experienceConfig?.seasonalAtmosphere?.autoSchedule || false);

    // 1. Instant Preview Sync
    useEffect(() => {
        setPreviewData({
            experienceConfig: {
                ...restaurant?.experienceConfig,
                vibeTokens: { dna, palette, atmosphere },
                seasonalAtmosphere: {
                    ...restaurant?.experienceConfig?.seasonalAtmosphere,
                    autoSchedule
                }
            }
        });
    }, [dna, palette, atmosphere, autoSchedule]);

    const handleUpdate = (section, key, value) => {
        const newState = section === 'dna'
            ? { ...dna, [key]: value }
            : section === 'palette'
                ? { ...palette, [key]: value }
                : { ...atmosphere, [key]: value };

        if (section === 'dna') setDna(newState);
        else if (section === 'palette') setPalette(newState);
        else setAtmosphere(newState);
    };

    const applyPreset = (preset) => {
        setDna(preset.dna);
        setPalette(preset.palette);
        setAtmosphere(preset.atmosphere);
        setAutoSchedule(false); // Presets usually override auto-schedule
        toast.success(`Theme "${preset.label}" applied to preview!`);
    };

    // 2. Debounced Persistence (Optional/Manual Save is usually better for SaaS settings, 
    // but we can auto-save with a long debounce if needed. 
    // For now, let's just make the "Save Branding" button work as the persistence trigger.)

    return (
        <div className="space-y-10 py-4">
            {/* 0. Presets Library Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-white">
                            <Zap className="w-5 h-5 fill-primary text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black italic tracking-tighter uppercase leading-none">Vibe Library</h3>
                            <p className="text-[10px] font-black tracking-widest text-zinc-400 uppercase mt-1">One-Click Transformations</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {VIBE_PRESETS.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => applyPreset(p)}
                            className="group relative flex flex-col items-start p-5 rounded-[2rem] border-2 border-zinc-100 bg-white hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all text-left overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent blur-2xl group-hover:scale-150 transition-transform" />
                            <h4 className="text-sm font-black italic uppercase tracking-tighter mb-1 relative z-10">{p.label}</h4>
                            <p className="text-[10px] text-zinc-400 font-medium leading-tight mb-4 relative z-10">{p.description}</p>
                            <div className="flex gap-1.5 relative z-10">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.palette.primary }} />
                                <div className="w-3 h-3 rounded-full opacity-50" style={{ backgroundColor: p.palette.accent }} />
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* 1. Visual DNA Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black italic tracking-tighter uppercase leading-none">Visual DNA</h3>
                        <p className="text-[10px] font-black tracking-widest text-zinc-400 uppercase mt-1">Foundational Design Tokens</p>
                    </div>
                </div>

                <div className="grid gap-8 bg-zinc-50/50 p-6 rounded-[2rem] border border-zinc-100">
                    <Slider
                        label="Corner Rounding"
                        value={parseInt(dna.radius)}
                        min={0}
                        max={60}
                        suffix="px"
                        onChange={(val) => handleUpdate('dna', 'radius', `${val}px`)}
                    />

                    <Slider
                        label="Glass Intensity"
                        value={dna.glass}
                        min={0}
                        max={100}
                        suffix="%"
                        onChange={(val) => handleUpdate('dna', 'glass', val)}
                    />

                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-zinc-700 tracking-tight">Motion Profile</label>
                        <div className="grid grid-cols-2 gap-3">
                            {MOTION_PROFILES.map((profile) => (
                                <button
                                    key={profile.id}
                                    onClick={() => handleUpdate('dna', 'motion', profile.id)}
                                    className={cn(
                                        "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all text-center",
                                        dna.motion === profile.id
                                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                            : "border-zinc-100 bg-white hover:border-zinc-200"
                                    )}
                                >
                                    <profile.icon className={cn("w-6 h-6", dna.motion === profile.id ? "text-primary" : "text-zinc-400")} />
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest leading-none">{profile.label}</p>
                                        <p className="text-[8px] text-zinc-400 font-medium leading-tight">{profile.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Color Lab Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-white">
                        <div className="w-4 h-4 rounded-full border-2 border-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black italic tracking-tighter uppercase leading-none">Color Lab</h3>
                        <p className="text-[10px] font-black tracking-widest text-zinc-400 uppercase mt-1">Palette Customization</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50/50 p-6 rounded-[2rem] border border-zinc-100">
                    <ColorPicker
                        label="Primary Color"
                        value={palette.primary}
                        onChange={(val) => handleUpdate('palette', 'primary', val)}
                    />
                    <ColorPicker
                        label="Accent Glow"
                        value={palette.accent}
                        onChange={(val) => handleUpdate('palette', 'accent', val)}
                    />
                </div>
            </section>

            {/* 3. Atmosphere Designer Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-white">
                        <Wind className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black italic tracking-tighter uppercase leading-none">Atmosphere Designer</h3>
                        <p className="text-[10px] font-black tracking-widest text-zinc-400 uppercase mt-1">Environmental Effects</p>
                    </div>
                </div>

                <div className="grid gap-8 bg-zinc-50/50 p-6 rounded-[2rem] border border-zinc-100">
                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-zinc-700 tracking-tight">Active Effect</label>
                        <div className="grid grid-cols-4 gap-3">
                            {ATMOSPHERE_OPTIONS.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleUpdate('atmosphere', 'active', opt.id)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all",
                                        atmosphere.active === opt.id
                                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                            : "border-zinc-100 bg-white hover:border-zinc-200"
                                    )}
                                >
                                    <opt.icon className={cn("w-5 h-5", atmosphere.active === opt.id ? "text-primary" : "text-zinc-400")} />
                                    <p className="text-[8px] font-black uppercase tracking-widest leading-none">{opt.label}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {atmosphere.active !== 'none' && (
                        <Slider
                            label="Effect Intensity"
                            value={atmosphere.intensity}
                            min={10}
                            max={100}
                            suffix="%"
                            onChange={(val) => handleUpdate('atmosphere', 'intensity', val)}
                        />
                    )}

                    <div className="pt-6 border-t border-zinc-100/50">
                        <button
                            onClick={() => setAutoSchedule(!autoSchedule)}
                            className={cn(
                                "flex items-center justify-between p-4 rounded-2xl w-full transition-all shadow-xl",
                                autoSchedule ? "bg-zinc-950 text-white" : "bg-white text-zinc-400 border border-zinc-100"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-8 h-8 rounded-xl flex items-center justify-center",
                                    autoSchedule ? "bg-primary/20" : "bg-zinc-100"
                                )}>
                                    <Zap className={cn("w-4 h-4", autoSchedule ? "text-primary fill-primary" : "text-zinc-400")} />
                                </div>
                                <div className="text-left">
                                    <p className={cn("text-[10px] font-black uppercase tracking-widest", autoSchedule ? "text-primary" : "text-zinc-400")}>Smart Atmosphere</p>
                                    <p className="text-[8px] font-medium uppercase">{autoSchedule ? "Automatic seasonal transitions enabled" : "Automatic transitions disabled"}</p>
                                </div>
                            </div>
                            <div className={cn(
                                "w-10 h-6 rounded-full relative flex items-center px-1 transition-colors",
                                autoSchedule ? "bg-primary" : "bg-zinc-200"
                            )}>
                                <div className={cn(
                                    "w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
                                    autoSchedule ? "translate-x-4" : "translate-x-0"
                                )} />
                            </div>
                        </button>
                    </div>
                </div>
            </section>

            {/* Final Action Area */}
            <div className="pt-10 border-t border-zinc-100 flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-bold text-zinc-900 leading-none">Ready to Go Live?</h4>
                    <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-widest font-black">Changes are stored in your restaurant's digital DNA</p>
                </div>
                <Button
                    onClick={async () => {
                        const loadingToast = toast.loading("Persisting Vibe Tokens...");
                        const result = await updateBranding({
                            experienceConfig: {
                                vibeTokens: { dna, palette, atmosphere },
                                seasonalAtmosphere: {
                                    ...restaurant?.experienceConfig?.seasonalAtmosphere,
                                    autoSchedule
                                }
                            }
                        });
                        toast.dismiss(loadingToast);
                        if (result.success) toast.success("Vibe Studio settings saved!");
                        else toast.error("Failed to save vibe: " + result.error);
                    }}
                    className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-2xl px-8 py-6 h-auto"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save Vibe
                </Button>
            </div>
        </div>
    );
}
