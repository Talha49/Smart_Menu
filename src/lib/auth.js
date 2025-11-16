
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import connectDB from './db';
import User from '@/models/user.model';
// Import Restaurant model to register it with Mongoose for populate() to work
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Restaurant from '@/models/restaurant.model';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const parsed = credentialsSchema.safeParse(credentials);

          if (!parsed.success) {
            console.error('Invalid credentials format:', parsed.error);
            return null;
          }

          await connectDB();

          // Convert email to lowercase to match the schema
          const email = parsed.data.email.toLowerCase().trim();
          const user = await User.findOne({ email }).populate('restaurant');

          if (!user) {
            console.error('User not found for email:', email);
            throw new Error('Invalid email or password');
          }

          const passwordMatch = await bcrypt.compare(parsed.data.password, user.password);

          if (!passwordMatch) {
            console.error('Password mismatch for user:', email);
            throw new Error('Invalid email or password');
          }

        return {
          id: user._id.toString(),
          email: user.email,
          restaurantId: user.restaurant?._id.toString() || null,
          plan: user.restaurant?.plan || 'free',
        };
        } catch (error) {
          console.error('Auth error:', error);
          // Return error message for NextAuth to handle
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.restaurantId = user.restaurantId;
        token.plan = user.plan || 'free';
      }
      // Always fetch latest restaurant info from database
      if (token.id) {
        try {
          await connectDB();
          const dbUser = await User.findById(token.id).populate('restaurant');
          if (dbUser) {
            token.restaurantId = dbUser.restaurant?._id.toString() || null;
            token.plan = dbUser.restaurant?.plan || 'free';
          }
        } catch (error) {
          console.error('Error updating token restaurantId:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.restaurantId = token.restaurantId;
      session.user.plan = token.plan || 'free';
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
};
