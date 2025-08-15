// middleware.ts
import { NextResponse, NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing); // returns a middleware handler function

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Skip API routes
  if (url.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Unprotected route: just handle i18n
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // Match only non-static files, non-Next internals
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
