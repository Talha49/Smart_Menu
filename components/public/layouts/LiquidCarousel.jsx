"use client";

import { motion } from "framer-motion";
import { Sparkles, Plus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function LiquidCarousel({ groupedItems, setSelectedItem, isTVMode }) {
    return (
        <div className="space-y-20 pb-20">
            {groupedItems.map((group) => (
                <div key={group._id} id={`category-${group.name}`} className="scroll-mt-32">
                    {/* Category Header */}
                    <div className="px-4 mb-8">
                        <div className="flex items-baseline gap-4">
                            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-zinc-900">
                                {group.name}
                            </h2>
                            <span className="text-sm font-black text-primary uppercase tracking-[0.3em]">
                                {group.items.length} Options
                            </span>
                        </div>
                    </div>

                    {/* Horizontal Scroll Area */}
                    <div className="overflow-x-auto overflow-y-hidden no-scrollbar pb-8 -mx-4 px-4">
                        <div className="flex gap-6 md:gap-10 min-w-max">
                            {group.items.map((item) => (
                                <motion.div
                                    key={item._id}
                                    whileHover={{ y: -10 }}
                                    onClick={() => setSelectedItem(item)}
                                    className="w-[280px] md:w-[400px] group cursor-pointer"
                                >
                                    {/* Big visual card */}
                                    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-zinc-100 shadow-xl shadow-zinc-200/50 mb-6">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-50 flex items-center justify-center text-6xl opacity-20">🍽️</div>
                                        )}

                                        {/* Overlay Info */}
                                        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                            <div className="flex items-center gap-2 mb-2">
                                                {item.isFeatured && (
                                                    <div className="px-3 py-1 rounded-full bg-primary text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-1">
                                                        <Sparkles className="w-2 h-2 fill-white" /> Signature
                                                    </div>
                                                )}
                                                <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[8px] font-black text-white uppercase tracking-widest border border-white/20">
                                                    Fresh
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-black italic text-white tracking-tighter mb-1">
                                                {item.name}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <div className="text-xl font-black text-white italic">
                                                    <span className="text-xs opacity-50">$</span>
                                                    {item.price.toFixed(2)}
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                                    <Plus className="w-5 h-5 text-zinc-900" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Secondary Details */}
                                    <div className="px-2">
                                        <p className="text-sm text-zinc-500 font-medium line-clamp-2 leading-relaxed">
                                            {item.description || "An exquisite blend of premium ingredients and artisanal technique."}
                                        </p>
                                        <div className="flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all">
                                            View Details <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* "View More" placeholder for long categories */}
                            <div className="w-20 md:w-40 flex items-center justify-center pr-10">
                                <div className="w-px h-20 bg-gradient-to-b from-transparent via-zinc-200 to-transparent" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
