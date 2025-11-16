import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import connectDB from '@/lib/db';
import { authConfig } from '@/lib/auth';
import User from '@/models/user.model';
import Restaurant from '@/models/restaurant.model';

const onboardingSchema = z.object({
  restaurantName: z.string().min(1),
});

export async function POST(request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = onboardingSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ message: 'Invalid input' }, { status: 400 });
    }

    await connectDB();

    const restaurantId = parsed.data.restaurantName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const restaurant = new Restaurant({
      name: parsed.data.restaurantName,
      restaurantId,
      owner: session.user.id,
    });

    await restaurant.save();

    await User.findByIdAndUpdate(session.user.id, { restaurant: restaurant._id });

    // Return restaurant data for Zustand store
    return Response.json({ 
      success: true, 
      restaurant: {
        id: restaurant._id.toString(),
        _id: restaurant._id.toString(),
        name: restaurant.name,
        restaurantId: restaurant.restaurantId,
        plan: restaurant.plan || 'free',
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Onboarding error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
