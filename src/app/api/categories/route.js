import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import connectDB from '@/lib/db';
import { authConfig } from '@/lib/auth';
import User from '@/models/user.model';
import MenuItem from '@/models/menuItem.model';

const categorySchema = z.object({
  name: z.string().min(1).max(50),
});

/**
 * GET /api/categories
 * Get all categories for the authenticated user's restaurant
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
      return Response.json({ message: 'No restaurant found' }, { status: 400 });
    }

    // Get all unique categories from menu items for this restaurant
    const categories = await MenuItem.distinct('category', {
      restaurant: user.restaurant._id,
    });

    // Sort categories alphabetically
    const sortedCategories = categories.sort();

    return Response.json({ categories: sortedCategories });
  } catch (error) {
    console.error('Categories fetch error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/categories
 * Create a new category (by creating a menu item with that category)
 * Note: Categories are text-based, created implicitly when used
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ message: 'Invalid input' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).populate('restaurant');

    if (!user.restaurant) {
      return Response.json({ message: 'No restaurant found' }, { status: 400 });
    }

    // Check if category already exists
    const existingCategory = await MenuItem.findOne({
      restaurant: user.restaurant._id,
      category: parsed.data.name,
    });

    if (existingCategory) {
      return Response.json({ 
        success: true,
        message: 'Category already exists',
        category: parsed.data.name 
      }, { status: 200 });
    }

    // Create a placeholder menu item to make the category exist
    // This item is marked as unavailable so it won't show in public menus
    const placeholderItem = new MenuItem({
      name: `[Category: ${parsed.data.name}]`,
      price: 0,
      description: '',
      category: parsed.data.name,
      restaurant: user.restaurant._id,
      isAvailable: false, // Hidden from public menus
    });

    await placeholderItem.save();

    return Response.json({ 
      success: true, 
      category: parsed.data.name,
      message: 'Category created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Category creation error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/categories
 * Delete a category by renaming all menu items in that category to "Uncategorized"
 */
export async function DELETE(request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryName = searchParams.get('name');

    if (!categoryName) {
      return Response.json({ message: 'Category name required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).populate('restaurant');

    if (!user.restaurant) {
      return Response.json({ message: 'No restaurant found' }, { status: 400 });
    }

    // Update all menu items with this category to "Uncategorized"
    // This includes placeholder items
    const result = await MenuItem.updateMany(
      {
        restaurant: user.restaurant._id,
        category: categoryName,
      },
      {
        $set: { category: 'Uncategorized' },
      }
    );

    // Also delete any placeholder items for this category
    await MenuItem.deleteMany({
      restaurant: user.restaurant._id,
      category: 'Uncategorized',
      name: { $regex: `^\\[Category: ${categoryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]$` },
      price: 0,
      isAvailable: false,
    });

    return Response.json({ 
      success: true, 
      message: `Category "${categoryName}" deleted. ${result.modifiedCount} items moved to "Uncategorized".`
    });
  } catch (error) {
    console.error('Category deletion error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

