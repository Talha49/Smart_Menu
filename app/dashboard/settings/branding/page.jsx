"use client";

import { useState, useEffect } from "react";
import { useRestaurantStore } from "@/hooks/use-restaurant-store";
import { useMenuStore } from "@/hooks/use-menu-store";
import { useCategoryStore } from "@/hooks/use-category-store";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ColorPicker } from "@/components/settings/ColorPicker";
import { LivePreview } from "@/components/settings/LivePreview";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { Input } from "@/components/ui/Input"; // We might use Select instead for fonts
import { Loader2, Lock, Save, LayoutTemplate } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

const FONT_OPTIONS = [
    { name: "Inter", value: "Inter" },
    { name: "Outfit", value: "Outfit" },
    { name: "Roboto", value: "Roboto" },
    { name: "Playfair Display", value: "Playfair Display" },
    { name: "Lato", value: "Lato" },
];

export default function BrandingPage() {
    const { restaurant, setRestaurant } = useRestaurantStore();
    const { items: menuItems, fetchItems } = useMenuStore();
    const { categories, fetchCategories } = useCategoryStore();

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
            // Fetch menu data for preview if not already loaded
            fetchItems();
            fetchCategories();
        }
    }, [restaurant]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/restaurant/branding", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 403) {
                    toast.error("Upgrade to Pro to save changes!");
                } else {
                    toast.error(data.message || "Failed to save settings");
                }
                return;
            }

            setRestaurant(data.restaurant);
            toast.success("Branding updated successfully!");
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold font-display tracking-tight flex items-center gap-3">
                    <LayoutTemplate className="w-8 h-8 text-primary" />
                    Branding & Appearance
                </h1>
                <p className="text-muted-foreground text-lg">
                    Customize how your digital menu looks to your customers.
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Form */}
                <div className="lg:col-span-7 space-y-6">
                    <Card className={cn(!isPro && "border-primary/20 bg-muted/10 relative overflow-hidden")}>
                        {!isPro && (
                            <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
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

                        <CardHeader>
                            <CardTitle>Brand Identity</CardTitle>
                            <CardDescription>
                                Set your primary brand elements.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Logo Upload */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Restaurant Logo</label>
                                <div className="max-w-xs">
                                    <ImageUpload
                                        value={formData.logoUrl}
                                        onChange={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))}
                                        onRemove={() => setFormData(prev => ({ ...prev, logoUrl: "" }))}
                                        folderPrefix="logos" // We explicitly put logos in a 'logos' folder for tidiness
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
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {FONT_OPTIONS.map((font) => (
                                        <button
                                            key={font.value}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, fontFamily: font.value }))}
                                            className={cn(
                                                "border rounded-lg p-3 text-center transition-all hover:bg-accent",
                                                formData.fontFamily === font.value
                                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                    : "border-border"
                                            )}
                                        >
                                            <span style={{ fontFamily: font.value }} className="text-lg">Aa</span>
                                            <div className="text-xs text-muted-foreground mt-1">{font.name}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button
                            onClick={handleSubmit}
                            size="lg"
                            disabled={isLoading || !isPro}
                            className="w-full md:w-auto min-w-[150px]"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* Right Column: Live Preview */}
                <div className="lg:col-span-5 sticky top-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Live Preview</h3>
                            {restaurant?.restaurantId && (
                                <Link
                                    href={`/menu/${restaurant.restaurantId}`}
                                    target="_blank"
                                    className="text-xs text-primary hover:underline"
                                >
                                    Open Real Page ↗
                                </Link>
                            )}
                        </div>
                        <div className="flex justify-center">
                            <LivePreview
                                restaurant={restaurant}
                                branding={formData}
                                menuItems={menuItems}
                                categories={categories}
                            />
                        </div>
                        <p className="text-xs text-center text-muted-foreground mt-4">
                            Interactive Device Preview
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
