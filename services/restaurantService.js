// Client-side service for restaurant operations

export const RestaurantService = {
  /**
   * Creates a new restaurant
   * @param {Object} data - { name, restaurantId }
   * @returns {Promise<Object>} Created restaurant data
   */
  create: async (data) => {
    const res = await fetch("/api/restaurant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to create restaurant");
    }

    return result;
  },

  /**
   * Checks if a restaurant ID (slug) is available
   * @param {string} slug 
   * @returns {Promise<boolean>}
   */
  checkAvailability: async (slug) => {
    // We can implement a specific availability endpoint later
    // For now, simple creation check is enough, or we can use this architecture
    // to expand easily.
    return true; 
  }
};
