"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function OrbitalWheel({ groupedItems, setSelectedItem, isTVMode }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [rotation, setRotation] = useState(0);
    const wheelRef = useRef(null);

    const activeGroup = groupedItems[activeIndex];
    const categoryCount = groupedItems.length;
    const angleStep = 360 / categoryCount;

    const handleCategoryClick = (index) => {
        const diff = index - activeIndex;
        // Simple shortest path rotation logic
        setRotation(prev => prev - (diff * angleStep));
        setActiveIndex(index);
    };

    return (
        <div className="flex flex-col items-center min-h-[80vh] pt-0 pb-8 overflow-hidden">
            {/* 1. The Orbital Navigation */}
            <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] mb-2 shrink-0">
                {/* Center Core */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-white shadow-2xl shadow-primary/20 border-4 border-zinc-50 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                        <motion.div
                            key={activeGroup?.name}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center"
                        >
                            <span className="text-3xl md:text-5xl mb-2">{activeGroup?.emoji}</span>
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-900 leading-tight">
                                {activeGroup?.name}
                            </span>
                        </motion.div>
                    </div>
                </div>

                {/* Rotating Ring */}
                <motion.div
                    animate={{ rotate: rotation }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
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
                                        x: Math.cos((angle * Math.PI) / 180) * 110 - 24, // 110px radius, centered (-24px half icon)
                                        y: Math.sin((angle * Math.PI) / 180) * 110 - 24,
                                    }}
                                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                                    className="absolute"
                                >
                                    <button
                                        onClick={() => handleCategoryClick(i)}
                                        className={cn(
                                            "w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500",
                                            activeIndex === i
                                                ? "bg-primary text-white scale-125 shadow-lg shadow-primary/40 ring-4 ring-primary/20"
                                                : "bg-white text-zinc-400 border border-zinc-100 shadow-sm hover:scale-110"
                                        )}
                                    >
                                        <span className="text-xl md:text-2xl">{group.emoji}</span>
                                    </button>
                                </motion.div>
                            </div>
                        );
                    })}
                </motion.div>

                {/* Decorative Orbit Rings */}
                <div className="absolute inset-0 rounded-full border border-dashed border-zinc-200 z-0 animate-[spin_60s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-zinc-100 z-0" />
            </div>

            {/* 2. Items Display for Active Category */}
            <div className="w-full max-w-2xl px-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-black italic tracking-tighter uppercase text-zinc-900">
                                {activeGroup?.name} <span className="text-zinc-300 ml-2">({activeGroup?.items.length})</span>
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleCategoryClick((activeIndex - 1 + categoryCount) % categoryCount)}
                                    className="p-2 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-400 hover:text-zinc-950"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleCategoryClick((activeIndex + 1) % categoryCount)}
                                    className="p-2 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-400 hover:text-zinc-950"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {activeGroup?.items.map((item) => (
                            <motion.div
                                key={item._id}
                                onClick={() => setSelectedItem(item)}
                                whileTap={{ scale: 0.98 }}
                                className="group bg-white border border-zinc-100 rounded-[1.5rem] p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-zinc-50">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-50 flex items-center justify-center text-2xl opacity-20">🍽️</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-black italic text-zinc-900 truncate leading-tight group-hover:text-primary transition-colors">
                                            {item.name}
                                        </h3>
                                        {item.isFeatured && <Sparkles className="w-3 h-3 fill-primary text-primary shrink-0" />}
                                    </div>
                                    <p className="text-[10px] text-zinc-500 font-medium line-clamp-1 mb-2">
                                        {item.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="font-black italic text-sm text-zinc-950">
                                            <span className="text-[10px] opacity-30">$</span>
                                            {item.price.toFixed(2)}
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                                            <Plus className="w-3 h-3 text-zinc-400" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
