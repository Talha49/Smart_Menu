"use client";

import { useEffect, useState } from "react";
import { X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function MenuItemDetail({ item, isOpen, onClose }) {
    const [isClosing, setIsClosing] = useState(false);

    // Handle closing animation
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 200);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!isOpen && !isClosing) return null;

    return (
        <div className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 transition-opacity duration-200",
            isClosing ? "opacity-0" : "opacity-100" // fade out on close
        )}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal - Full screen on mobile, card on desktop */}
            <div className={cn(
                "relative w-full h-full md:h-auto md:max-w-lg bg-background md:rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-transform duration-300",
                isOpen && !isClosing ? "translate-y-0 scale-100" : "translate-y-full md:translate-y-10 md:scale-95"
            )}>

                {/* Close Button or Back header */}
                <div className="absolute top-4 left-4 z-10">
                    <Button variant="secondary" size="icon" className="rounded-full shadow-md bg-white/90 text-black hover:bg-white" onClick={handleClose}>
                        <ChevronLeft className="w-5 h-5 md:hidden" />
                        <X className="w-5 h-5 hidden md:block" />
                    </Button>
                </div>

                {/* Image Area */}
                <div className="w-full h-72 md:h-64 bg-muted relative shrink-0">
                    {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
                            <span className="text-4xl opacity-20">🍽️</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60 md:hidden" />
                </div>

                {/* Content Area */}
                <div className="p-6 md:p-8 flex-1 overflow-y-auto -mt-6 md:mt-0 relative bg-background rounded-t-3xl md:rounded-none">
                    <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6 md:hidden opacity-50" />

                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-2xl font-bold leading-tight">{item.name}</h2>
                        <span className="text-xl font-bold text-primary whitespace-nowrap">${item.price.toFixed(2)}</span>
                    </div>

                    <p className="text-muted-foreground leading-relaxed text-base mb-6">
                        {item.description}
                    </p>

                    {/* Future: Add-ons / Dietary tags could go here */}
                    <div className="space-y-4">
                        {item.isAvailable ? (
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Available
                            </div>
                        ) : (
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Sold Out
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions (if ordering is enabled later) */}
                <div className="p-4 border-t bg-background sticky bottom-0 md:static">
                    {/* Not functional yet for View Only mode */}
                </div>

            </div>
        </div>
    );
}
