"use client";

import { useEffect, useState } from "react";
import { X, ChevronLeft, Sparkles, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function MenuItemDetail({ item, isOpen, onClose }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!item) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ y: "100%", opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: "100%", opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                        className="relative w-full max-w-2xl h-[90vh] md:h-auto md:max-h-[85vh] bg-zinc-950 text-white md:rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden flex flex-col md:flex-row m-0 md:m-4"
                    >
                        {/* Close button - Top right for desktop, Top left for mobile as back */}
                        <div className="absolute top-6 right-6 z-20 hidden md:block">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full bg-white/5 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md"
                                onClick={onClose}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="absolute top-6 left-6 z-20 md:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/10 backdrop-blur-md"
                                onClick={onClose}
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </Button>
                        </div>

                        {/* Image Section */}
                        <div className="w-full md:w-1/2 h-[45%] md:h-auto bg-zinc-900 relative group">
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-7xl opacity-20">🍽️</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

                            {item.isFeatured && (
                                <div className="absolute bottom-6 left-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black tracking-[0.2em] text-white flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5 fill-primary text-primary" />
                                    OUR SIGNATURE
                                </div>
                            )}
                        </div>

                        {/* Text Section */}
                        <div className="flex-1 p-8 md:p-12 flex flex-col bg-zinc-950 overflow-y-auto">
                            <div className="flex-1">
                                <div className="flex flex-col gap-2 mb-6 md:mb-8">
                                    <span className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">{item.category}</span>
                                    <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter leading-tight md:leading-none">{item.name}</h2>
                                </div>

                                <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-medium mb-8 md:mb-12 antialiased">
                                    {item.description || "A masterfully crafted selection from our kitchen, prepared with only the finest ingredients and a passion for flavor."}
                                </p>

                                <div className="space-y-4 mb-8 md:mb-0">
                                    <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-zinc-500 uppercase">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                        In Stock & Ready
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 md:pt-10 border-t border-white/5 flex flex-wrap items-end justify-between gap-6 mt-6 md:mt-10">
                                <div className="flex flex-col min-w-[120px]">
                                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Price Value</span>
                                    <div className="text-3xl md:text-5xl font-black tracking-tighter text-white whitespace-nowrap">
                                        <span className="text-base md:text-xl align-top mr-0.5">$</span>
                                        {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                                <Button
                                    className="h-12 md:h-14 px-8 md:px-10 rounded-xl md:rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/5 flex-grow md:flex-grow-0"
                                    onClick={onClose}
                                >
                                    Dismiss
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
