import { create } from 'zustand';
import { CategoryService } from '@/services/categoryService';
import toast from 'react-hot-toast';

export const useCategoryStore = create((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,
  
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await CategoryService.getCategories();
      set({ categories: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createCategory: async (name, emoji) => {
    try {
      const newCategory = await CategoryService.createCategory(name, emoji);
      toast.success("Category created");
      // Optimistic append or refetch
      set((state) => ({ categories: [...state.categories, newCategory] }));
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  },

  updateCategory: async (id, name, emoji) => {
    try {
      const updated = await CategoryService.updateCategory(id, name, emoji);
      toast.success("Category updated");
      set((state) => ({
        categories: state.categories.map((c) => c._id === id ? updated : c)
      }));
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  },

  deleteCategory: async (id, name) => {
    try {
      await CategoryService.deleteCategory(id);
      toast.success("Category deleted");
      set((state) => ({
        categories: state.categories.filter((c) => c._id !== id)
      }));
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  }
}));
