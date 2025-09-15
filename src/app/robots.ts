import { MetadataRoute } from 'next';

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const SUPPORTED_LOCALES = ['vi', 'en'];

/**
 * Generates robot.txt disallow rules for private pages across all supported locales.
 * @param pages - Array of page paths to generate rules for
 * @returns Array of disallow rules including both localized and non-localized paths
 */
const generatePrivatePageRules = (pages: string[]) => {
  return pages.flatMap((page) => [
    ...SUPPORTED_LOCALES.map((locale) => `/${locale}/${page}/`),
    `/${page}/`,
  ]);
};

export default function robots(): MetadataRoute.Robots {
  // Generate allow rules for each locale
  const allowRules: string[] = [];

  // Public pages for each locale
  const publicPages = [
    '', // homepage
    'product/*',
    'detail/*',
    'about-us',
    'contact',
    'store-location',
    'best-sellers',
    'detail',
  ];

  // Add locale-specific allow rules
  SUPPORTED_LOCALES.forEach((locale) => {
    publicPages.forEach((page) => {
      if (page === '') {
        allowRules.push(`/${locale}/`);
      } else {
        allowRules.push(`/${locale}/${page}`);
      }
    });
  });

  // Static assets
  allowRules.push('/imgs/');
  allowRules.push('/icons/');
  allowRules.push('/_next/static/');

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', ...allowRules],
        disallow: [
          // Admin pages for all locales
          ...SUPPORTED_LOCALES.map((locale) => `/${locale}/admin/`),
          '/admin/',

          // Dashboard pages
          ...SUPPORTED_LOCALES.map((locale) => `/${locale}/dashboard/`),
          '/dashboard/',

          // API routes
          '/api/',

          // Private/internal pages
          '/_next/webpack-hmr',
          '/_next/static/chunks/',

          // Temporary/development pages
          '/test/',
          '/dev/',

          // Private pages
          ...generatePrivatePageRules([
            'user',
            'cart',
            'orders',
            'order',
            'search',
            'address',
          ]),
        ],
      },
      // Special rules for search engine bots
      {
        userAgent: 'Googlebot',
        allow: ['/', ...allowRules],
        disallow: ['/api/', '/admin/', '/dashboard/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
