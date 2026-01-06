"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function CategoryNav({ categories, activeCategory, brandColor }) {
    const [active, setActive] = useState(activeCategory);
    const navRef = useRef(null);

    useEffect(() => {
        setActive(activeCategory);
    }, [activeCategory]);

    const scrollToCategory = (catName) => {
        setActive(catName);
        const element = document.getElementById(`category-${catName}`);
        if (element) {
            // Responsive offset based on screen width
            const isMobile = window.innerWidth < 768;
            const headerOffset = isMobile ? 140 : 180;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="sticky top-[72px] md:top-[80px] z-40 w-full transition-all duration-700">
            {/* Glossy Backdrop */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-3xl border-b border-zinc-100/50 shadow-sm shadow-zinc-950/5" />

            <div
                ref={navRef}
                className="relative flex overflow-x-auto py-5 px-6 gap-4 scrollbar-hide snap-x max-w-7xl mx-auto items-center"
                role="tablist"
            >
                {categories.map((cat) => (
                    <motion.button
                        key={cat._id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => scrollToCategory(cat.name)}
                        className={cn(
                            "group flex items-center gap-3 px-6 py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 snap-center border-2",
                            active === cat.name
                                ? "text-white border-transparent"
                                : "bg-white/50 text-zinc-400 border-zinc-50 hover:border-zinc-200 hover:text-zinc-900 shadow-sm"
                        )}
                        style={active === cat.name ? {
                            backgroundColor: brandColor || "black",
                            boxShadow: `0 15px 35px -10px ${brandColor ? brandColor + '60' : 'rgba(0,0,0,0.1)'}`
                        } : {}}
                    >
                        <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform duration-500 transform">{cat.emoji || "🍽️"}</span>
                        <span>{cat.name}</span>
                        {active === cat.name && (
                            <motion.div
                                layoutId="navIndicator"
                                className="w-1 h-1 rounded-full bg-white ml-1"
                            />
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Elegant glass edge fades */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white/80 via-white/40 to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white/80 via-white/40 to-transparent pointer-events-none z-10" />
        </div>
    );
}
