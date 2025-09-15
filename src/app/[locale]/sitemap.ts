import { getAllProductsTotalAction } from '@/actions/productActions';
import { MetadataRoute } from 'next';

// Base configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const SUPPORTED_LOCALES = ['vi', 'en'];

// Static pages configuration
const STATIC_PAGES = [
  {
    path: '',
    priority: 1.0,
    changeFrequency: 'daily' as const,
  },
  {
    path: 'about-us',
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  },
  {
    path: 'store-location',
    priority: 0.7,
    changeFrequency: 'weekly' as const,
  },
];

// Helper function to create sitemap entries
function createSitemapEntry(
  path: string,
  locale: string,
  priority: number = 0.5,
  changeFrequency:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never' = 'weekly',
  lastModified?: Date
): MetadataRoute.Sitemap[0] {
  const url =
    path === '' ? `${BASE_URL}/${locale}` : `${BASE_URL}/${locale}/${path}`;

  return {
    url,
    lastModified: lastModified || new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: SUPPORTED_LOCALES.reduce((acc, loc) => {
        const altUrl =
          path === '' ? `${BASE_URL}/${loc}` : `${BASE_URL}/${loc}/${path}`;
        acc[loc] = altUrl;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

// Generate static pages sitemap
function generateStaticPagesSitemap(): MetadataRoute.Sitemap {
  const staticSitemap: MetadataRoute.Sitemap = [];

  STATIC_PAGES.forEach((page) => {
    SUPPORTED_LOCALES.forEach((locale) => {
      staticSitemap.push(
        createSitemapEntry(
          page.path,
          locale,
          page.priority,
          page.changeFrequency
        )
      );
    });
  });

  return staticSitemap;
}

// Generate products sitemap
async function generateProductsSitemap(): Promise<MetadataRoute.Sitemap> {
  const productsSitemap: MetadataRoute.Sitemap = [];

  try {
    const res = await getAllProductsTotalAction(0, 10000, ['id,desc']);

    res.data?.products.forEach((product) => {
      SUPPORTED_LOCALES.forEach((locale) => {
        // Individual product pages
        productsSitemap.push(
          createSitemapEntry(`product/${product.id}`, locale, 0.8, 'weekly')
        );
      });
    });

    // Add collection pages that use the same products data
    SUPPORTED_LOCALES.forEach((locale) => {
      // New products page
      productsSitemap.push(createSitemapEntry('new', locale, 0.7, 'daily'));

      // Best sellers page
      productsSitemap.push(
        createSitemapEntry('best-sellers', locale, 0.7, 'daily')
      );
    });
  } catch (error) {
    console.error('Error generating products sitemap:', error);
  }

  return productsSitemap;
}

// Generate categories sitemap
async function generateCategoriesSitemap(): Promise<MetadataRoute.Sitemap> {
  const categoriesSitemap: MetadataRoute.Sitemap = [];

  try {
    SUPPORTED_LOCALES.forEach((locale) => {
      categoriesSitemap.push(
        createSitemapEntry('detail', locale, 0.9, 'daily')
      );
    });

    // Không cần loop qua từng category vì chúng dùng chung URL base
  } catch (error) {
    console.error('Error generating categories sitemap:', error);
  }

  return categoriesSitemap;
}

// Main sitemap function
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  console.log('Generating sitemap...');

  try {
    // Generate all sitemap sections
    const [staticSitemap, productsSitemap, categoriesSitemap] =
      await Promise.all([
        generateStaticPagesSitemap(),
        generateProductsSitemap(),
        generateCategoriesSitemap(),
      ]);

    // Combine all sitemaps
    const completeSitemap = [
      ...staticSitemap,
      ...productsSitemap,
      ...categoriesSitemap,
    ];

    console.log(`Generated sitemap with ${completeSitemap.length} URLs`);
    return completeSitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Return at least static pages if dynamic content fails
    return generateStaticPagesSitemap();
  }
}

// Optional: Generate sitemap index for large sites
export async function generateSitemapIndex(): Promise<MetadataRoute.Sitemap> {
  // For very large sites, you might want to split into multiple sitemaps
  return [
    {
      url: `${BASE_URL}/sitemap-static.xml`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/sitemap-products.xml`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/sitemap-categories.xml`,
      lastModified: new Date(),
    },
  ];
}
