import bcrypt from 'bcryptjs';
import { z } from 'zod';
import connectDB from '@/lib/db';
import User from '@/models/user.model';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ message: 'Invalid input' }, { status: 400 });
    }

    await connectDB();

    // Normalize email to lowercase to match schema
    const email = parsed.data.email.toLowerCase().trim();
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ message: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
