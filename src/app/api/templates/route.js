import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import { z } from 'zod';
import connectDB from '@/lib/db';
import User from '@/models/user.model';
import Template from '@/models/template.model';

const templateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  thumbnail: z.string().url().optional().or(z.literal('')),
  settings: z.object({}).passthrough(), // Allow any object
  category: z.enum(['menu', 'tv', 'both']).optional(),
});

// GET - Fetch templates (default + user's custom templates)
export async function GET(request) {
  try {
    const session = await getServerSession(authConfig);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'both';

    await connectDB();

    // Get default templates
    const defaultTemplates = await Template.find({
      isDefault: true,
      $or: [
        { category: 'both' },
        { category },
      ],
    }).sort({ createdAt: 1 });

    let customTemplates = [];

    // Get user's custom templates if authenticated
    if (session) {
      const user = await User.findById(session.user.id).populate('restaurant');
      if (user.restaurant) {
        customTemplates = await Template.find({
          restaurant: user.restaurant._id,
          isDefault: false,
          $or: [
            { category: 'both' },
            { category },
          ],
        }).sort({ createdAt: -1 });
      }
    }

    return Response.json({
      defaultTemplates,
      customTemplates,
    });
  } catch (error) {
    console.error('Templates fetch error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new template
export async function POST(request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = templateSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ message: 'Invalid input', errors: parsed.error.errors }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).populate('restaurant');

    if (!user.restaurant) {
      return Response.json({ message: 'Restaurant not found' }, { status: 404 });
    }

    // Check if user is on Pro plan (templates are Pro feature)
    if (user.restaurant.plan !== 'pro') {
      return Response.json({
        message: 'Pro plan required to create custom templates.',
        code: 'PRO_REQUIRED',
      }, { status: 403 });
    }

    // Check for duplicate name
    const existingTemplate = await Template.findOne({
      restaurant: user.restaurant._id,
      name: parsed.data.name,
      isDefault: false,
    });

    if (existingTemplate) {
      return Response.json({ message: 'Template with this name already exists' }, { status: 409 });
    }

    const template = new Template({
      ...parsed.data,
      restaurant: user.restaurant._id,
      isDefault: false,
    });

    await template.save();

    return Response.json(template, { status: 201 });
  } catch (error) {
    console.error('Template creation error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

