import connectDB from '@/lib/db';
import Restaurant from '@/models/restaurant.model';
import MenuItem from '@/models/menuItem.model';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ message: 'Restaurant ID required' }, { status: 400 });
    }

    await connectDB();

    // Try to find by restaurantId (slug) first, then by MongoDB _id
    let restaurant = await Restaurant.findOne({ restaurantId: id });
    
    // If not found by slug, try MongoDB _id
    if (!restaurant && /^[0-9a-fA-F]{24}$/.test(id)) {
      restaurant = await Restaurant.findById(id);
    }

    if (!restaurant) {
      return Response.json({ message: 'Restaurant not found' }, { status: 404 });
    }

    // Get available items, excluding placeholder category items
    const items = await MenuItem.find({
      restaurant: restaurant._id,
      isAvailable: true,
      name: { $not: { $regex: '^\\[Category: .+\\]$' } }, // Exclude placeholder items
    }).sort({ category: 1, name: 1 });

    const groupedByCategory = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push({
        id: item._id,
        name: item.name,
        price: item.price,
        description: item.description,
      });
      return acc;
    }, {});

    return Response.json({
      restaurant: {
        name: restaurant.name,
        logoUrl: restaurant.logoUrl,
        brandColor: restaurant.brandColor,
        plan: restaurant.plan || 'free',
        menuSettings: restaurant.menuSettings || {},
        tvSettings: restaurant.tvSettings || {},
      },
      items: groupedByCategory,
    });
  } catch (error) {
    console.error('Public menu fetch error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
