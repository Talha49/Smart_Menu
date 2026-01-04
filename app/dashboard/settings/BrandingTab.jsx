"use client";

import { useState, useEffect } from "react";
import { useRestaurantStore } from "@/hooks/use-restaurant-store";
import { Button } from "@/components/ui/Button";
import { ColorPicker } from "@/components/settings/ColorPicker";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { Loader2, Lock, Save, LayoutGrid, RotateCcw, Waves } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

const FONT_OPTIONS = [
    { name: "Inter", value: "Inter" },
    { name: "Outfit", value: "Outfit" },
    { name: "Roboto", value: "Roboto" },
    { name: "Playfair Display", value: "Playfair Display" },
    { name: "Lato", value: "Lato" },
];

const LAYOUT_OPTIONS = [
    { id: "classic-grid", label: "Classic Grid", icon: LayoutGrid, description: "Professional grid layout for most restaurants." },
    { id: "orbital-wheel", label: "Orbital Wheel", icon: RotateCcw, description: "Interactive circular navigation for discovery." },
    { id: "liquid-carousel", label: "Liquid Carousel", icon: Waves, description: "High-impact vertical visuals for food focus." },
];

export function BrandingTab() {
    const { restaurant, updateBranding, setPreviewData } = useRestaurantStore();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        brandColor: "#4f46e5",
        fontFamily: "Inter",
        logoUrl: "",
        experienceConfig: {
            layoutID: "classic-grid"
        }
    });

    const isPro = restaurant?.plan === "pro";

    useEffect(() => {
        if (restaurant) {
            setFormData({
                brandColor: restaurant.brandColor || "#4f46e5",
                fontFamily: restaurant.fontFamily || "Inter",
                logoUrl: restaurant.logoUrl || "",
                experienceConfig: {
                    layoutID: restaurant.experienceConfig?.layoutID || "classic-grid"
                }
            });
        }
    }, [restaurant]);

    // Sync local form data with store preview state for real-time mockup updates
    useEffect(() => {
        setPreviewData(formData);
    }, [formData, setPreviewData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await updateBranding(formData);

        if (result.success) {
            toast.success("Branding updated successfully!");
        } else {
            toast.error(result.error);
        }

        setIsLoading(false);
    };

    return (
        <div className="space-y-6 relative h-full flex flex-col">
            {!isPro && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center text-center p-6 rounded-xl border border-primary/20 bg-muted/10">
                    <Lock className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-2">Pro Feature</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                        Upgrade to SmartMenu Pro to customize your logo, colors, and fonts.
                    </p>
                    <Button className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90">
                        Upgrade to Pro
                    </Button>
                </div>
            )}

            <CardHeader className="px-0 pt-0">
                <CardTitle>Brand Settings</CardTitle>
                <CardDescription>
                    Configure your restaurant's digital identity.
                </CardDescription>
            </CardHeader>

            <div className="space-y-6 flex-1 pr-2 custom-scrollbar">
                {/* Logo Upload */}
                <div className="space-y-3">
                    <label className="text-sm font-medium">Restaurant Logo</label>
                    <div className="max-w-xs">
                        <ImageUpload
                            value={formData.logoUrl}
                            onChange={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))}
                            onRemove={() => setFormData(prev => ({ ...prev, logoUrl: "" }))}
                            folderPrefix="logos"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">Recommended: Transparent PNG, 500x500px.</p>
                </div>

                {/* Brand Color */}
                <ColorPicker
                    label="Primary Brand Color"
                    value={formData.brandColor}
                    onChange={(color) => setFormData(prev => ({ ...prev, brandColor: color }))}
                />

                {/* Font Family */}
                <div className="space-y-3">
                    <label className="text-sm font-medium">Font Family</label>
                    <div className="grid grid-cols-2 gap-3">
                        {FONT_OPTIONS.map((font) => (
                            <button
                                key={font.value}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, fontFamily: font.value }))}
                                className={cn(
                                    "border rounded-lg p-3 text-center transition-all hover:bg-accent flex flex-col items-center gap-1",
                                    formData.fontFamily === font.value
                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                        : "border-border"
                                )}
                            >
                                <span style={{ fontFamily: font.value }} className="text-lg">Aa</span>
                                <span className="text-xs text-muted-foreground">{font.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu Experience (Vibe) */}
                <div className="space-y-4 pt-4 border-t border-border">
                    <div>
                        <label className="text-sm font-medium">Menu Experience (Vibe)</label>
                        <p className="text-xs text-muted-foreground mt-1">Choose how your customers experience your menu.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {LAYOUT_OPTIONS.map((layout) => (
                            <button
                                key={layout.id}
                                type="button"
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    experienceConfig: { ...prev.experienceConfig, layoutID: layout.id }
                                }))}
                                className={cn(
                                    "relative flex items-center gap-4 p-4 border rounded-xl text-left transition-all hover:bg-accent group",
                                    formData.experienceConfig.layoutID === layout.id
                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                        : "border-border"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-lg flex items-center justify-center transition-all",
                                    formData.experienceConfig.layoutID === layout.id
                                        ? "bg-primary text-white"
                                        : "bg-muted text-muted-foreground group-hover:bg-accent-foreground group-hover:text-accent"
                                )}>
                                    <layout.icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-sm tracking-tight">{layout.label}</h4>
                                        {formData.experienceConfig.layoutID === layout.id && (
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">{layout.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-6 mt-auto">
                <Button
                    onClick={handleSubmit}
                    size="lg"
                    disabled={isLoading || !isPro}
                    className="w-full sm:w-auto min-w-[200px]"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Branding
                </Button>
            </div>
        </div>
    );
}
