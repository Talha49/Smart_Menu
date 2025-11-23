import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/user.model';
import Restaurant from '@/models/restaurant.model';
import { z } from 'zod';

const settingsObjectSchema = z.object({
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  accentColor: z.string().optional(),
  cardBackgroundColor: z.string().optional(),
  borderColor: z.string().optional(),
  priceColor: z.string().optional(),
  fontFamily: z.string().optional(),
  headingSize: z.enum(['small', 'medium', 'large']).optional(),
  bodySize: z.enum(['small', 'medium', 'large']).optional(),
  priceSize: z.enum(['small', 'medium', 'large']).optional(),
  fontWeight: z.enum(['light', 'normal', 'bold']).optional(),
  cardStyle: z.enum(['minimal', 'bordered', 'elevated', 'flat']).optional(),
  gridColumns: z.number().min(1).max(4).optional(),
  spacing: z.enum(['compact', 'normal', 'spacious']).optional(),
  borderRadius: z.enum(['sharp', 'rounded', 'very-rounded']).optional(),
  backgroundType: z.enum(['solid', 'gradient']).optional(),
  showDescriptions: z.boolean().optional(),
  showCategoryHeaders: z.boolean().optional(),
  // Advanced Customization
  headingWeight: z.enum(['light', 'normal', 'bold']).optional(),
  headingStyle: z.enum(['normal', 'italic']).optional(),
  textBold: z.boolean().optional(),
  textItalic: z.boolean().optional(),
  textUnderline: z.boolean().optional(),
  showBulletPoints: z.boolean().optional(),
  bulletStyle: z.enum(['none', 'disc', 'circle', 'square', 'dash', 'arrow']).optional(),
  bulletColor: z.string().optional(),
  pricePosition: z.enum(['right', 'left', 'below', 'inline']).optional(),
  priceFormat: z.enum(['standard', 'no-decimal', 'currency-symbol', 'text']).optional(),
  showCurrencySymbol: z.boolean().optional(),
  priceBold: z.boolean().optional(),
  cardShadow: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
  cardBorderWidth: z.enum(['0', '1', '2', '4']).optional(),
  cardHoverEffect: z.boolean().optional(),
  cardPadding: z.enum(['compact', 'normal', 'spacious']).optional(),
  sections: z.array(z.object({
    name: z.string(),
    order: z.number().optional(),
  })).optional(),
  defaultItemImageUrl: z.string().url().optional().or(z.literal('')),
});

const settingsSchema = z.object({
  logoUrl: z.string().url().optional().or(z.literal('')),
  brandColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  menuSettings: settingsObjectSchema.optional(),
  tvSettings: settingsObjectSchema.optional(),
});

/**
 * GET - Fetch restaurant settings
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).populate('restaurant');

    if (!user.restaurant) {
      return Response.json({ 
        message: 'No restaurant found.',
        code: 'NO_RESTAURANT'
      }, { status: 400 });
    }

    return Response.json({
      logoUrl: user.restaurant.logoUrl || '',
      brandColor: user.restaurant.brandColor || '#000000',
      menuSettings: user.restaurant.menuSettings || {},
      tvSettings: user.restaurant.tvSettings || {},
      plan: user.restaurant.plan,
    });
  } catch (error) {
    console.error('Settings fetch error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH - Update restaurant settings
 */
export async function PATCH(request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).populate('restaurant');

    if (!user.restaurant) {
      return Response.json({ 
        message: 'No restaurant found.',
        code: 'NO_RESTAURANT'
      }, { status: 400 });
    }

    // Check if user is on Pro plan
    if (user.restaurant.plan !== 'pro') {
      return Response.json({ 
        message: 'Pro plan required for settings customization.',
        code: 'PRO_REQUIRED'
      }, { status: 403 });
    }

    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ 
        message: 'Invalid input',
        errors: parsed.error.errors
      }, { status: 400 });
    }

    // Build update object (only include provided fields)
    const updateData = {};
    if (parsed.data.logoUrl !== undefined) {
      updateData.logoUrl = parsed.data.logoUrl;
    }
    if (parsed.data.brandColor !== undefined) {
      updateData.brandColor = parsed.data.brandColor;
    }
    if (parsed.data.menuSettings !== undefined) {
      // Merge with existing menuSettings to preserve other fields
      const existingSettings = user.restaurant.menuSettings || {};
      updateData.menuSettings = {
        ...existingSettings,
        ...parsed.data.menuSettings,
      };
    }
    if (parsed.data.tvSettings !== undefined) {
      // Merge with existing tvSettings to preserve other fields
      const existingTVSettings = user.restaurant.tvSettings || {};
      updateData.tvSettings = {
        ...existingTVSettings,
        ...parsed.data.tvSettings,
      };
    }

    // Update restaurant
    const restaurant = await Restaurant.findByIdAndUpdate(
      user.restaurant._id,
      updateData,
      { new: true }
    );

    if (!restaurant) {
      return Response.json({ message: 'Restaurant not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: 'Settings updated successfully',
      restaurant: {
        logoUrl: restaurant.logoUrl,
        brandColor: restaurant.brandColor,
        menuSettings: restaurant.menuSettings,
        tvSettings: restaurant.tvSettings,
      },
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

