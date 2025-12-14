"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import { useMenuStore } from "@/hooks/use-menu-store";
import { useCategoryStore } from "@/hooks/use-category-store";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Plus } from "lucide-react";
import { MenuItemsTab } from "./MenuItemsTab";
import { CategoriesTab } from "./CategoriesTab";

// Lazy load the modal for better initial load performance
const MenuItemModal = lazy(() => import("@/components/dashboard/MenuItemModal").then(module => ({ default: module.MenuItemModal })));

export default function UnifiedMenuPage() {
    const { fetchItems } = useMenuStore();
    const { fetchCategories } = useCategoryStore();

    // Local State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [activeTab, setActiveTab] = useState("items");

    // Initial Fetch
    useEffect(() => {
        fetchItems();
        fetchCategories();
    }, []);

    // Handlers
    const handleCreateItem = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleRefresh = () => {
        fetchItems();
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">Menu Management</h1>
                    <p className="text-muted-foreground mt-1">Organize your menu, categories, and availability.</p>
                </div>
                {activeTab === "items" && (
                    <Button onClick={handleCreateItem} size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                        <Plus className="h-5 w-5 mr-2" /> Add New Item
                    </Button>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
                    <TabsTrigger value="items">Menu Items</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                </TabsList>

                {/* --- MENU ITEMS TAB --- */}
                <TabsContent value="items">
                    <MenuItemsTab
                        onCreateItem={handleCreateItem}
                        onEditItem={handleEditItem}
                    />
                </TabsContent>

                {/* --- CATEGORIES TAB --- */}
                <TabsContent value="categories">
                    <CategoriesTab />
                </TabsContent>
            </Tabs>

            {/* Lazy Loaded Modal */}
            <Suspense fallback={null}>
                {isModalOpen && (
                    <MenuItemModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        initialData={editingItem}
                        onRefresh={handleRefresh}
                    />
                )}
            </Suspense>
        </div>
    );
}
