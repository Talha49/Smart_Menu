"use client";

import { useMenuStore } from "@/hooks/use-menu-store";
import { useCategoryStore } from "@/hooks/use-category-store"; // For options
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { MenuItemCard } from "@/components/dashboard/MenuItemCard";
import { Plus } from "lucide-react";

export function MenuItemsTab({ onCreateItem, onEditItem }) {
    const {
        items,
        isLoading,
        filters,
        setFilter,
        fetchItems,
        deleteItem,
        toggleAvailability
    } = useMenuStore();

    const { categories } = useCategoryStore();
    const categoryOptions = categories.map(c => ({ value: c.name, label: c.name }));

    const handleDeleteItem = async (id) => {
        if (confirm("Delete this item?")) {
            await deleteItem(id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center bg-card/50 p-4 rounded-xl border backdrop-blur-sm shadow-sm">
                <SearchBar
                    value={filters.search}
                    onChange={(val) => {
                        setFilter("search", val);
                        fetchItems();
                    }}
                />
                <FilterSelect
                    value={filters.category}
                    onChange={(val) => {
                        setFilter("category", val);
                        setTimeout(() => fetchItems(), 0);
                    }}
                    options={categoryOptions}
                    placeholder="All Categories"
                />
                <div className="ml-auto text-xs text-muted-foreground hidden sm:block">
                    {items.length} items found
                </div>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-80 rounded-xl bg-muted/80 animate-pulse" />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/5">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <Plus className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No items found</h3>
                    <p className="text-muted-foreground mb-6 text-center max-w-sm">
                        {filters.search || filters.category !== 'all'
                            ? "Try adjusting your filters to find what you're looking for."
                            : "Get started by adding your first delicious menu item!"}
                    </p>
                    <Button variant="outline" onClick={onCreateItem}>Add Item</Button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map(item => (
                        <MenuItemCard
                            key={item._id}
                            item={item}
                            onDelete={handleDeleteItem}
                            onToggleAvailability={(id, status) => toggleAvailability(id, status)} // Store handles signature
                            onEdit={onEditItem}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
