import { create } from 'zustand';
import { MenuService } from '@/services/menuService';
import toast from 'react-hot-toast';

export const useMenuStore = create((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  filters: {
    search: '',
    category: 'all',
  },

  setFilter: (key, value) => set((state) => ({ 
    filters: { ...state.filters, [key]: value } 
  })),

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category !== 'all') params.category = filters.category;

      const data = await MenuService.getMenuItems(params);
      set({ items: data.items || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      // Don't toast on initial fetch fail, just show error state in UI
    }
  },

  createItem: async (data) => {
    try {
      await MenuService.createMenuItem(data);
      toast.success("Item created");
      get().fetchItems(); // Refresh
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  },

  updateItem: async (id, data) => {
    try {
      await MenuService.updateMenuItem(id, data);
      toast.success("Item updated");
      get().fetchItems();
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  },

  deleteItem: async (id) => {
    try {
      await MenuService.deleteMenuItem(id);
      toast.success("Item deleted");
      // Optimistic update
      set((state) => ({ items: state.items.filter((i) => i._id !== id) }));
    } catch (error) {
      toast.error(error.message);
      get().fetchItems(); // Revert on fail
    }
  },

  toggleAvailability: async (id, currentStatus) => {
    // Optimistic update
    set((state) => ({
      items: state.items.map((i) => 
        i._id === id ? { ...i, isAvailable: !currentStatus } : i
      )
    }));

    try {
      await MenuService.toggleAvailability(id, !currentStatus);
    } catch (error) {
      toast.error("Failed to update status");
      // Revert
      set((state) => ({
        items: state.items.map((i) => 
            i._id === id ? { ...i, isAvailable: currentStatus } : i
        )
      }));
    }
  }
}));
