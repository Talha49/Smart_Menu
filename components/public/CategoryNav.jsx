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
        <div className="sticky top-[72px] md:top-[80px] z-40 bg-white/80 backdrop-blur-3xl border-b w-full overflow-hidden transition-all duration-500">
            <div
                ref={navRef}
                className="flex overflow-x-auto py-4 px-6 gap-3 scrollbar-hide snap-x max-w-7xl mx-auto"
                role="tablist"
            >
                {categories.map((cat) => (
                    <motion.button
                        key={cat._id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => scrollToCategory(cat.name)}
                        className={cn(
                            "group flex items-center gap-2.5 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 snap-center border-2",
                            active === cat.name
                                ? "text-white border-transparent shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)]"
                                : "bg-zinc-50 text-zinc-400 border-zinc-100 hover:border-zinc-200 hover:text-zinc-900"
                        )}
                        style={active === cat.name ? {
                            backgroundColor: brandColor || "black",
                            boxShadow: `0 10px 25px -5px ${brandColor ? brandColor + '40' : 'rgba(0,0,0,0.1)'}`
                        } : {}}
                    >
                        <span className="text-xl group-hover:scale-125 transition-transform duration-500">{cat.emoji || "🍽️"}</span>
                        {cat.name}
                    </motion.button>
                ))}
            </div>
            {/* Elegant glass indicator */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
    );
}
