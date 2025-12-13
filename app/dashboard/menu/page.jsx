"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MenuItemCard } from "@/components/dashboard/MenuItemCard";
import { Plus, Search, Filter, Loader2, Info } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MenuPage() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Debounce search ideally, but for now direct binding is okay for small lists
    // Construct URL query
    const queryParams = new URLSearchParams();
    if (selectedCategory !== "all") queryParams.append("category", selectedCategory);
    if (search) queryParams.append("search", search);

    const { data, error, isLoading, mutate } = useSWR(`/api/menu?${queryParams.toString()}`, fetcher);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");

            toast.success("Item deleted");
            mutate(); // Refresh list
        } catch (error) {
            toast.error("Could not delete item");
        }
    };

    const handleToggle = async (id, isAvailable) => {
        const res = await fetch(`/api/menu/${id}/availability`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isAvailable })
        });
        if (!res.ok) throw new Error("Failed");
        mutate(); // Revalidate to sync state eventually
    };

    const handleEdit = (item) => {
        alert("Edit modal coming in next chunk! For item: " + item.name);
    };

    // Extract unique categories for filter
    // In a real app, we'd fetch categories from a separate API or the full list
    // For now, let's just stick to a simple list or "All"
    const categories = ["all", "Starters", "Mains", "Desserts", "Drinks"];

    return (
        <div className="space-y-6">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight">Menu Items</h1>
                    <p className="text-muted-foreground">Manage your food and drink offerings.</p>
                </div>
                <Link href="/dashboard/menu/new"> {/* Placeholder for next chunk */}
                    <Button className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20">
                        <Plus className="h-4 w-4" /> Add Item
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-card/50 p-4 rounded-xl border backdrop-blur-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search items..."
                        className="pl-9 bg-background"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="sm:w-48">
                    {/* Simple Select Placeholder using native select for speed in this chunk */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <select
                            className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none cursor-pointer"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            <option value="Starters">Starters</option>
                            <option value="Mains">Mains</option>
                            <option value="Desserts">Desserts</option>
                            <option value="Drinks">Drinks</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid Content */}
            {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-80 rounded-xl bg-muted/20 animate-pulse" />
                    ))}
                </div>
            ) : error ? (
                <div className="p-12 text-center text-destructive bg-destructive/10 rounded-xl">
                    Failed to load menu items.
                </div>
            ) : data?.items?.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed rounded-xl space-y-4 bg-muted/5">
                    <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Plus className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg">No items found</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        {search ? "Try adjusting your search or filters." : "Get started by creating your first menu item."}
                    </p>
                    {!search && (
                        <Button variant="outline" onClick={() => alert("Open create modal")}>Create Item</Button>
                    )}
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in-up">
                    {data.items.map((item) => (
                        <MenuItemCard
                            key={item._id}
                            item={item}
                            onDelete={handleDelete}
                            onToggleAvailability={handleToggle}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
