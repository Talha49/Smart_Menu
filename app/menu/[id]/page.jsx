"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";
import { CategoryNav } from "@/components/public/CategoryNav";
import { MenuItemDetail } from "@/components/public/MenuItemDetail";
import { Input } from "@/components/ui/Input";
import { useParams } from "next/navigation";

// Fetcher for SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function PublicMenuPage() {
    const { id } = useParams(); // This is the restaurantId slug
    const { data, error, isLoading } = useSWR(`/api/public/menu/${id}`, fetcher, {
        refreshInterval: 30000, // Poll every 30s
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("");

    // Scroll Spy Logic
    useEffect(() => {
        const handleScroll = () => {
            // Simple logic to find which category is currently at the top
            // ... implementation later
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-muted/10">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground animate-pulse">Loading menu...</p>
        </div>
    );

    if (error || data?.error) return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-2xl font-bold mb-2">Restaurant Not Found</h1>
            <p className="text-muted-foreground">This menu does not exist or has been removed.</p>
        </div>
    );

    const { restaurant, menu } = data;

    // Filter menu based on search
    const filteredMenu = menu.map(group => ({
        ...group,
        items: group.items.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(group => group.items.length > 0);

    return (
        <div className="min-h-screen bg-muted/5 pb-24" style={{ fontFamily: restaurant.fontFamily }}>
            {/* Header */}
            <header className="bg-background pt-6 pb-4 px-4 shadow-sm z-20 relative">
                <div className="max-w-md mx-auto flex flex-col items-center text-center">
                    {/* Logo (if Pro) */}
                    {restaurant.logoUrl && (
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-border relative">
                            {/* Use standard img for now to avoid next/image domain config issues with public uploads */}
                            <img src={restaurant.logoUrl} alt={restaurant.name} className="w-full h-full object-cover" />
                        </div>
                    )}

                    <h1 className="text-2xl font-bold tracking-tight mb-1">{restaurant.name}</h1>
                    <p className="text-sm text-muted-foreground mb-4">Digital Menu</p>

                    {/* Search Bar */}
                    <div className="w-full relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search for dishes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
                        />
                    </div>
                </div>
            </header>

            {/* Sticky Category Nav */}
            <CategoryNav categories={filteredMenu} activeCategory={activeCategory} brandColor={restaurant.brandColor} />

            {/* Menu List */}
            <main className="max-w-md mx-auto px-4 pt-6 space-y-8">
                {filteredMenu.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No items found matching "{searchQuery}"</p>
                    </div>
                ) : (
                    filteredMenu.map((group) => (
                        <section key={group._id} id={`category-${group.name}`} className="scroll-mt-32">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="text-2xl">{group.emoji}</span> {group.name}
                            </h2>

                            <div className="grid gap-4">
                                {group.items.map((item) => (
                                    <div
                                        key={item._id}
                                        className="bg-card rounded-2xl p-3 flex gap-4 shadow-sm border border-border/50 active:scale-[0.98] transition-transform cursor-pointer"
                                    // onClick open modal
                                    >
                                        {/* Text Content */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                            <div>
                                                <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                            <div className="mt-2 font-bold" style={{ color: restaurant.brandColor }}>
                                                ${item.price.toFixed(2)}
                                            </div>
                                        </div>

                                        {/* Image thumbnail */}
                                        {item.imageUrl && (
                                            <div className="w-24 h-24 flex-shrink-0 bg-muted rounded-xl overflow-hidden relative">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))
                )}
            </main>

            {/* Footer / Watermark */}
            <footer className="mt-12 py-8 text-center text-xs text-muted-foreground border-t">
                {restaurant.plan === 'free' && (
                    <div className="flex flex-col items-center gap-1 opacity-70">
                        <span>Powered by</span>
                        <span className="font-bold text-lg text-foreground tracking-tight">SmartMenu</span>
                    </div>
                )}
            </footer>
        </div>
    );
}
