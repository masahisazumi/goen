import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Coming soon mode - set COMING_SOON_MODE=true in production to enable
const isComingSoonMode = process.env.COMING_SOON_MODE === "true";

// Base URL for redirects (use AUTH_URL or request origin)
const getBaseUrl = (requestOrigin: string) => {
  return process.env.AUTH_URL || requestOrigin;
};

// Routes that require authentication
const protectedRoutes = [
  "/mypage",
  "/profile/edit",
  "/messages",
  "/settings",
];

// Routes that should redirect to mypage if already authenticated
const authRoutes = [
  "/login",
  "/register",
];

// Routes allowed during coming soon mode
const comingSoonAllowedRoutes = [
  "/coming-soon",
  "/privacy-policy",
  "/terms",
  "/contact",
  "/login",
  "/register",
  "/admin",
  "/mypage",
];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  // Coming soon mode: redirect top page to /coming-soon
  if (isComingSoonMode) {
    const isAllowedRoute = comingSoonAllowedRoutes.some(route =>
      pathname.startsWith(route)
    );

    if (pathname === "/" || (!isAllowedRoute && !pathname.startsWith("/api"))) {
      const baseUrl = getBaseUrl(nextUrl.origin);
      return NextResponse.redirect(new URL("/coming-soon", baseUrl));
    }
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  const baseUrl = getBaseUrl(nextUrl.origin);

  // Redirect to login if trying to access protected route without auth
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", baseUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to mypage if already logged in and trying to access auth routes
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/mypage", baseUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
