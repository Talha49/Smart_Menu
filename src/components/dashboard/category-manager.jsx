'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Trash2, Tag } from 'lucide-react';
import { toastSuccess, toastError, toastInfo } from '@/lib/toast';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function CategoryManager({ onCategoryChange }) {
  const restaurantId = useAuthStore((state) => state.restaurantId);
  const [newCategory, setNewCategory] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { data: categoriesData, mutate } = useSWR(
    restaurantId ? '/api/categories' : null,
    fetcher
  );
  const categories = categoriesData?.categories || ['Uncategorized'];

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      setError('Category name is required');
      toastError('Category name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory.trim() }),
      });

      if (response.ok) {
        setNewCategory('');
        setIsDialogOpen(false);
        mutate(); // Refresh categories
        toastSuccess('Category created');
        if (onCategoryChange) onCategoryChange();
      } else {
        const data = await response.json();
        const msg = data.message || 'Failed to create category';
        setError(msg);
        toastError(msg);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      setError('An error occurred');
      toastError('An error occurred');
    }

    setLoading(false);
  };

  const handleDeleteCategory = async (categoryName) => {
    if (categoryName === 'Uncategorized') {
      toastInfo('Cannot delete the default "Uncategorized" category');
      return;
    }

    if (!confirm(`Delete category "${categoryName}"? All items in this category will be moved to "Uncategorized".`)) {
      return;
    }

    try {
      const response = await fetch(`/api/categories?name=${encodeURIComponent(categoryName)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        mutate(); // Refresh categories
        toastSuccess(`Deleted "${categoryName}"`);
        if (onCategoryChange) onCategoryChange();
      } else {
        const data = await response.json();
        toastError(data.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toastError('An error occurred');
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Categories
            </CardTitle>
            <CardDescription className="mt-1">
              Organize your menu items into categories
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl">Create New Category</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Category Name</label>
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g., Appetizers, Main Course, Desserts"
                    required
                    className="h-11"
                  />
                </div>
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Category'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {categories.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-sm text-gray-500">
                No categories yet. Create one to get started!
              </p>
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900">{category}</span>
                {category !== 'Uncategorized' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

