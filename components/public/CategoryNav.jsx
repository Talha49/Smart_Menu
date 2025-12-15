"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function CategoryNav({ categories, activeCategory, brandColor }) {
    const [active, setActive] = useState(activeCategory);
    const navRef = useRef(null);

    // Sync active state if prop changes (e.g. from scroll spy)
    useEffect(() => {
        setActive(activeCategory);
    }, [activeCategory]);

    const scrollToCategory = (catName) => {
        // 1. Set active immediately for UI feedback
        setActive(catName);

        // 2. Scroll to section
        const element = document.getElementById(`category-${catName}`);
        if (element) {
            // Offset for sticky header/nav height
            const headerOffset = 140;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b w-full overflow-hidden">
            <div
                ref={navRef}
                className="flex overflow-x-auto py-3 px-4 gap-2 scrollbar-hide snap-x"
                role="tablist"
            >
                {categories.map((cat) => (
                    <button
                        key={cat._id}
                        onClick={() => scrollToCategory(cat.name)}
                        data-state={active === cat.name ? "active" : "inactive"}
                        className={cn(
                            "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 snap-center border",
                            active === cat.name
                                ? "text-white border-transparent shadow-sm scale-105"
                                : "bg-secondary/50 text-muted-foreground border-transparent hover:bg-secondary hover:text-foreground"
                        )}
                        style={active === cat.name ? { backgroundColor: brandColor || "var(--primary)" } : {}}
                        role="tab"
                        aria-selected={active === cat.name}
                    >
                        <span className="text-lg">{cat.emoji || "🍽️"}</span>
                        {cat.name}
                    </button>
                ))}
            </div>
            {/* Gradient fade for overflow indication */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
        </div>
    );
}
