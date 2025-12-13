"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MenuItemCard } from "@/components/dashboard/MenuItemCard";
import { MenuItemModal } from "@/components/dashboard/MenuItemModal";
import { Plus, Search, Filter, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MenuPage() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

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

    const handleCreate = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    // Unique categories from data or default list
    // For simplicity, we'll keep static for now or extract from items
    const categories = ["Starters", "Mains", "Desserts", "Drinks"];

    return (
        <div className="space-y-6">
            <MenuItemModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                initialData={editingItem}
                onRefresh={mutate}
            />

            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight">Menu Items</h1>
                    <p className="text-muted-foreground">Manage your food and drink offerings.</p>
                </div>
                <Button onClick={handleCreate} className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20">
                    <Plus className="h-4 w-4" /> Add Item
                </Button>
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
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <select
                            className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none cursor-pointer"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
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
                        <Button variant="outline" onClick={handleCreate}>Create Item</Button>
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
