// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { Pathnames, LocalePrefixMode } from 'next-intl/routing';

export const defaultLocale = 'en' as const;
export const locales = ['en', 'vi'] as const;
export const pathnames: Pathnames<typeof locales> = {};
export type Locale = (typeof locales)[number];
export const localePrefix: LocalePrefixMode = 'always';

const intlMiddleware = createMiddleware({
  defaultLocale,
  locales,
  localePrefix,
  pathnames,
});

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Skip API routes
  if (url.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Unprotected route: just handle i18n
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // Match only non-static files, non-Next internals
    '/((?!_next|.*\\..*).*)',
    '/(api|trpc)(.*)',
  ],
};
