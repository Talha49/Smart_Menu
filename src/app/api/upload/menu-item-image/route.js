import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import { put } from '@vercel/blob';
import connectDB from '@/lib/db';
import User from '@/models/user.model';

export async function POST(request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify user and restaurant
    await connectDB();
    const user = await User.findById(session.user.id).populate('restaurant');
    
    if (!user.restaurant) {
      return Response.json({ 
        message: 'Restaurant not found.',
        code: 'RESTAURANT_NOT_FOUND'
      }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ message: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return Response.json({ message: 'Invalid file type' }, { status: 400 });
    }

    // Validate file size (max 10MB for original, will be optimized)
    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ message: 'File size must be less than 10MB' }, { status: 400 });
    }

    // Check for Vercel Blob token
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return Response.json({ 
        message: 'Blob storage not configured. Please set BLOB_READ_WRITE_TOKEN in environment variables.',
        code: 'BLOB_NOT_CONFIGURED'
      }, { status: 500 });
    }

    // Optimize image: resize to max 800px width/height while maintaining aspect ratio
    // For now, we'll upload as-is. In production, you might want to use sharp for server-side optimization
    // Client-side cropping and optimization is already handled in the component
    
    // Upload to Vercel Blob
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const blob = await put(`menu-items/${user.restaurant._id}/${fileName}`, file, {
      access: 'public',
      token,
      // Add cache control for better performance
      addRandomSuffix: false,
    });

    return Response.json({ url: blob.url });
  } catch (error) {
    console.error('Menu item image upload error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

