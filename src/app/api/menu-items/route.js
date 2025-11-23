import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import connectDB from '@/lib/db';
import { authConfig } from '@/lib/auth';
import User from '@/models/user.model';
import MenuItem from '@/models/menuItem.model';

const menuItemSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string().optional().default(''),
  category: z.string().optional().default('Uncategorized'),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');

    if (!restaurantId) {
      return Response.json({ message: 'Restaurant ID required' }, { status: 400 });
    }

    await connectDB();

    // Exclude placeholder category items from the list
    const items = await MenuItem.find({ 
      restaurant: restaurantId,
      name: { $not: { $regex: '^\\[Category: .+\\]$' } }, // Exclude placeholder items
    }).sort({ createdAt: -1 });

    return Response.json(items);
  } catch (error) {
    console.error('Menu items fetch error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = menuItemSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ message: 'Invalid input' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).populate('restaurant');

    if (!user.restaurant) {
      return Response.json({ 
        message: 'No restaurant found. Please complete onboarding first.',
        code: 'NO_RESTAURANT'
      }, { status: 400 });
    }

    // Enforce free-tier item limit (15) excluding placeholder category items
    if ((user.restaurant.plan || 'free') === 'free') {
      const itemCount = await MenuItem.countDocuments({
        restaurant: user.restaurant._id,
        name: { $not: { $regex: '^\\[Category: .+\\]$' } },
      });
      if (itemCount >= 15) {
        return Response.json({
          message: 'Free plan limit reached (15 items). Please upgrade to Pro.',
          code: 'UPGRADE_REQUIRED',
          limit: 15,
          current: itemCount,
        }, { status: 402 });
      }
    }

    const menuItem = new MenuItem({
      ...parsed.data,
      restaurant: user.restaurant._id,
    });

    await menuItem.save();

    return Response.json(menuItem, { status: 201 });
  } catch (error) {
    console.error('Menu item creation error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
