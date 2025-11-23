import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/user.model';
import Restaurant from '@/models/restaurant.model';
import { put } from '@vercel/blob';

/**
 * Logo Upload API Route
 * Uploads logo to Vercel Blob and updates restaurant record
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
        message: 'No restaurant found.',
        code: 'NO_RESTAURANT'
      }, { status: 400 });
    }

    // Check if user is on Pro plan
    if (user.restaurant.plan !== 'pro') {
      return Response.json({ 
        message: 'Pro plan required for logo upload.',
        code: 'PRO_REQUIRED'
      }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ message: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return Response.json({ message: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ message: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `logo-${user.restaurant._id}-${timestamp}.${file.name.split('.').pop()}`;

    // Check if Vercel Blob token is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return Response.json({ 
        message: 'Vercel Blob is not configured. Please add BLOB_READ_WRITE_TOKEN to your environment variables.',
        code: 'BLOB_NOT_CONFIGURED'
      }, { status: 500 });
    }

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Update restaurant with logo URL
    const restaurant = await Restaurant.findByIdAndUpdate(
      user.restaurant._id,
      { logoUrl: blob.url },
      { new: true }
    );

    return Response.json({
      url: blob.url,
      message: 'Logo uploaded successfully',
    });
  } catch (error) {
    console.error('Logo upload error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

