"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { useFormStatus } from "react-dom"; // N/A using client form state
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export function MenuItemModal({ isOpen, onClose, initialData, onRefresh }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        category: "Mains",
        imageUrl: "",
        isAvailable: true
    });

    // Reset form when modal opens/closes or initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                price: initialData.price.toString() // Ensure string for input
            });
        } else {
            setFormData({
                name: "",
                price: "",
                description: "",
                category: "Mains",
                imageUrl: "",
                isAvailable: true
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (url) => {
        setFormData(prev => ({ ...prev, imageUrl: url }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = initialData
                ? `/api/menu/${initialData._id}`
                : `/api/menu`;

            const method = initialData ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price) // Convert back to number
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            toast.success(initialData ? "Item updated!" : "Item created!");
            onRefresh(); // Refresh parent list
            onClose();   // Close modal

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Menu Item" : "New Menu Item"}>
            <form onSubmit={handleSubmit} className="space-y-4">

                <div className="space-y-2">
                    <label className="text-sm font-medium">Item Image</label>
                    <ImageUpload
                        value={formData.imageUrl}
                        onChange={handleImageChange}
                        disabled={loading}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Name"
                        name="name"
                        placeholder="e.g. Truffle Burger"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <div className="relative">
                        <Input
                            label="Price"
                            name="price"
                            type="number"
                            step="0.01"
                            placeholder="15.00"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                        <span className="absolute right-3 top-[34px] text-muted-foreground text-sm">$</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Category</label>
                    <select
                        name="category"
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="Starters">Starters</option>
                        <option value="Mains">Mains</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Drinks">Drinks</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Description</label>
                    <textarea
                        name="description"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Delicious beef patty with truffle mayo..."
                        value={formData.description}
                        onChange={handleChange}
                        maxLength={200}
                    />
                </div>

                <div className="pt-4 flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={loading}>
                        {initialData ? "Save Changes" : "Create Item"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
