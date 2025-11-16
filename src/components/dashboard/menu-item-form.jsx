'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toastSuccess, toastError } from '@/lib/toast';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function MenuItemForm({ item, onSaved }) {
  const restaurantId = useAuthStore((state) => state.restaurantId);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Uncategorized',
  });
  const [loading, setLoading] = useState(false);
  
  // Fetch categories
  const { data: categoriesData } = useSWR(
    restaurantId ? '/api/categories' : null,
    fetcher
  );
  const categories = categoriesData?.categories || ['Uncategorized'];

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        price: item.price,
        description: item.description,
        category: item.category,
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!restaurantId) {
      toastError('Please complete onboarding first to create menu items.');
      setLoading(false);
      return;
    }

    const url = item ? `/api/menu-items/${item._id}` : '/api/menu-items';
    const method = item ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
        }),
      });

      if (response.ok) {
        toastSuccess(item ? 'Item updated' : 'Item created');
        onSaved();
      } else {
        const data = await response.json();
        if (response.status === 402 || data.code === 'UPGRADE_REQUIRED') {
          toastError(data.message || 'Free plan limit reached. Please upgrade.');
        } else {
          toastError(data.message || 'Failed to save menu item');
        }
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
      toastError('An error occurred while saving the menu item');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Item Name</label>
        <Input 
          id="name"
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="e.g., Margherita Pizza"
          required 
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="price" className="block text-sm font-semibold text-gray-700">Price</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
          <Input 
            id="price"
            name="price" 
            type="number" 
            step="0.01" 
            value={formData.price} 
            onChange={handleChange} 
            placeholder="0.00"
            required 
            className="h-11 pl-7"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Description</label>
        <Input 
          id="description"
          name="description" 
          value={formData.description} 
          onChange={handleChange}
          placeholder="Optional description for this item"
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Category</label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          Select existing category or create a new one by typing in the field below
        </p>
        <Input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Or type a new category name"
        />
      </div>

      <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
        {loading ? 'Saving...' : item ? 'Update Item' : 'Create Item'}
      </Button>
    </form>
  );
}
