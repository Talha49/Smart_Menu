"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Menu,
    UtensilsCrossed,
    Settings,
    LogOut,
    ExternalLink,
    X,
    Tv
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { useRestaurantStore } from "@/hooks/use-restaurant-store";

const sidebarLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Menu Management", href: "/dashboard/menu", icon: UtensilsCrossed },
    { name: "Branding", href: "/dashboard/branding", icon: Settings },
];

export function Sidebar({ className, onClose, isMobile }) {
    const pathname = usePathname();
    const { restaurant } = useRestaurantStore();
    const liveMenuUrl = restaurant?.restaurantId ? `/menu/${restaurant.restaurantId}` : "/";
    const tvMenuUrl = restaurant?.restaurantId ? `/tv/${restaurant.restaurantId}` : "/";

    return (
        <aside className={cn("flex h-full flex-col bg-card border-r", className)}>
            {/* Header / Logo */}
            <div className="flex h-16 items-center px-6 border-b">
                <Link href="/dashboard" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight">
                    <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        SmartMenu
                    </span>
                </Link>
                {isMobile && (
                    <Button variant="ghost" size="icon" className="ml-auto md:hidden" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="grid gap-1 px-3">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={isMobile ? onClose : undefined}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                    isActive ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary" : "text-muted-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer */}
            <div className="border-t p-4 space-y-2">
                <Link
                    href={liveMenuUrl}
                    target="_blank"
                    className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        restaurant?.restaurantId
                            ? "text-primary hover:bg-primary/10 bg-primary/5"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                >
                    <ExternalLink className="h-4 w-4" />
                    View Live Menu
                </Link>
                <Link
                    href={tvMenuUrl}
                    target="_blank"
                    className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors mb-2",
                        restaurant?.restaurantId
                            ? "text-primary hover:bg-primary/10 bg-primary/5"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                >
                    <Tv className="h-4 w-4" />
                    Launch TV Mode
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
