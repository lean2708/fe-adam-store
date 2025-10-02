import { NextResponse, NextRequest } from 'next/server';

export const defaultLocale = 'en';
export const locales = ['en', 'vi'] as const;
export type Locale = (typeof locales)[number];

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

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathSegments = url.pathname.split('/').filter(Boolean);

  const maybeLocale = pathSegments[0] as Locale | undefined;
  if (!maybeLocale || !locales.includes(maybeLocale)) {
    url.pathname = `/${defaultLocale}${url.pathname}`;
    return NextResponse.redirect(url);
  }

  const normalizedPath = '/' + pathSegments.slice(1).join('/');
  if (isProtectedRoute(normalizedPath)) {
    const hasAuthCookie =
      req.cookies.has('next-auth.session-token') ||
      req.cookies.has('__Secure-next-auth.session-token');

    if (!hasAuthCookie) {
      url.pathname = `/${maybeLocale}/login`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'], //
};
