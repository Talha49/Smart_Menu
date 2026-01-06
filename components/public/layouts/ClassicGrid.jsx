"use client";

import { motion } from "framer-motion";
import { Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const MOTION_MAPPING = {
    "liquid-spring": [0.21, 1.11, 0.81, 0.99],
    "haptic-snap": [0.19, 1, 0.22, 1],
    "airy-float": [0.45, 0, 0.55, 1],
    "minimal": [0.4, 0, 0.2, 1]
};

export function ClassicGrid({ isTVMode, groupedItems, setSelectedItem, vibeTokens }) {
    const dna = vibeTokens?.dna || { radius: "24px", glass: 20, motion: "liquid-spring" };
    const palette = vibeTokens?.palette || { primary: "#4f46e5", accent: "#f43f5e" };
    const motionEase = MOTION_MAPPING[dna.motion] || MOTION_MAPPING["liquid-spring"];

    return (
        <div className="space-y-12 md:space-y-24">
            {groupedItems.map((group) => (
                <div key={group._id} id={`category-${group.name}`} className="scroll-mt-32">
                    <div className="flex items-center gap-4 mb-8 md:mb-16">
                        <h2 className={cn(
                            "font-black tracking-tighter uppercase italic",
                            isTVMode ? "text-4xl md:text-8xl text-white" : "text-3xl md:text-5xl text-zinc-900"
                        )}>
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
                                onClick={() => setSelectedItem(item)}
                                className={cn(
                                    "menu-item group transition-all duration-700 cursor-pointer relative",
                                    isTVMode
                                        ? "bg-zinc-900/50 border border-white/5 flex gap-4 md:gap-8 p-4 md:p-6 h-auto md:h-72 items-center"
                                        : "flex md:flex-col gap-4 md:gap-0"
                                )}
                                style={{
                                    borderRadius: dna.radius,
                                    backgroundColor: !isTVMode && dna.glass > 0 ? `rgba(255, 255, 255, ${Math.max(0.1, dna.glass / 150)})` : undefined,
                                    backdropFilter: !isTVMode && dna.glass > 0 ? `blur(${dna.glass / 4}px)` : undefined,
                                    border: !isTVMode && dna.glass > 0 ? `1px solid rgba(255, 255, 255, ${dna.glass / 200})` : "1px solid rgba(0,0,0,0.05)",
                                    boxShadow: !isTVMode && dna.glass > 0 ? `0 8px 32px 0 rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255,255,255,${dna.glass / 300})` : undefined
                                }}
                            >
                                <div className={cn(
                                    "relative overflow-hidden shrink-0 transition-all duration-1000",
                                    isTVMode
                                        ? "w-32 h-32 md:w-60 md:h-60 border border-white/10"
                                        : "w-24 h-24 md:w-full md:h-auto md:aspect-[4/5] border-2 border-zinc-50 group-hover:border-primary/20 bg-zinc-50 md:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] md:group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] md:group-hover:-translate-y-4 md:mb-6"
                                )}
                                    style={{ borderRadius: dna.radius }}
                                >
                                    {item.imageUrl ? (
                                        <motion.img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 1.5, ease: "circOut" }}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-50 flex items-center justify-center text-3xl md:text-5xl opacity-20 font-serif italic text-zinc-400">SM</div>
                                    )}

                                    {/* Glass Shine Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out pointer-events-none" />

                                    {item.isFeatured && (
                                        <div
                                            className="absolute top-2 right-2 md:top-6 md:right-6 z-10 px-2 md:px-5 py-1.5 rounded-full shadow-xl text-[7px] md:text-[10px] font-black tracking-widest text-white flex items-center gap-1 md:gap-2"
                                            style={{ backgroundColor: palette.primary, boxShadow: `0 10px 20px -5px ${palette.primary}66` }}
                                        >
                                            <Sparkles className="w-2 h-2 md:w-4 md:h-4 fill-white" />
                                            SIGNATURE
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <h3
                                        className={cn("font-black tracking-tighter italic leading-tight mb-2 md:mb-3 transition-colors", isTVMode ? "text-xl md:text-5xl text-white underline decoration-primary/50 decoration-2 md:decoration-4 underline-offset-8" : "text-base md:text-2xl text-zinc-900")}
                                        style={{ color: !isTVMode ? palette.primary : undefined }}
                                    >
                                        {item.name}
                                    </h3>
                                    <p className={cn("text-zinc-500 font-medium leading-relaxed antialiased", isTVMode ? "text-sm md:text-xl line-clamp-3" : "text-[10px] md:text-xs line-clamp-2 md:mb-4 pr-4")}>
                                        {item.description || "Crafted with passion using the finest seasonal ingredients and artisanal techniques."}
                                    </p>

                                    {/* Actions and Price Area */}
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("font-black tracking-tighter flex items-center gap-0.5 md:gap-1.5", isTVMode ? "text-xl md:text-5xl text-white" : "text-lg md:text-2xl text-zinc-950")}>
                                                <span className="text-[10px] md:text-sm opacity-30 mt-1">$</span>
                                                {item.price.toFixed(2)}
                                            </div>

                                            {(item.variants?.length > 0) && !isTVMode && (
                                                <div className="px-2 py-0.5 rounded-lg bg-zinc-100 text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                                                    +{item.variants.length} Options
                                                </div>
                                            )}
                                        </div>

                                        <motion.div
                                            whileTap={{ scale: 0.9 }}
                                            whileHover={{ scale: 1.1, backgroundColor: palette.accent }}
                                            className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg"
                                            style={{
                                                backgroundColor: palette.accent,
                                                color: 'white',
                                                boxShadow: `0 10px 20px -5px ${palette.accent}44`
                                            }}
                                        >
                                            <Plus className="w-4 h-4 md:w-6 md:h-6" />
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
