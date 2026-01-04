import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserLoginSchema } from "@/lib/validations";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Restaurant from "@/models/Restaurant";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = UserLoginSchema.safeParse(credentials);

        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;

        await dbConnect();
        
        const user = await User.findOne({ email }).select("+password");

        if (!user || !user.password) return null;

        const isMatch = await user.matchPassword(password);

        if (!isMatch) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      // Run the base JWT logic first (from config) - manually or just override
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      // --- NODE SPECIFIC LOGIC (Mongoose) ---
      const userId = token.id || token.sub;
      if (!token.restaurantId && userId) {
        try {
          await dbConnect();
          const restaurant = await Restaurant.findOne({ owner: userId });
          if (restaurant) {
            token.restaurantId = restaurant.restaurantId;
            token.plan = restaurant.plan;
          } else {
            // Explicitly ensure it's not set if no restaurant found
            delete token.restaurantId;
            delete token.plan;
          }
        } catch (error) {
          console.error("Error fetching restaurant in JWT callback:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.restaurantId = token.restaurantId;
        session.user.plan = token.plan;
      }
      return session;
    },
  },
});
