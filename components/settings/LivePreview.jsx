"use client";

import { DeviceFrameset, DeviceEmulator } from 'react-device-frameset';
import 'react-device-frameset/styles/marvel-devices.min.css';
import 'react-device-frameset/styles/device-emulator.min.css';
import { cn } from "@/lib/utils";
import { useState } from 'react';

export function LivePreview({ restaurant, branding, menuItems = [], categories = [], minimal = false }) {
    const { brandColor, fontFamily, logoUrl } = branding;

    // Sort items by priority/updatedAt if needed, or just take first few
    const displayItems = menuItems.length > 0 ? menuItems.slice(0, 5) : [];
    const displayCategories = categories.length > 0 ? categories : [];

    // We render the "App" content inside the device
    const PreviewContent = () => (
        <div className="flex flex-col h-full bg-white text-gray-900 overflow-y-auto scrollbar-hide" style={{ fontFamily }}>
            {/* Header */}
            <div className="h-14 flex items-center px-4 justify-between border-b bg-white sticky top-0 z-10 shrink-0">
                {logoUrl ? (
                    <img src={logoUrl} className="h-8 w-auto object-contain" alt="Logo" />
                ) : (
                    <span className="font-bold text-lg leading-tight" style={{ color: brandColor }}>
                        {restaurant?.name || "Restaurant"}
                    </span>
                )}
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xs">🔍</span>
                </div>
            </div>

            {/* Category Nav - Horizontal Scroll */}
            <div className="flex gap-2 overflow-x-auto py-3 px-4 scrollbar-hide shrink-0 border-b">
                {displayCategories.length > 0 ? (
                    displayCategories.map((cat, i) => (
                        <div
                            key={cat._id || i}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm whitespace-nowrap shadow-sm",
                                i === 0 ? "font-bold text-white" : "bg-gray-100 text-gray-600"
                            )}
                            style={i === 0 ? { backgroundColor: brandColor } : {}}
                        >
                            {cat.emoji} {cat.name}
                        </div>
                    ))
                ) : (
                    // Fallback Categories
                    <>
                        <div className="px-4 py-1.5 rounded-full text-sm font-bold text-white shadow-sm whitespace-nowrap" style={{ backgroundColor: brandColor }}>
                            Popular
                        </div>
                        <div className="px-4 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600 whitespace-nowrap">
                            Burgers
                        </div>
                        <div className="px-4 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600 whitespace-nowrap">
                            Drinks
                        </div>
                    </>
                )}
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-4 pb-20">
                <h3 className="font-bold text-lg">Menu Items</h3>

                {displayItems.length > 0 ? (
                    displayItems.map((item) => (
                        <div key={item._id} className={cn("bg-white border rounded-xl p-3 flex gap-3 shadow-sm", item.stock === 'sold_out' && "opacity-60")}>
                            <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden relative">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs">IMG</div>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="font-bold text-sm mb-1 line-clamp-1">{item.name}</div>
                                    <div className="text-xs text-muted-foreground line-clamp-2">{item.description}</div>
                                </div>
                                <div className="font-bold text-sm flex justify-between items-end">
                                    <span style={{ color: brandColor }}>${item.price}</span>
                                    {item.stock === 'sold_out' && <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded text-gray-500 uppercase">Sold Out</span>}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    // Fallback Items if no real data
                    <>
                        <div className="bg-white border rounded-xl p-3 flex gap-3 shadow-sm">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden relative">
                                <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs">IMG</div>
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="font-bold text-sm mb-1">Example Item</div>
                                    <div className="text-xs text-muted-foreground line-clamp-2">Add items to your menu to see them here.</div>
                                </div>
                                <div className="font-bold text-sm" style={{ color: brandColor }}>$12.99</div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Watermark fake */}
            <div className="mt-auto py-4 text-center text-xs text-gray-400">
                Powered by SmartMenu
            </div>
        </div>
    );

    if (minimal) return <PreviewContent />;

    return (
        <div className="flex justify-center w-full">
            {/* 
               We wrap in a div with explicit dimensions or centering if needed. 
               DeviceEmulator handles the UI for switching.
            */}
            <DeviceEmulator
                banDevices={['HTC One', 'Lumia 920', 'Nexus 5']}
            >
                {(props) => (
                    <DeviceFrameset {...props} device={props?.device || "iPhone X"} color={props?.color || "black"}>
                        <PreviewContent />
                    </DeviceFrameset>
                )}
            </DeviceEmulator>
        </div>
    );
}
