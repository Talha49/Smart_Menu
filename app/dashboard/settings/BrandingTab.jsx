"use client";

import { useState, useEffect } from "react";
import { useRestaurantStore } from "@/hooks/use-restaurant-store";
import { Button } from "@/components/ui/Button";
import { ColorPicker } from "@/components/settings/ColorPicker";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { Loader2, Lock, Save } from "lucide-react";
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

export function BrandingTab() {
    const { restaurant, updateBranding } = useRestaurantStore();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        brandColor: "#4f46e5",
        fontFamily: "Inter",
        logoUrl: "",
    });

    const isPro = restaurant?.plan === "pro";

    useEffect(() => {
        if (restaurant) {
            setFormData({
                brandColor: restaurant.brandColor || "#4f46e5",
                fontFamily: restaurant.fontFamily || "Inter",
                logoUrl: restaurant.logoUrl || "",
            });
        }
    }, [restaurant]);

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
