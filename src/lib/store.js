import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Global Zustand store for authentication and restaurant data
 * Syncs with NextAuth session for consistent state management
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      // User session data
      user: null,
      restaurantId: null, // MongoDB _id for API calls
      restaurantSlug: null, // Slug for public URLs (restaurantId field)
      restaurantName: null,
      plan: 'free', // 'free' or 'pro'
      
      // Actions
      setSession: (session) => {
        if (session?.user) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email,
            },
            restaurantId: session.user.restaurantId || null,
            plan: session.user.plan || 'free',
          });
        }
      },
      
      setRestaurant: (restaurantData) => {
        set({
          restaurantId: restaurantData?._id || restaurantData?.id || null,
          restaurantSlug: restaurantData?.restaurantId || null, // The slug field
          restaurantName: restaurantData?.name || null,
          plan: restaurantData?.plan || 'free',
        });
      },
      
      updatePlan: (plan) => {
        set({ plan });
      },
      
      clearSession: () => {
        set({
          user: null,
          restaurantId: null,
          restaurantSlug: null,
          restaurantName: null,
          plan: 'free',
        });
      },
    }),
    {
      name: 'smartmenu-auth-storage', // localStorage key
      // Only persist essential data, not sensitive info
      partialize: (state) => ({
        restaurantId: state.restaurantId,
        restaurantSlug: state.restaurantSlug,
        restaurantName: state.restaurantName,
        plan: state.plan,
      }),
    }
  )
);
