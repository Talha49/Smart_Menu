import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

if (!process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET environment variable is required");
}
const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

// Bypass is a local-dev-only convenience (skip repeated logins while building
// UI). It must never be reachable in a deployed build - this used to also
// trigger for the literal production hostname, which meant the live app was
// silently issuing sessions to anyone who hit it. `next build`/Vercel always
// set NODE_ENV=production (for previews too), so this check can't leak out.
const isAuthBypassed = process.env.NODE_ENV !== "production" &&
  (process.env.BYPASS_AUTH === "true" || process.env.NEXT_PUBLIC_BYPASS_AUTH === "true");

export async function middleware(req) {
  const token = req.cookies.get("auth-token")?.value;
  const { pathname } = req.nextUrl;

  if (isAuthBypassed) {
    if (!token) {
      const redirectUrl = pathname.startsWith("/login") || pathname.startsWith("/signup") ? "/dashboard" : pathname;
      const response = NextResponse.redirect(new URL(redirectUrl, req.url));
      response.cookies.set("auth-token", "mock-bypass-token", {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return response;
    }

    if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isDashboardPage = pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding");

  if (isDashboardPage) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (isAuthPage && token) {
    try {
      await jwtVerify(token, secret);
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } catch (error) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/login", "/signup"],
};
