import { create } from 'zustand';

// Global store for restaurant data to avoid prop drilling and frequent refetches
export const useRestaurantStore = create((set) => ({
  restaurant: null,
  isLoading: false,
  error: null,

  setRestaurant: (data) => set({ restaurant: data }),
  
  // Fetch restaurant details using the authenticated session or specific slug
  fetchRestaurant: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this might fetch from a dedicated /api/restaurant/me endpoint
      // For now, we'll assume the session has initial data, or we fetch fresh by ID if needed.
      // But standard practice: GET /api/restaurant/me
      const res = await fetch('/api/restaurant/me');
      
      if (!res.ok) {
         // If 404, maybe not created yet/handled by middleware?
         // We'll handle gracefully.
         if(res.status === 404) {
             set({ restaurant: null, isLoading: false });
             return;
         }
         throw new Error('Failed to fetch restaurant');
      }
      
      const data = await res.json();
      set({ restaurant: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
