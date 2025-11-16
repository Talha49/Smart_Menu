import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import connectDB from '@/lib/db';
import { authConfig } from '@/lib/auth';
import User from '@/models/user.model';
import MenuItem from '@/models/menuItem.model';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  isAvailable: z.boolean().optional(),
});

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

    const menuItem = await MenuItem.findById(id);

    if (!menuItem || menuItem.restaurant.toString() !== user.restaurant._id.toString()) {
      return Response.json({ message: 'Not found or unauthorized' }, { status: 404 });
    }

    Object.assign(menuItem, parsed.data);
    await menuItem.save();

    return Response.json(menuItem);
  } catch (error) {
    console.error('Menu item update error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authConfig);

    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const user = await User.findById(session.user.id).populate('restaurant');

    const menuItem = await MenuItem.findById(id);

    if (!menuItem || menuItem.restaurant.toString() !== user.restaurant._id.toString()) {
      return Response.json({ message: 'Not found or unauthorized' }, { status: 404 });
    }

    await MenuItem.deleteOne({ _id: id });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Menu item delete error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
