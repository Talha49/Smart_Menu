"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { Pencil, Trash2, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export function MenuItemCard({ item, onEdit, onDelete, onToggleAvailability }) {
    // Local state for optimistic UI updates on availability
    const [isAvailable, setIsAvailable] = useState(item.isAvailable);
    const [isToggling, setIsToggling] = useState(false);

    const handleToggle = async (checked) => {
        setIsAvailable(checked); // Optimistic update
        setIsToggling(true);

        try {
            await onToggleAvailability(item._id, checked);
            toast.success(checked ? "Item available" : "Item unavailable");
        } catch (error) {
            setIsAvailable(!checked); // Revert on error
            toast.error("Failed to update status");
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50">
            {/* Image Area */}
            <div className="relative h-48 w-full bg-secondary/30 overflow-hidden">
                {item.imageUrl ? (
                    <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className={cn(
                            "object-cover transition-transform duration-500 group-hover:scale-105",
                            !isAvailable && "grayscale opacity-60"
                        )}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <ImageOff className="h-10 w-10 opacity-20" />
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-md shadow-sm">
                        {item.category}
                    </Badge>
                </div>
            </div>

            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                        {item.name}
                    </h3>
                    <span className="font-mono font-medium text-primary">
                        ${Number(item.price).toFixed(2)}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-4">
                    {item.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={isAvailable}
                            onCheckedChange={handleToggle}
                            disabled={isToggling}
                            aria-label="Toggle availability"
                        />
                        <span className={cn("text-xs font-medium", isAvailable ? "text-green-500" : "text-muted-foreground")}>
                            {isAvailable ? "Available" : "Unavailable"}
                        </span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-2 bg-secondary/20 flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1 gap-1 h-8" onClick={() => onEdit(item)}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 gap-1 h-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(item._id)}>
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
            </CardFooter>
        </Card>
    );
}
