"use client";

import { useSession } from "next-auth/react";
import { Menu as MenuIcon, User } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function TopBar({ onMenuClick }) {
    const { data: session } = useSession();

    return (
        <header className="flex h-16 items-center gap-4 border-b bg-background/50 backdrop-blur-md px-6 sticky top-0 z-30">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
            </Button>

            <div className="flex-1">
                <h1 className="text-lg font-semibold font-display text-foreground">
                    Dashboard
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                    <div className="text-right hidden sm:block">
                        <p className="font-medium leading-none">{session?.user?.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{session?.user?.email}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <User className="h-4 w-4" />
                    </div>
                </div>
            </div>
        </header>
    );
}
