"use client";

import { motion } from "framer-motion";
import { Sparkles, Plus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const MOTION_MAPPING = {
    "liquid-spring": [0.21, 1.11, 0.81, 0.99],
    "haptic-snap": [0.19, 1, 0.22, 1],
    "airy-float": [0.45, 0, 0.55, 1],
    "minimal": [0.4, 0, 0.2, 1]
};

export function LiquidCarousel({ groupedItems, setSelectedItem, isTVMode, vibeTokens }) {
    const dna = vibeTokens?.dna || { radius: "40px", glass: 20, motion: "liquid-spring" };
    const palette = vibeTokens?.palette || { primary: "#4f46e5", accent: "#f43f5e" };
    const motionEase = MOTION_MAPPING[dna.motion] || MOTION_MAPPING["liquid-spring"];

    return (
        <div className="space-y-20 pb-20">
            {groupedItems.map((group) => (
                <div key={group._id} id={`category-${group.name}`} className="scroll-mt-32">
                    <div className="px-4 mb-8">
                        <div className="flex items-baseline gap-4">
                            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-zinc-900">
                                {group.name}
                            </h2>
                            <span className="text-sm font-black uppercase tracking-[0.3em]" style={{ color: palette.primary }}>
                                {group.items.length} Options
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar pb-8 -mx-4 px-4 scroll-smooth">
                        <div className="flex gap-6 md:gap-10 min-w-max px-4">
                            {group.items.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "0px 100px 0px 100px" }}
                                    transition={{ duration: 1, ease: motionEase, delay: index * 0.05 }}
                                    whileHover={{ y: -10 }}
                                    onClick={() => setSelectedItem(item)}
                                    className="w-[280px] md:w-[400px] group cursor-pointer snap-center relative"
                                >
                                    <div
                                        className="relative aspect-[4/5] overflow-hidden border border-zinc-100 shadow-xl shadow-zinc-200/50 mb-6 bg-zinc-50"
                                        style={{
                                            borderRadius: dna.radius,
                                            backgroundColor: dna.glass > 0 ? `rgba(255, 255, 255, ${Math.max(0.1, dna.glass / 120)})` : "white",
                                            backdropFilter: dna.glass > 0 ? `blur(${dna.glass / 4}px)` : undefined,
                                        }}
                                    >
                                        {item.imageUrl ? (
                                            <motion.img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                whileHover={{ scale: 1.15 }}
                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-50 flex items-center justify-center text-6xl opacity-20 font-serif italic text-zinc-400">SM</div>
                                        )}

                                        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                            <div className="flex items-center gap-2 mb-2">
                                                {item.isFeatured && (
                                                    <div
                                                        className="px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-1 shadow-lg"
                                                        style={{ backgroundColor: palette.primary, boxShadow: `0 10px 20px -5px ${palette.primary}66` }}
                                                    >
                                                        <Sparkles className="w-2 h-2 fill-white" /> Signature
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="text-2xl font-black italic text-white tracking-tighter mb-1">
                                                {item.name}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <div className="text-xl font-black text-white italic">
                                                    <span className="text-xs opacity-50">$</span>
                                                    {item.price.toFixed(2)}
                                                </div>
                                                <motion.div
                                                    whileTap={{ scale: 0.9 }}
                                                    whileHover={{ scale: 1.2, rotate: 90, backgroundColor: palette.accent }}
                                                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
                                                    style={{ backgroundColor: palette.accent, color: 'white' }}
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-2">
                                        <p className="text-sm text-zinc-500 font-medium line-clamp-2 leading-relaxed">
                                            {item.description || "An exquisite blend of premium ingredients and artisanal technique."}
                                        </p>
                                        <div className="flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all font-mono" style={{ color: palette.primary }}>
                                            View Details <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            <div className="w-20 md:w-40 flex items-center justify-center pr-10">
                                <div className="w-px h-20 bg-gradient-to-b from-transparent via-zinc-200 to-transparent opacity-50" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
