"use client";

/**
 * Perspective Deck Layout
 * 
 * A 3D stacked card experience. Items are rendered as a deck that you
 * swipe through. Highly interactive and tactile.
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { MenuItem } from "../MenuItem";
import { cn } from "@/lib/utils";

export function PerspectiveDeck({ groupedItems, setSelectedItem, theme }) {
    const [activeGroupIndex, setActiveGroupIndex] = useState(0);
    const currentGroup = groupedItems[activeGroupIndex];
    const [cardIndex, setCardIndex] = useState(0);

    const nextCard = () => {
        if (cardIndex < currentGroup.items.length - 1) {
            setCardIndex(prev => prev + 1);
        } else if (activeGroupIndex < groupedItems.length - 1) {
            setActiveGroupIndex(prev => prev + 1);
            setCardIndex(0);
        }
    };

    const prevCard = () => {
        if (cardIndex > 0) {
            setCardIndex(prev => prev - 1);
        } else if (activeGroupIndex > 0) {
            setActiveGroupIndex(prev => prev - 1);
            setCardIndex(groupedItems[activeGroupIndex - 1].items.length - 1);
        }
    };

    return (
        <div className="relative min-h-[85vh] flex flex-col items-center justify-center py-10 px-4 overflow-hidden">
            {/* Category Breadcrumb */}
            <div className="absolute top-0 inset-x-0 flex flex-col items-center gap-2 pt-4 z-20">
                <div className="flex items-center gap-3 px-6 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl">
                    <span className="text-xl">{currentGroup?.emoji}</span>
                    <span 
                        className="uppercase tracking-[0.4em] text-zinc-900"
                        style={{ fontSize: '10px', fontWeight: 'var(--font-heading-weight)', fontFamily: 'var(--font-heading)' }}
                    >
                        {currentGroup?.name}
                    </span>
                </div>
                <div className="flex gap-1">
                    {groupedItems.map((_, i) => (
                        <div key={i} className={cn("h-1 rounded-full transition-all duration-500", i === activeGroupIndex ? "w-8 bg-zinc-900" : "w-2 bg-zinc-200")} />
                    ))}
                </div>
            </div>

            {/* 3D Deck Container */}
            <div className="relative w-full max-w-[400px] aspect-[3/4] perspective-[1500px]">
                <AnimatePresence mode="popLayout">
                    {currentGroup?.items.map((item, idx) => {
                        const isVisible = idx >= cardIndex && idx <= cardIndex + 3;
                        if (!isVisible) return null;

                        const relativeIdx = idx - cardIndex;

                        return (
                            <motion.div
                                key={item._id}
                                initial={{ scale: 0.8, opacity: 0, z: -500 }}
                                animate={{
                                    scale: 1 - relativeIdx * 0.08,
                                    opacity: 1 - relativeIdx * 0.25,
                                    z: -relativeIdx * 100,
                                    y: -relativeIdx * 20,
                                    rotateX: -relativeIdx * 5,
                                }}
                                exit={{
                                    x: -500,
                                    rotateZ: -20,
                                    opacity: 0,
                                    transition: { duration: 0.5, ease: "circIn" }
                                }}
                                className="absolute inset-0 z-10"
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                <div 
                                    className="h-full w-full bg-white rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] border-2 border-zinc-50 p-6 flex flex-col group overflow-hidden"
                                    style={{
                                        borderRadius: `var(--theme-radius, 3rem)`,
                                        boxShadow: `var(--theme-shadow, 0_30px_60px_rgba(0,0,0,0.12))`,
                                        backdropFilter: `blur(var(--theme-glass-blur, 0px))`,
                                        opacity: `var(--theme-glass-opacity, 1)`
                                    }}
                                >
                                    {/* Large Immersive Image */}
                                    <div className="relative flex-1 rounded-[2rem] overflow-hidden mb-6">
                                        <img 
                                            src={item.imageUrl} 
                                            alt={item.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                                        />
                                        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-2xl font-black text-sm italic">
                                            ${item.price}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <h3 
                                                className="text-3xl font-black italic tracking-tighter leading-none uppercase"
                                                style={{ fontSize: 'var(--text-item-name)', fontFamily: 'var(--font-heading)' }}
                                            >
                                                {item.name}
                                            </h3>
                                            <p 
                                                className="text-xs text-zinc-400 font-bold leading-relaxed line-clamp-2"
                                                style={{ fontSize: 'var(--text-item-desc)', fontFamily: 'var(--font-body)' }}
                                            >
                                                {item.description}
                                            </p>
                                        </div>
                                        
                                        <button 
                                            onClick={() => setSelectedItem(item)}
                                            className="w-full py-4 bg-zinc-950 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-colors"
                                        >
                                            View Creation
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="mt-16 flex items-center gap-12 relative z-30">
                <button 
                    onClick={prevCard}
                    className="w-16 h-16 rounded-full bg-white border-2 border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-950 hover:border-zinc-900 transition-all active:scale-90"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black tracking-[0.5em] text-zinc-300 uppercase">Step</span>
                    <span className="text-3xl font-black italic">{cardIndex + 1}<span className="text-zinc-300 text-sm"> / {currentGroup?.items.length}</span></span>
                </div>

                <button 
                    onClick={nextCard}
                    className="w-16 h-16 rounded-full bg-zinc-950 flex items-center justify-center text-white hover:bg-zinc-800 transition-all active:scale-90 shadow-xl"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none -z-10 opacity-20 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border-[40px] border-zinc-100 rounded-full animate-[spin_60s_linear_infinite]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-[2px] border-zinc-200 border-dashed rounded-full animate-[spin_40s_linear_infinite_reverse]" />
            </div>
        </div>
    );
}
