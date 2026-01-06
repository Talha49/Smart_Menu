"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const MOTION_MAPPING = {
    "liquid-spring": { type: "spring", damping: 15, stiffness: 100 },
    "haptic-snap": { type: "spring", damping: 25, stiffness: 300 },
    "airy-float": { type: "tween", ease: "easeInOut", duration: 0.8 },
    "minimal": { type: "tween", ease: "linear", duration: 0.4 }
};

export function OrbitalWheel({ groupedItems, setSelectedItem, isTVMode, vibeTokens }) {
    const dna = vibeTokens?.dna || { radius: "24px", glass: 20, motion: "liquid-spring" };
    const palette = vibeTokens?.palette || { primary: "#4f46e5", accent: "#f43f5e" };
    const motionConfig = MOTION_MAPPING[dna.motion] || MOTION_MAPPING["liquid-spring"];

    const [activeIndex, setActiveIndex] = useState(0);
    const [rotation, setRotation] = useState(0);
    const wheelRef = useRef(null);

    const activeGroup = groupedItems[activeIndex];
    const categoryCount = groupedItems.length;
    const angleStep = 360 / categoryCount;

    const handleCategoryClick = (index) => {
        const diff = index - activeIndex;
        setRotation(prev => prev - (diff * angleStep));
        setActiveIndex(index);
    };

    return (
        <div className="flex flex-col items-center min-h-[80vh] pt-0 pb-20 overflow-hidden">
            <div className="relative w-80 h-80 md:w-[500px] md:h-[500px] mb-8 shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [0.95, 1.05, 0.95],
                            rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-48 h-48 md:w-64 md:h-64 rounded-full blur-3xl opacity-40"
                        style={{ backgroundColor: `${palette.primary}33` }}
                    />

                    <div
                        className="relative w-32 h-32 md:w-56 md:h-56 rounded-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center p-6 text-center overflow-hidden pointer-events-auto transition-all"
                        style={{
                            borderRadius: "50%",
                            backgroundColor: dna.glass > 0 ? `rgba(255, 255, 255, ${Math.max(0.2, dna.glass / 120)})` : "white",
                            backdropFilter: dna.glass > 0 ? `blur(${dna.glass / 4}px)` : undefined,
                            border: `1px solid rgba(0,0,0,0.05)`
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeGroup?.name}
                                initial={{ y: 20, opacity: 0, scale: 0.8 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: -20, opacity: 0, scale: 0.8 }}
                                transition={motionConfig}
                                className="flex flex-col items-center"
                            >
                                <span className="text-4xl md:text-7xl mb-3 drop-shadow-lg">{activeGroup?.emoji}</span>
                                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-zinc-900 leading-tight">
                                    {activeGroup?.name}
                                </span>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <motion.div
                    animate={{ rotate: rotation }}
                    transition={motionConfig}
                    style={{ width: "100%", height: "100%" }}
                    className="relative z-20"
                >
                    {groupedItems.map((group, i) => {
                        const angle = i * angleStep;
                        return (
                            <div
                                key={group._id}
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transformOrigin: "0 0",
                                }}
                            >
                                <motion.div
                                    animate={{
                                        rotate: -rotation,
                                        x: Math.cos((angle * Math.PI) / 180) * (window.innerWidth < 768 ? 120 : 180) - 24,
                                        y: Math.sin((angle * Math.PI) / 180) * (window.innerWidth < 768 ? 120 : 180) - 24,
                                    }}
                                    transition={motionConfig}
                                    className="absolute"
                                >
                                    <motion.button
                                        onClick={() => handleCategoryClick(i)}
                                        whileHover={{ scale: 1.25 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={cn(
                                            "w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-700 relative group",
                                            activeIndex === i
                                                ? "text-white scale-110 shadow-2xl"
                                                : "bg-white text-zinc-400 border border-zinc-100 shadow-sm hover:shadow-xl hover:border-zinc-200"
                                        )}
                                        style={{
                                            backgroundColor: activeIndex === i ? palette.primary : undefined,
                                            boxShadow: activeIndex === i ? `0 20px 50px ${palette.primary}4D` : undefined,
                                        }}
                                    >
                                        <span className="text-xl md:text-3xl relative z-10">{group.emoji}</span>
                                        {activeIndex === i && (
                                            <motion.div
                                                layoutId="activeGlow"
                                                className="absolute inset-0 rounded-full blur-xl scale-150"
                                                style={{ backgroundColor: `${palette.primary}33` }}
                                            />
                                        )}
                                    </motion.button>
                                </motion.div>
                            </div>
                        );
                    })}
                </motion.div>

                <div className="absolute inset-0 rounded-full border border-dashed border-zinc-200 z-0 animate-[spin_100s_linear_infinite] opacity-50" />
            </div>

            <div className="w-full max-w-2xl px-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={motionConfig}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex flex-col">
                                <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase text-zinc-900 leading-none">
                                    {activeGroup?.name}
                                </h2>
                                <span className="text-[10px] font-black tracking-[0.3em] mt-2 uppercase" style={{ color: palette.primary }}>
                                    {activeGroup?.items.length} Signature Creations
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {activeGroup?.items.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ ...motionConfig, delay: index * 0.05 }}
                                    onClick={() => setSelectedItem(item)}
                                    className="group transition-all cursor-pointer relative p-5 flex gap-6 items-center"
                                    style={{
                                        borderRadius: dna.radius,
                                        backgroundColor: dna.glass > 0 ? `rgba(255, 255, 255, ${Math.max(0.2, dna.glass / 150)})` : "white",
                                        backdropFilter: dna.glass > 0 ? `blur(${dna.glass / 4}px)` : undefined,
                                        border: dna.glass > 0 ? `1px solid rgba(255, 255, 255, ${dna.glass / 200})` : "1px solid rgba(0,0,0,0.05)",
                                        boxShadow: dna.glass > 0 ? `0 8px 32px 0 rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255,255,255,${dna.glass / 300})` : "0 4px 12px -2px rgba(0,0,0,0.05)"
                                    }}
                                >
                                    <div className="w-24 h-24 overflow-hidden shrink-0 border border-zinc-50 relative" style={{ borderRadius: dna.radius }}>
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-50 flex items-center justify-center text-3xl opacity-20 font-serif italic text-zinc-400">SM</div>
                                        )}
                                        {item.isFeatured && (
                                            <div className="absolute top-2 right-2 p-1.5 rounded-full shadow-lg scale-75" style={{ backgroundColor: palette.primary }}>
                                                <Sparkles className="w-3 h-3 text-white fill-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-black italic truncate tracking-tight mb-1 transition-colors" style={{ color: palette.primary }}>
                                            {item.name}
                                        </h3>
                                        <p className="text-xs text-zinc-500 font-medium line-clamp-1 mb-3">
                                            {item.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="font-black italic text-lg text-zinc-950 flex items-center gap-0.5">
                                                <span className="text-xs opacity-30 mt-1">$</span>
                                                {item.price.toFixed(2)}
                                            </div>
                                            <motion.div
                                                whileHover={{ scale: 1.1, backgroundColor: palette.accent }}
                                                className="px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                                                style={{
                                                    backgroundColor: palette.accent,
                                                    color: 'white',
                                                    boxShadow: `0 10px 20px -5px ${palette.accent}44`
                                                }}
                                            >
                                                Details
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
