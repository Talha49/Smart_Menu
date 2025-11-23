import connectDB from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import Restaurant from '@/models/restaurant.model';
import MenuItem from '@/models/menuItem.model';

export async function GET(request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session || !session.user?.restaurantId) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const restaurant = await Restaurant.findById(session.user.restaurantId);
    if (!restaurant) {
      return Response.json({ message: 'Restaurant not found' }, { status: 404 });
    }

    // Get all menu items (including unavailable ones for preview)
    const items = await MenuItem.find({
      restaurant: restaurant._id,
      name: { $not: { $regex: '^\\[Category: .+\\]$' } }, // Exclude placeholder items
    }).sort({ category: 1, name: 1 });

    // Group by category
    const groupedByCategory = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push({
        id: item._id,
        name: item.name,
        price: item.price,
        description: item.description,
        isAvailable: item.isAvailable,
        imageUrl: item.imageUrl || null,
      });
      return acc;
    }, {});

    return Response.json({
      items: groupedByCategory,
      categories: Object.keys(groupedByCategory),
    });
  } catch (error) {
    console.error('Preview menu items fetch error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

