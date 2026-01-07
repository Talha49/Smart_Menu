"use client";

import { MenuItem } from "../MenuItem";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MOTION_MAPPING = {
    "liquid-spring": [0.21, 1.11, 0.81, 0.99],
    "haptic-snap": [0.19, 1, 0.22, 1],
    "airy-float": [0.45, 0, 0.55, 1],
    "minimal": [0.4, 0, 0.2, 1]
};

export function ClassicGrid({ isTVMode, groupedItems, setSelectedItem }) {
    const theme = useTheme();
    const dna = theme.config?.animations?.itemEntrance || { motion: "liquid-spring" };
    const motionEase = MOTION_MAPPING[dna.motion] || MOTION_MAPPING["liquid-spring"];

    return (
        <div className="space-y-12 md:space-y-24">
            {groupedItems.map((group) => (
                <div key={group._id} id={`category-${group.name}`} className="scroll-mt-32">
                    <div className="flex items-center gap-4 mb-8 md:mb-16">
                        <h2 className={cn(
                            "font-black tracking-tighter uppercase italic",
                            isTVMode ? "text-4xl md:text-8xl text-white" : "text-3xl md:text-5xl text-zinc-900"
                        )}
                            style={{ color: !isTVMode ? theme.config?.colors?.text?.primary : undefined }}
                        >
                            {group.name}
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-zinc-200 to-transparent" />
                    </div>

                    <div className={cn(
                        "grid gap-6 md:gap-12",
                        isTVMode ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    )}>
                        {group.items.map((item, index) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.05,
                                    ease: motionEase
                                }}
                                className="menu-item"
                            >
                                <MenuItem
                                    item={item}
                                    theme={theme.config}
                                    onClick={() => setSelectedItem(item)}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
