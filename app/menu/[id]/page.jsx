"use client";

import { useParams, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import useSWR from "swr";
import {
    Search,
    Loader2,
    Sparkles,
    MapPin,
    Phone,
    MessageCircle,
    Instagram,
    Facebook,
    Twitter,
    Clock,
    Share2,
    Monitor,
    X,
    Info,
    ChevronDown,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CategoryNav } from "@/components/public/CategoryNav";
import { MenuItemDetail } from "@/components/public/MenuItemDetail";
import { ItemCustomizationModal } from "@/components/public/ItemCustomizationModal";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { LayoutFactory } from "@/components/public/layouts/LayoutFactory";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function PublicMenuPage() {
    const { id } = useParams();
    const { data, error, isLoading } = useSWR(`/api/public/menu/${id}`, fetcher, {
        revalidateOnFocus: false,
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("");
    const [isTVMode, setIsTVMode] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showSplash, setShowSplash] = useState(true);
    const [showInfo, setShowInfo] = useState(false);
    const [previewOverride, setPreviewOverride] = useState(null);
    const searchParams = useSearchParams();
    const isPreview = searchParams.get("preview") === "true";

    const scrollInterval = useRef(null);

    // 0. Preview Mode Listener
    useEffect(() => {
        if (!isPreview) return;

        const handleMessage = (event) => {
            // In production, we should check event.origin for security
            if (event.data?.type === "PREVIEW_UPDATE") {
                setPreviewOverride(event.data.data);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [isPreview]);

    // Apply overrides if in preview mode
    const activeRestaurant = previewOverride ? {
        ...data?.restaurant,
        ...previewOverride,
        experienceConfig: {
            ...data?.restaurant?.experienceConfig,
            ...previewOverride.experienceConfig
        }
    } : data?.restaurant;

    // 1. Cinematic Intro Sequence
    useEffect(() => {
        if (!isLoading && data && showSplash) {
            const tl = gsap.timeline();

            tl.to(".splash-logo", { duration: isPreview ? 0.3 : 0.8, scale: 1.1, opacity: 1, ease: "power4.out" })
                .to(".splash-text", { duration: isPreview ? 0.3 : 0.8, y: 0, opacity: 1, stagger: 0.1, ease: "back.out" }, "-=0.2")
                .to(".splash-screen", {
                    duration: isPreview ? 0.5 : 1.2,
                    y: "-100%",
                    delay: isPreview ? 0.2 : 1.2,
                    ease: "expo.inOut",
                    onComplete: () => {
                        setShowSplash(false);
                    }
                });
        }
    }, [isLoading, data, showSplash]);

    // 2. Menu Item Entry Animation (Fires AFTER splash is gone)
    useEffect(() => {
        if (!showSplash && !isLoading && data) {
            // Give React a tiny slice of time to render the list before GSAP targets it
            const timer = setTimeout(() => {
                const items = document.querySelectorAll(".menu-item");
                if (items.length > 0) {
                    gsap.from(items, {
                        duration: 1.2,
                        y: 80,
                        opacity: 0,
                        stagger: 0.08,
                        ease: "power4.out",
                        clearProps: "all" // Important: clear GSAP styles after intro
                    });
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [showSplash, isLoading, data]);

    // TV Mode Scrolling Logic
    useEffect(() => {
        if (isTVMode) {
            scrollInterval.current = setInterval(() => {
                if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    window.scrollBy({ top: 1, behavior: 'auto' }); // Fixed: 'linear' is not a valid ScrollBehavior
                }
            }, 30);
            document.documentElement.requestFullscreen?.();
        } else {
            clearInterval(scrollInterval.current);
            if (document.fullscreenElement) document.exitFullscreen?.();
        }
        return () => clearInterval(scrollInterval.current);
    }, [isTVMode]);

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: data?.restaurant?.name || "Digital Menu",
                    text: `Check out our digital menu at ${data?.restaurant?.name}`,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
            }
        } catch (err) { console.error(err); }
    };

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-zinc-950 text-white font-black italic tracking-tighter">
            <h1 className="text-4xl">SYSTEM ERROR</h1>
            <p className="text-zinc-600 mt-2 uppercase tracking-widest text-xs">RESTAURANT_ID_NOT_FOUND</p>
        </div>
    );

    // Loading & Splash Container
    if (isLoading || (showSplash && data)) return (
        <div key="splash" className="splash-screen fixed inset-0 z-[200] bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
            <div className="relative text-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    className="splash-logo mb-8"
                >
                    {data?.restaurant?.logoUrl ? (
                        <img src={data.restaurant.logoUrl} alt="Logo" className="w-24 h-24 object-contain mx-auto border-2 border-white/10 rounded-3xl p-2 bg-white/5" />
                    ) : (
                        <div className="w-20 h-20 rounded-3xl bg-white/5 border-2 border-white/10 flex items-center justify-center text-4xl mx-auto">🍽️</div>
                    )}
                </motion.div>

                <div className="overflow-hidden">
                    <h1 className="splash-text translate-y-20 opacity-0 text-5xl md:text-8xl font-black text-white italic tracking-tighter leading-none">
                        {data?.restaurant?.name?.toUpperCase() || "WELCOME"}
                    </h1>
                </div>
                <div className="overflow-hidden mt-4">
                    <p className="splash-text translate-y-10 opacity-0 text-[10px] md:text-xs font-black text-primary uppercase tracking-[0.5em] ml-2">
                        Liquid Menu Experience
                    </p>
                </div>
            </div>

            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/4 left-0 w-full h-[1px] bg-white transform -rotate-12" />
                <div className="absolute top-2/4 left-0 w-full h-[1px] bg-white transform rotate-6" />
                <div className="absolute top-3/4 left-0 w-full h-[1px] bg-white transform -rotate-3" />
            </div>
        </div>
    );

    // If we're here, we have data and splash is done
    if (!data || !activeRestaurant || !data.menu) return null;

    const restaurant = activeRestaurant;
    const menu = data.menu;
    const bp = restaurant.businessProfile || {};

    const formatUrl = (url) => {
        if (!url) return "";
        return url.startsWith("http") ? url : `https://${url}`;
    };

    const filteredMenu = menu.map(group => ({
        ...group,
        items: (group.items || []).filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(group => group.items.length > 0);

    return (
        <div key="menu-main" className={cn(
            "min-h-screen transition-all duration-1000",
            isTVMode ? "bg-black text-white" : "bg-white text-zinc-950 font-medium"
        )} style={{ fontFamily: restaurant.fontFamily, transform: 'none' }}>

            <ItemCustomizationModal
                item={selectedItem}
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
            />

            {/* Header: High-End Minimalist */}
            <header className={cn(
                "sticky top-0 z-50 backdrop-blur-3xl border-b transition-all duration-700",
                isTVMode ? "bg-black/90 border-white/5 py-4" : (restaurant.experienceConfig?.layoutID === "orbital-wheel" ? "bg-white/80 border-zinc-100 py-1 px-4" : "bg-white/80 border-zinc-100 py-4 md:py-8 px-4 md:px-6")
            )}>
                <div className={cn(
                    "max-w-7xl mx-auto flex flex-col items-center",
                    restaurant.experienceConfig?.layoutID === "orbital-wheel" ? "gap-1" : "gap-4 md:gap-6"
                )}>
                    <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-3 md:gap-6">
                            {restaurant.logoUrl && (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl overflow-hidden border border-zinc-100 relative bg-white flex items-center justify-center p-1 md:p-1.5 shadow-sm"
                                >
                                    <img src={restaurant.logoUrl} alt={restaurant.name} className="w-full h-full object-contain" />
                                </motion.div>
                            )}
                            <div className="flex flex-col">
                                <h1 className={cn("font-black tracking-tighter leading-none italic", isTVMode ? "text-2xl md:text-4xl" : "text-xl md:text-3xl")}>
                                    {restaurant.name.toUpperCase()}
                                </h1>
                                {!isTVMode && <span className="hidden md:block text-[10px] font-black tracking-[0.4em] text-zinc-400 mt-1 uppercase">Visual Gastronomy</span>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsTVMode(!isTVMode)}
                                className={cn("rounded-xl md:rounded-2xl w-10 h-10 md:w-12 md:h-12 transition-all border", isTVMode ? "bg-white/10 text-white border-white/10" : "bg-zinc-50 border-zinc-100 text-zinc-400 hover:text-zinc-950")}
                            >
                                {isTVMode ? <X className="w-4 h-4 md:w-5 md:h-5" /> : <Monitor className="w-4 h-4 md:w-5 md:h-5" />}
                            </Button>
                            {!isTVMode && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowInfo(!showInfo)}
                                    className="rounded-xl md:rounded-2xl w-10 h-10 md:w-12 md:h-12 bg-zinc-50 border border-zinc-100 text-zinc-400 hover:text-zinc-950"
                                >
                                    <Info className="w-4 h-4 md:w-5 md:h-5" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {!isTVMode && (
                        <div className="relative max-w-xl w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                            <input
                                type="text"
                                placeholder="Curate your experience..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={cn(
                                    "w-full pl-12 pr-6 rounded-2xl md:rounded-3xl border-2 border-zinc-50 bg-zinc-50 focus:bg-white focus:border-zinc-200 transition-all outline-none text-xs md:text-sm font-bold tracking-tight",
                                    restaurant.experienceConfig?.layoutID === "orbital-wheel" ? "py-2" : "py-3 md:py-4"
                                )}
                            />
                        </div>
                    )}
                </div>
            </header>

            {!isTVMode && restaurant.experienceConfig?.layoutID !== "orbital-wheel" && (
                <CategoryNav
                    categories={filteredMenu}
                    activeCategory={activeCategory}
                    brandColor={restaurant.brandColor}
                />
            )}

            <main className={cn(
                "max-w-7xl mx-auto px-4 md:px-6 transition-all duration-1000",
                isTVMode ? "pt-10" : (restaurant.experienceConfig?.layoutID === "orbital-wheel" ? "pt-0" : "pt-8 md:pt-12")
            )}>
                <LayoutFactory
                    layoutID={restaurant.experienceConfig?.layoutID}
                    isTVMode={isTVMode}
                    groupedItems={filteredMenu}
                    setSelectedItem={setSelectedItem}
                    {...restaurant.experienceConfig}
                />
            </main>


            {/* Minimalist Premium Footer */}
            <footer className={cn(
                "py-12 md:py-16 px-4 md:px-6 border-t border-zinc-100 transition-opacity duration-1000",
                (isTVMode || isPreview) ? "hidden" : "block"
            )}>
                <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 md:gap-12">
                    <div className="flex items-center gap-6 md:gap-12 border-b border-zinc-100 pb-8 md:pb-12 w-full justify-center flex-wrap">
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">Share</span>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={handleShare} className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-zinc-100">
                                    <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="w-[1px] h-4 bg-zinc-100 hidden md:block" />

                        <div className="flex items-center gap-6">
                            {bp.socialLinks?.instagram && <a href={formatUrl(bp.socialLinks.instagram)} className="text-zinc-400 hover:text-zinc-950 transition-colors"><Instagram className="w-4 h-4 md:w-5 md:h-5" /></a>}
                            {bp.socialLinks?.facebook && <a href={formatUrl(bp.socialLinks.facebook)} className="text-zinc-400 hover:text-zinc-950 transition-colors"><Facebook className="w-4 h-4 md:w-5 md:h-5" /></a>}
                        </div>
                    </div>

                    <div className="flex flex-col items-center text-center gap-3 md:gap-4">
                        <div className="text-xl md:text-2xl font-black italic tracking-tighter opacity-20 select-none">SMART MENU</div>
                        <p className="text-[8px] md:text-[10px] uppercase font-black tracking-[0.2em] text-zinc-300">
                            ©{new Date().getFullYear()} {restaurant.name.toUpperCase()} / THE FUTURE OF DINING
                        </p>
                    </div>
                </div>
            </footer>

            {/* Business Info Drawer */}
            <AnimatePresence>
                {showInfo && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-lg"
                            onClick={() => setShowInfo(false)}
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-x-0 bottom-0 z-[120] bg-zinc-950 text-white rounded-t-[3rem] p-10 max-w-3xl mx-auto shadow-2xl border-t border-white/5"
                        >
                            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-10" />
                            <div className="space-y-12">
                                <div className="text-center">
                                    <h3 className="text-4xl font-black italic tracking-tighter mb-4">ESTABLISHMENT INFO</h3>
                                    <p className="text-zinc-500 font-medium italic">"{bp.description || "A premier dining destination focused on exceptional quality and flavor."}"</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="flex gap-6 items-start">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10"><MapPin className="w-5 h-5 text-primary" /></div>
                                            <div>
                                                <span className="text-[10px] font-black tracking-widest text-zinc-600 block mb-1">LOCATION</span>
                                                <span className="text-sm font-bold text-zinc-300">{bp.address || "Contact for address"}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-6 items-start">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10"><Phone className="w-5 h-5 text-primary" /></div>
                                            <div>
                                                <span className="text-[10px] font-black tracking-widest text-zinc-600 block mb-1">CONTACT</span>
                                                <span className="text-sm font-bold text-zinc-300">{bp.phone || "No phone listed"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/10">
                                        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-zinc-500 mb-2">
                                            <Clock className="w-4 h-4" /> SERVICE HOURS
                                        </div>
                                        <div className="space-y-2">
                                            {bp.openingHours?.map((h, i) => (
                                                <div key={i} className="flex justify-between text-xs font-bold">
                                                    <span className="text-zinc-600">{h.day}</span>
                                                    <span className={h.isClosed ? "text-red-500" : "text-white"}>{h.isClosed ? "Closed" : `${h.open} - ${h.close}`}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-16 rounded-[1.5rem] bg-white text-black font-black uppercase tracking-widest mt-4"
                                    onClick={() => setShowInfo(false)}
                                >
                                    Return to Menu
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
