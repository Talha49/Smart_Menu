import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback-secret-for-development-only"
);
const isAuthBypassed = process.env.BYPASS_AUTH === "true" || process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

export async function middleware(req) {
  const token = req.cookies.get("auth-token")?.value;
  const { pathname } = req.nextUrl;
  const isTestingHost = req.nextUrl.hostname === "davoriq.com" || req.nextUrl.hostname === "www.davoriq.com";

  if (isAuthBypassed || isTestingHost) {
    if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
      return NextResponse.redirect(new URL("/", req.url));
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
