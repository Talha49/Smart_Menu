export const authConfig = {
  basePath: "/api/auth",
  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/login",
    newUser: "/onboarding",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const hasRestaurant = !!auth?.user?.restaurantId;
      const { pathname } = nextUrl;
      
      const isOnDashboard = pathname.startsWith('/dashboard');
      const isOnOnboarding = pathname.startsWith('/onboarding');
      const isOnAuth = pathname.startsWith('/login') || pathname.startsWith('/signup');

      // 1. Force Onboarding if logged in but no restaurant
      if (isOnDashboard && isLoggedIn && !hasRestaurant) {
        return Response.redirect(new URL('/onboarding', nextUrl.url));
      }

      // 2. Auth Protection
      if (isOnDashboard || isOnOnboarding) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      } else if (isLoggedIn && isOnAuth) {
        return Response.redirect(new URL('/dashboard', nextUrl.url));
      }
      return true;
    },
    // JWT/Session callbacks will be merged from auth.js for Node runtime
    // But we define basic pass-through here just in case, though usually not needed for middleware auth check
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        // Other fields like restaurantId will be populated by the Node-side auth.js callback
        // when running in the app, but might be missing in edge middleware if we don't duplicate logic.
        // However, middleware mainly needs to know *if* logged in.
        // For the "Force Onboarding" check, we need the token to have restaurantId.
        if (token.restaurantId) {
            session.user.restaurantId = token.restaurantId;
        }
      }
      return session;
    },
  },
  providers: [], // Providers configured in auth.js
};
