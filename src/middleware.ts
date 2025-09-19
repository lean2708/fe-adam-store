import { NextResponse, NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { Pathnames, LocalePrefixMode } from 'next-intl/routing';
import { getToken } from 'next-auth/jwt';

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

const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/orders',
  '/order',
  '/cart',
];

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Skip API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Check if the path has a locale prefix
  const pathSegments = pathname.split('/').filter(Boolean);
  const maybeLocale = pathSegments[0];
  const hasLocale = locales.includes(maybeLocale as Locale);

  // Extract the path without locale
  const normalizedPath = hasLocale
    ? '/' + pathSegments.slice(1).join('/')
    : pathname;

  // Check if the normalized path is protected
  if (isProtectedRoute(normalizedPath)) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const locale = hasLocale ? maybeLocale : defaultLocale;
      url.pathname = `/${locale}/login`;
      return NextResponse.redirect(url);
    }
  }

  // Handle internationalization
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    '/((?!_next|.*\\..*).*)',
  ],
};
