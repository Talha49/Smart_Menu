import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
  
  // Custom Logic: Force onboarding if logged in but no restaurant
  // Note: req.auth.user.restaurantId comes from the token. 
  // In pure Edge middleware without DB, we rely on what's in the JWT cookie.
  // If the JWT doesn't have it yet (e.g. freshly signed up, or not refreshed), this might be tricky.
  // However, after signup we redirect to onboarding anyway.
  
  if (isOnDashboard && isLoggedIn && !req.auth.user?.restaurantId) {
    return NextResponse.redirect(new URL("/onboarding", nextUrl));
  }
  
  // The 'authorized' callback in auth.config.js handles the main auth protection redirects automatically
  // But we can add extra logic here if needed.
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
