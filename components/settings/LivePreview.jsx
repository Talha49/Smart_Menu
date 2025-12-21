"use client";

import { DeviceFrameset, DeviceEmulator } from 'react-device-frameset';
import 'react-device-frameset/styles/marvel-devices.min.css';
import 'react-device-frameset/styles/device-emulator.min.css';
import { cn } from "@/lib/utils";
import { Search, Sparkles, Instagram, Facebook, Twitter, MapPin, Phone, Clock, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/Button";

export function LivePreview({
    restaurant,
    branding,
    menuItems = [],
    categories = [],
    onCategoryClick,
    onItemClick,
    minimal = false
}) {
    const { brandColor, fontFamily, logoUrl } = branding;
    const bp = restaurant?.businessProfile || {}; // Access the new nested object

    const displayItems = menuItems.length > 0 ? menuItems.slice(0, 10) : [];
    const displayCategories = categories.length > 0 ? categories : [];

    const PreviewContent = () => (
        <div className="flex flex-col h-full bg-white text-gray-900 overflow-y-auto scrollbar-hide select-none" style={{ fontFamily }}>
            {/* Header */}
            <div className="h-14 flex items-center px-4 justify-between border-b bg-white sticky top-0 z-10 shrink-0">
                {logoUrl ? (
                    <img src={logoUrl} className="h-9 w-auto object-contain" alt="Logo" />
                ) : (
                    <span className="font-bold text-lg leading-tight tracking-tight" style={{ color: brandColor }}>
                        {restaurant?.name || "Restaurant"}
                    </span>
                )}
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border text-gray-400">
                    <Search className="w-3.5 h-3.5" />
                </div>
            </div>

            {/* Category Nav */}
            <div className="flex gap-2 overflow-x-auto py-3 px-4 scrollbar-hide shrink-0 border-b bg-white/80 backdrop-blur-sm sticky top-14 z-10">
                {displayCategories.length > 0 ? (
                    displayCategories.map((cat, i) => (
                        <div
                            key={cat._id || i}
                            onClick={() => onCategoryClick?.(cat)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm border transition-all cursor-pointer active:scale-95",
                                i === 0 ? "text-white border-transparent" : "bg-white text-gray-600 border-gray-100"
                            )}
                            style={i === 0 ? { backgroundColor: brandColor } : {}}
                        >
                            {cat.emoji} {cat.name}
                        </div>
                    ))
                ) : (
                    <>
                        <div className="px-4 py-1.5 rounded-full text-sm font-bold text-white shadow-sm whitespace-nowrap" style={{ backgroundColor: brandColor }}>
                            Popular
                        </div>
                        <div className="px-4 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600 whitespace-nowrap">
                            Drinks
                        </div>
                    </>
                )}
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-4 pb-20">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-base">Explore Menu</h3>
                    <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        {menuItems.length} Items Available
                    </div>
                </div>

                {displayItems.length > 0 ? (
                    displayItems.map((item) => {
                        return (
                            <div
                                key={item._id}
                                onClick={() => onItemClick?.(item)}
                                className={cn(
                                    "bg-white border rounded-2xl overflow-hidden flex flex-col shadow-sm transition-all hover:shadow-md cursor-pointer active:scale-[0.98]",
                                    item.isAvailable === false && "opacity-60 grayscale"
                                )}
                            >
                                <div className="h-40 bg-gray-100 relative overflow-hidden">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                            <span className="text-4xl text-gray-200">🍽️</span>
                                        </div>
                                    )}
                                    {item.isFeatured && (
                                        <div
                                            className="absolute top-0 right-0 px-3 py-1.5 rounded-bl-2xl flex items-center gap-1.5 text-[10px] font-bold text-white shadow-lg animate-in fade-in slide-in-from-right-2 duration-300"
                                            style={{ backgroundColor: brandColor }}
                                        >
                                            <Sparkles className="w-3 h-3 fill-current" />
                                            TOP PICK
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-1.5">
                                        <div className="font-bold text-sm line-clamp-1">{item.name}</div>
                                        <div className="font-bold text-sm shrink-0" style={{ color: brandColor }}>
                                            ${item.price}
                                        </div>
                                    </div>
                                    <div className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                                        {item.description}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-20 text-center">
                        <div className="text-4xl mb-4 opacity-20">🍱</div>
                        <p className="text-sm text-gray-400">Your delicious menu items will appear here.</p>
                    </div>
                )}
            </div>

            {/* Business Footer - Using bp object */}
            <div className="mt-6 border-t bg-gray-50/50">
                <div className="p-6 space-y-6">
                    <div className="text-center space-y-2">
                        <div className="font-bold text-sm" style={{ color: brandColor }}>{restaurant?.name}</div>
                        {bp.description && (
                            <p className="text-[11px] text-gray-500 leading-relaxed italic px-4">
                                "{bp.description}"
                            </p>
                        )}
                    </div>

                    <div className="flex justify-center gap-4">
                        {bp.socialLinks?.instagram && (
                            <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-pink-600 shadow-sm">
                                <Instagram className="w-4 h-4" />
                            </div>
                        )}
                        {bp.socialLinks?.facebook && (
                            <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-blue-600 shadow-sm">
                                <Facebook className="w-4 h-4" />
                            </div>
                        )}
                        {bp.socialLinks?.twitter && (
                            <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-sky-500 shadow-sm">
                                <Twitter className="w-4 h-4" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        {bp.address && (
                            <div className="flex items-center gap-3 p-3 bg-white border rounded-xl shadow-sm">
                                <MapPin className="w-4 h-4 shrink-0" style={{ color: brandColor }} />
                                <span className="text-[11px] text-gray-600 font-medium line-clamp-1">{bp.address}</span>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                            {bp.phone && (
                                <div className="flex items-center gap-3 p-3 bg-white border rounded-xl shadow-sm">
                                    <Phone className="w-4 h-4 shrink-0" style={{ color: brandColor }} />
                                    <span className="text-[11px] text-gray-600 font-medium">Call</span>
                                </div>
                            )}
                            {bp.whatsapp && (
                                <div className="flex items-center gap-3 p-3 bg-white border rounded-xl shadow-sm">
                                    <MessageCircle className="w-4 h-4 shrink-0 text-green-500" />
                                    <span className="text-[11px] text-gray-600 font-medium">WhatsApp</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {bp.openingHours?.length > 0 && (
                        <div className="bg-white border rounded-xl p-4 space-y-3 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    <Clock className="w-3.5 h-3.5" /> Opening Hours
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-y-1.5 gap-x-4">
                                {bp.openingHours.map((h, i) => (
                                    <div key={i} className="flex justify-between text-[10px]">
                                        <span className="text-gray-400">{h.day.slice(0, 3)}</span>
                                        <span className={cn("font-medium", h.isClosed ? "text-red-400" : "text-gray-600")}>
                                            {h.isClosed ? "Closed" : `${h.open} - ${h.close}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="py-2 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border text-[9px] text-gray-400 font-bold tracking-tight shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: brandColor }} />
                            Powered by SmartMenu
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (minimal) return <PreviewContent />;

    return (
        <div className="flex justify-center w-full">
            <DeviceEmulator banDevices={['HTC One', 'Lumia 920', 'Nexus 5']}>
                {(props) => (
                    <DeviceFrameset {...props} device={props?.device || "iPhone X"} color={props?.color || "black"}>
                        <PreviewContent />
                    </DeviceFrameset>
                )}
            </DeviceEmulator>
        </div>
    );
}
