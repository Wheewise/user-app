import { updateSession } from "@wheewise/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  // /login, /signup, the OAuth callback, and the password-reset landing
  // page must stay reachable while signed out — they're how a visitor
  // gets signed in (or recovers access) in the first place.
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup") ||
    request.nextUrl.pathname.startsWith("/auth/callback") ||
    request.nextUrl.pathname.startsWith("/reset-password");
  // Storefronts, browse, and vehicle pages are the actual marketplace
  // content — public/indexable for SEO, with content visible to anonymous
  // visitors. Only account-specific actions (enquire, wishlist, chat) stay
  // gated, enforced at the server-action level, not by hiding the pages.
  const isPublicRoute =
    request.nextUrl.pathname.startsWith("/store/") ||
    request.nextUrl.pathname.startsWith("/vehicle/") ||
    request.nextUrl.pathname === "/browse" ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/help" ||
    request.nextUrl.pathname === "/sitemap" ||
    request.nextUrl.pathname === "/legal" ||
    request.nextUrl.pathname === "/security";

  if (!user && !isAuthRoute && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    url.searchParams.set("login", "1");
    return Response.redirect(url);
  }

  return response;
}

export const config = {
  // Excludes by file extension, not by name — an explicit filename
  // allowlist here has already broken twice (sw.js, then every image
  // under public/categories/) because a static asset added to public/
  // is silently treated as a protected route until someone remembers to
  // list it. Any static file extension is public by nature; only actual
  // page/route requests should ever hit the auth check.
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|txt|xml|json|webmanifest)$).*)",
  ],
};
