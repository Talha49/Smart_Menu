import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/user.model';
import Restaurant from '@/models/restaurant.model';

/**
 * Mock Payment Success Handler
 * Updates Restaurant.plan to "pro" after successful payment
 * In production, this would be called by Stripe webhook
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return Response.json({ message: 'Session ID required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).populate('restaurant');

    if (!user.restaurant) {
      return Response.json({ 
        message: 'No restaurant found.',
        code: 'NO_RESTAURANT'
      }, { status: 400 });
    }

    // Verify session ID format (mock validation)
    if (!sessionId.startsWith('mock_session_')) {
      return Response.json({ message: 'Invalid session ID' }, { status: 400 });
    }

    // Update restaurant plan to "pro"
    const restaurant = await Restaurant.findByIdAndUpdate(
      user.restaurant._id,
      { plan: 'pro' },
      { new: true }
    );

    if (!restaurant) {
      return Response.json({ message: 'Restaurant not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: 'Successfully upgraded to Pro plan',
      restaurant: {
        _id: restaurant._id,
        name: restaurant.name,
        plan: restaurant.plan,
      },
    });
  } catch (error) {
    console.error('Payment success handler error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

