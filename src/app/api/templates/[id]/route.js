import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import { z } from 'zod';
import connectDB from '@/lib/db';
import User from '@/models/user.model';
import Template from '@/models/template.model';

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  thumbnail: z.string().url().optional().or(z.literal('')),
  settings: z.object({}).passthrough().optional(),
});

// GET - Get single template
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const template = await Template.findById(id);

    if (!template) {
      return Response.json({ message: 'Template not found' }, { status: 404 });
    }

    // Check if it's a default template or user's template
    const session = await getServerSession(authConfig);
    if (!template.isDefault && session) {
      const user = await User.findById(session.user.id).populate('restaurant');
      if (!user.restaurant || template.restaurant.toString() !== user.restaurant._id.toString()) {
        return Response.json({ message: 'Unauthorized' }, { status: 403 });
      }
    }

    return Response.json(template);
  } catch (error) {
    console.error('Template fetch error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update template
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authConfig);

    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ message: 'Invalid input' }, { status: 400 });
    }

    await connectDB();

    const { id } = await params;
    const user = await User.findById(session.user.id).populate('restaurant');

    const template = await Template.findById(id);

    if (!template) {
      return Response.json({ message: 'Template not found' }, { status: 404 });
    }

    // Can't edit default templates
    if (template.isDefault) {
      return Response.json({ message: 'Cannot edit default templates' }, { status: 403 });
    }

    // Check ownership
    if (!user.restaurant || template.restaurant.toString() !== user.restaurant._id.toString()) {
      return Response.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Check for duplicate name if name is being updated
    if (parsed.data.name && parsed.data.name !== template.name) {
      const existingTemplate = await Template.findOne({
        restaurant: user.restaurant._id,
        name: parsed.data.name,
        isDefault: false,
        _id: { $ne: id },
      });

      if (existingTemplate) {
        return Response.json({ message: 'Template with this name already exists' }, { status: 409 });
      }
    }

    Object.assign(template, parsed.data);
    await template.save();

    return Response.json(template);
  } catch (error) {
    console.error('Template update error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete template
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authConfig);

    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const user = await User.findById(session.user.id).populate('restaurant');

    const template = await Template.findById(id);

    if (!template) {
      return Response.json({ message: 'Template not found' }, { status: 404 });
    }

    // Can't delete default templates
    if (template.isDefault) {
      return Response.json({ message: 'Cannot delete default templates' }, { status: 403 });
    }

    // Check ownership
    if (!user.restaurant || template.restaurant.toString() !== user.restaurant._id.toString()) {
      return Response.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await Template.deleteOne({ _id: id });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Template delete error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

