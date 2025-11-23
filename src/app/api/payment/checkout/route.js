import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/user.model';
import Restaurant from '@/models/restaurant.model';

/**
 * Mock Payment Checkout API Route
 * Creates a mock checkout session for upgrading to Pro plan
 * In production, this would integrate with Stripe Checkout
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).populate('restaurant');

    if (!user.restaurant) {
      return Response.json({ 
        message: 'No restaurant found. Please complete onboarding first.',
        code: 'NO_RESTAURANT'
      }, { status: 400 });
    }

    // Check if already on Pro plan
    if (user.restaurant.plan === 'pro') {
      return Response.json({ 
        message: 'You are already on the Pro plan.',
        code: 'ALREADY_PRO'
      }, { status: 400 });
    }

    // Create mock checkout session
    // In production, this would create a Stripe Checkout session
    const mockCheckoutSession = {
      id: `mock_session_${Date.now()}`,
      restaurantId: user.restaurant._id.toString(),
      amount: 999, // $9.99 in cents (mock price)
      currency: 'usd',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    return Response.json({
      sessionId: mockCheckoutSession.id,
      checkoutUrl: `/dashboard/payment?sessionId=${mockCheckoutSession.id}`,
      amount: mockCheckoutSession.amount,
      currency: mockCheckoutSession.currency,
    });
  } catch (error) {
    console.error('Checkout creation error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

