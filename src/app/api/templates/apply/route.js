import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/user.model';
import Restaurant from '@/models/restaurant.model';
import Template from '@/models/template.model';

// POST - Apply template to restaurant settings
export async function POST(request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { templateId, applyTo } = body; // applyTo: 'menu', 'tv', or 'both'

    if (!templateId) {
      return Response.json({ message: 'Template ID required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).populate('restaurant');

    if (!user.restaurant) {
      return Response.json({ message: 'Restaurant not found' }, { status: 404 });
    }

    // Get template
    const template = await Template.findById(templateId);

    if (!template) {
      return Response.json({ message: 'Template not found' }, { status: 404 });
    }

    // Check if it's a default template or user's template
    if (!template.isDefault) {
      if (!user.restaurant || template.restaurant.toString() !== user.restaurant._id.toString()) {
        return Response.json({ message: 'Unauthorized' }, { status: 403 });
      }
    }

    // Check category compatibility
    const target = applyTo || template.category;
    if (template.category !== 'both' && template.category !== target) {
      return Response.json({ message: 'Template category mismatch' }, { status: 400 });
    }

    // Apply template settings
    const restaurant = await Restaurant.findById(user.restaurant._id);
    
    if (target === 'menu' || target === 'both') {
      restaurant.menuSettings = {
        ...restaurant.menuSettings,
        ...template.settings,
      };
    }

    if (target === 'tv' || target === 'both') {
      restaurant.tvSettings = {
        ...restaurant.tvSettings,
        ...template.settings,
      };
    }

    await restaurant.save();

    return Response.json({
      success: true,
      menuSettings: restaurant.menuSettings,
      tvSettings: restaurant.tvSettings,
    });
  } catch (error) {
    console.error('Template apply error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

