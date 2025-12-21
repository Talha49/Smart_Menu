"use client";

import { useParams } from "next/navigation";
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
    ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CategoryNav } from "@/components/public/CategoryNav";
import { MenuItemDetail } from "@/components/public/MenuItemDetail";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

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

    const scrollInterval = useRef(null);

    // 1. Cinematic Intro Sequence
    useEffect(() => {
        if (!isLoading && data && showSplash) {
            const tl = gsap.timeline();

            tl.to(".splash-logo", { duration: 0.8, scale: 1.1, opacity: 1, ease: "power4.out" })
                .to(".splash-text", { duration: 0.8, y: 0, opacity: 1, stagger: 0.2, ease: "back.out" }, "-=0.3")
                .to(".splash-screen", {
                    duration: 1.2,
                    y: "-100%",
                    delay: 1.2,
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
    if (!data || !data.restaurant || !data.menu) return null;

    const { restaurant, menu } = data;
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

            <MenuItemDetail
                item={selectedItem}
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
            />

            {/* Header: High-End Minimalist */}
            <header className={cn(
                "sticky top-0 z-50 backdrop-blur-3xl border-b transition-all duration-700",
                isTVMode ? "bg-black/90 border-white/5 py-4" : "bg-white/80 border-zinc-100 py-4 md:py-8 px-4 md:px-6"
            )}>
                <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 md:gap-6">
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
                                className="w-full pl-12 pr-6 py-3 md:py-4 rounded-2xl md:rounded-3xl border-2 border-zinc-50 bg-zinc-50 focus:bg-white focus:border-zinc-200 transition-all outline-none text-xs md:text-sm font-bold tracking-tight"
                            />
                        </div>
                    )}
                </div>
            </header>

            {!isTVMode && <CategoryNav categories={filteredMenu} activeCategory={activeCategory} brandColor={restaurant.brandColor} />}

            <main className={cn(
                "max-w-7xl mx-auto px-4 md:px-6 transition-all duration-1000",
                isTVMode ? "pt-10" : "pt-8 md:pt-12"
            )}>
                {filteredMenu.map((group) => (
                    <section key={group._id} id={`category-${group.name}`} className="mb-12 md:mb-24 scroll-mt-32 md:scroll-mt-48">
                        <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
                            <div className="text-3xl md:text-4xl shrink-0 drop-shadow-sm">{group.emoji}</div>
                            <h2 className={cn("font-black italic tracking-tighter leading-none uppercase", isTVMode ? "text-4xl md:text-6xl text-white" : "text-2xl md:text-4xl text-zinc-950")}>
                                {group.name}
                            </h2>
                            <div className="flex-1 h-[1px] md:h-[2px] bg-zinc-100 mt-2" />
                        </div>

                        <div className={cn(
                            "grid gap-6 md:gap-12",
                            isTVMode ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        )}>
                            {group.items.map((item) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    onClick={() => setSelectedItem(item)}
                                    className={cn(
                                        "menu-item group transition-all duration-700 cursor-pointer relative",
                                        isTVMode
                                            ? "bg-zinc-900/50 border border-white/5 rounded-2xl md:rounded-[2.5rem] flex gap-4 md:gap-8 p-4 md:p-6 h-auto md:h-72 items-center"
                                            : "flex md:flex-col gap-4 md:gap-0"
                                    )}
                                >
                                    <div className={cn(
                                        "relative overflow-hidden shrink-0 transition-all duration-700",
                                        isTVMode
                                            ? "w-32 h-32 md:w-60 md:h-60 rounded-xl md:rounded-3xl border border-white/10"
                                            : "w-24 h-24 md:w-full md:h-auto md:aspect-video lg:aspect-square rounded-2xl md:rounded-[2rem] border md:border-2 border-zinc-50 group-hover:border-zinc-200 md:shadow-xl md:shadow-zinc-200/50 md:group-hover:shadow-zinc-300/50 md:group-hover:-translate-y-3 md:mb-6"
                                    )}>
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-50 flex items-center justify-center text-3xl md:text-5xl opacity-20">🍽️</div>
                                        )}
                                        {item.isFeatured && (
                                            <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10 px-2 md:px-4 py-1 rounded-full bg-black/60 backdrop-blur-md text-[7px] md:text-[9px] font-black tracking-widest text-white border border-white/10 flex items-center gap-1 md:gap-2">
                                                <Sparkles className="w-2 h-2 md:w-3 md:h-3 fill-primary text-primary" />
                                                SIGNATURE
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h3 className={cn("font-black tracking-tighter italic leading-tight mb-1 md:mb-2 transition-colors", isTVMode ? "text-xl md:text-4xl text-white underline decoration-primary decoration-2 md:decoration-4 underline-offset-4 md:underline-offset-8" : "text-base md:text-xl text-zinc-900 group-hover:text-primary")}>
                                            {item.name}
                                        </h3>
                                        <p className={cn("text-zinc-500 font-medium leading-relaxed antialiased", isTVMode ? "text-sm md:text-lg line-clamp-2" : "text-[10px] md:text-xs line-clamp-2")}>
                                            {item.description || "Crafted with passion using the finest seasonal ingredients."}
                                        </p>
                                        <div className={cn("font-black tracking-tighter mt-2 md:mt-4 flex items-center gap-1 md:gap-2", isTVMode ? "text-xl md:text-4xl" : "text-lg md:text-xl")}>
                                            <span className="text-[10px] md:text-sm opacity-30 mt-0.5 md:mt-1">$</span>
                                            {item.price.toFixed(2)}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                ))}
            </main>

            {/* Minimalist Premium Footer */}
            <footer className={cn(
                "py-12 md:py-16 px-4 md:px-6 border-t border-zinc-100 transition-opacity duration-1000",
                isTVMode ? "hidden" : "block"
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
