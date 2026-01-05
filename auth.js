import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserLoginSchema } from "./lib/validations";
import dbConnect from "./lib/mongodb";
import User from "./models/User";
import Restaurant from "./models/Restaurant";
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
        try {
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
        } catch (error) {
          console.error("Auth Authorize Error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      const userId = token.id || token.sub;
      if (!token.restaurantId && userId) {
        try {
          await dbConnect();
          const restaurant = await Restaurant.findOne({ owner: userId });
          if (restaurant) {
            token.restaurantId = restaurant.restaurantId;
            token.plan = restaurant.plan;
          }
        } catch (error) {
          console.error("JWT Callback Error:", error);
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
