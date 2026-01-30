import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Coming soon mode - set COMING_SOON_MODE=true in production to enable
const isComingSoonMode = process.env.COMING_SOON_MODE === "true";

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
      return NextResponse.redirect(new URL("/coming-soon", nextUrl.origin));
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

  // Redirect to login if trying to access protected route without auth
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to mypage if already logged in and trying to access auth routes
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/mypage", nextUrl.origin));
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
