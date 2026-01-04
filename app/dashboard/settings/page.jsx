"use client";

import { useRestaurantStore } from "@/hooks/use-restaurant-store";
import { useMenuStore } from "@/hooks/use-menu-store";
import { useCategoryStore } from "@/hooks/use-category-store";
import { Card } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { LivePreview } from "@/components/settings/LivePreview";
import { BrandingTab } from "./BrandingTab";
import { BusinessProfileTab } from "./BusinessProfileTab";
import { Palette, Store } from "lucide-react";

export default function SettingsPage() {
    const { restaurant, previewData } = useRestaurantStore();
    const { items: menuItems } = useMenuStore();
    const { categories } = useCategoryStore();

    // Use preview data if available, otherwise fallback to saved restaurant data
    const activeData = previewData || restaurant;

    return (
        <div className="h-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-12 gap-6 h-full items-stretch">

                {/* Left Column: Form Controls (Tabs) */}
                <div className="lg:col-span-5 flex flex-col h-full overflow-hidden">
                    <Card className="flex-1 flex flex-col shadow-sm border-none bg-card/50 backdrop-blur-sm overflow-hidden">
                        <Tabs defaultValue="branding" className="flex-1 flex flex-col overflow-hidden">
                            <div className="px-6 pt-6 border-b bg-muted/20">
                                <TabsList className="grid grid-cols-2 w-full mb-6">
                                    <TabsTrigger value="branding" className="gap-2">
                                        <Palette className="w-4 h-4" /> Branding
                                    </TabsTrigger>
                                    <TabsTrigger value="profile" className="gap-2">
                                        <Store className="w-4 h-4" /> Business Profile
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-4">
                                <TabsContent value="branding" className="m-0 h-full focus-visible:outline-none">
                                    <BrandingTab />
                                </TabsContent>
                                <TabsContent value="profile" className="m-0 h-full focus-visible:outline-none">
                                    <BusinessProfileTab />
                                </TabsContent>
                            </div>
                        </Tabs>
                    </Card>
                </div>

                {/* Right Column: Live Preview Mockup */}
                <div className="lg:col-span-7 flex flex-col h-full">
                    <Card className="h-full flex flex-col overflow-hidden bg-muted/30 border-dashed border-2 relative">
                        <div className="absolute top-4 left-4 z-10">
                            <div className="bg-background/80 backdrop-blur-sm border px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground shadow-sm">
                                Live Preview Sync
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center p-8 relative min-h-[600px]">
                            {/* Device Emulator */}
                            <div className="scale-[0.8] md:scale-[0.85] origin-center w-full flex justify-center">
                                <LivePreview
                                    restaurant={activeData}
                                    branding={{
                                        brandColor: activeData?.brandColor || "#4f46e5",
                                        fontFamily: activeData?.fontFamily || "Inter",
                                        logoUrl: activeData?.logoUrl || "",
                                        layoutID: activeData?.experienceConfig?.layoutID || "classic-grid"
                                    }}
                                    menuItems={menuItems}
                                    categories={categories}
                                />
                            </div>
                        </div>

                    </Card>
                </div>
            </div>
        </div>
    );
}
