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
    const { restaurant } = useRestaurantStore();
    const { items: menuItems } = useMenuStore();
    const { categories } = useCategoryStore();

    return (
        <div className="min-h-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <div className="grid lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Form Controls (Tabs) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <Card className="shadow-2xl shadow-zinc-200/50 border border-zinc-100 bg-white rounded-[2.5rem]">
                        <Tabs defaultValue="branding" className="flex flex-col">
                            <div className="px-8 pt-8 border-b bg-zinc-50/50">
                                <TabsList className="grid grid-cols-2 w-full max-w-md mb-8 p-1 bg-zinc-100 rounded-2xl">
                                    <TabsTrigger value="branding" className="gap-2 rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                        <Palette className="w-4 h-4" /> Branding
                                    </TabsTrigger>
                                    <TabsTrigger value="profile" className="gap-2 rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                        <Store className="w-4 h-4" /> Business Profile
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="p-8">
                                <TabsContent value="branding" className="m-0 focus-visible:outline-none">
                                    <BrandingTab />
                                </TabsContent>
                                <TabsContent value="profile" className="m-0 focus-visible:outline-none">
                                    <BusinessProfileTab />
                                </TabsContent>
                            </div>
                        </Tabs>
                    </Card>
                </div>

                {/* Right Column: Live Preview Mockup - Fixed Sticky Wrapper */}
                <div className="lg:col-span-5 sticky top-8 self-start">
                    <Card className="flex flex-col overflow-hidden bg-zinc-50/50 border-2 border-dashed border-zinc-200 relative rounded-[2.5rem]">
                        <div className="absolute top-18 left-3 z-10">
                            <div className="bg-white/80 backdrop-blur-md border border-zinc-200 px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest text-zinc-500 shadow-sm flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Live Preview Sync
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center p-4 relative min-h-[700px]">
                            {/* Device Emulator */}
                            <div className="scale-[0.85] xl:scale-[1.0] origin-center w-full flex justify-center">
                                <LivePreview
                                    restaurant={restaurant}
                                    branding={{
                                        brandColor: restaurant?.brandColor || "#4f46e5",
                                        fontFamily: restaurant?.fontFamily || "Inter",
                                        logoUrl: restaurant?.logoUrl || ""
                                    }}
                                    menuItems={menuItems}
                                    categories={categories}
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-zinc-100 bg-white/50 text-center text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
                            Global Sync Engine v2.0
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
