"use client";

import { motion } from "framer-motion";
import { Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function ClassicGrid({ isTVMode, groupedItems, setSelectedItem }) {
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
                        {group.items.map((item) => (
                            <motion.div
                                key={item._id}
                                layout
                                onClick={() => setSelectedItem(item)}
                                className={cn(
                                    "menu-item group transition-all duration-700 cursor-pointer relative",
                                    isTVMode
                                        ? "bg-zinc-900/50 border border-white/5 rounded-2xl md:rounded-[2.5rem] flex gap-4 md:gap-8 p-4 md:p-6 h-auto md:h-72 items-center"
                                        : "flex md:flex-col gap-4 md:gap-0"
                                )}
                            >
                                <div className={cn(
                                    "relative overflow-hidden shrink-0 transition-all duration-700",
                                    isTVMode
                                        ? "w-32 h-32 md:w-60 md:h-60 rounded-xl md:rounded-3xl border border-white/10"
                                        : "w-24 h-24 md:w-full md:h-auto md:aspect-video lg:aspect-square rounded-2xl md:rounded-[2rem] border md:border-2 border-zinc-50 group-hover:border-zinc-200 md:shadow-xl md:shadow-zinc-200/50 md:group-hover:shadow-zinc-300/50 md:group-hover:-translate-y-3 md:mb-6"
                                )}>
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-50 flex items-center justify-center text-3xl md:text-5xl opacity-20">🍽️</div>
                                    )}
                                    {item.isFeatured && (
                                        <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10 px-2 md:px-4 py-1 rounded-full bg-black/60 backdrop-blur-md text-[7px] md:text-[9px] font-black tracking-widest text-white border border-white/10 flex items-center gap-1 md:gap-2">
                                            <Sparkles className="w-2 h-2 md:w-3 md:h-3 fill-primary text-primary" />
                                            SIGNATURE
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <h3 className={cn("font-black tracking-tighter italic leading-tight mb-1 md:mb-2 transition-colors", isTVMode ? "text-xl md:text-4xl text-white underline decoration-primary decoration-2 md:decoration-4 underline-offset-4 md:underline-offset-8" : "text-base md:text-xl text-zinc-900 group-hover:text-primary")}>
                                        {item.name}
                                    </h3>
                                    <p className={cn("text-zinc-500 font-medium leading-relaxed antialiased", isTVMode ? "text-sm md:text-lg line-clamp-2" : "text-[10px] md:text-xs line-clamp-2")}>
                                        {item.description || "Crafted with passion using the finest seasonal ingredients."}
                                    </p>

                                    {/* Actions and Price Area */}
                                    <div className="flex items-center justify-between mt-3 md:mt-5">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("font-black tracking-tighter flex items-center gap-0.5 md:gap-1", isTVMode ? "text-xl md:text-4xl text-white" : "text-lg md:text-xl text-zinc-950")}>
                                                <span className="text-[10px] md:text-sm opacity-30 mt-0.5 md:mt-1">$</span>
                                                {(() => {
                                                    if (item.variants && item.variants.length > 0) {
                                                        const prices = item.variants.map(v => v.price);
                                                        const min = Math.min(...prices);
                                                        const max = Math.max(...prices);
                                                        return min === max ? min.toFixed(2) : `${min.toFixed(2)} - ${max.toFixed(2)}`;
                                                    }
                                                    return item.price.toFixed(2);
                                                })()}
                                            </div>

                                            {(item.variants?.length > 0 || item.modifiers?.length > 0) && !isTVMode && (
                                                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-zinc-100 text-[8px] font-bold text-zinc-500 uppercase tracking-tighter shrink-0">
                                                    <Plus className="w-2 h-2" />
                                                    Add-ons
                                                </div>
                                            )}
                                        </div>

                                        {/* Subtle Hover Action */}
                                        {(item.variants?.length > 0 || item.modifiers?.length > 0) && !isTVMode && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 10 }}
                                                whileHover={{ opacity: 1, x: 0 }}
                                                className="hidden lg:flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                Customize <Plus className="w-3 h-3" />
                                            </motion.div>
                                        )}
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
