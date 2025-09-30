// lib/metadata.ts
import { Metadata } from 'next';

// Base metadata configuration
export const BASE_METADATA_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://adamstore.com',
  siteName: 'Adam Store',
  twitterHandle: '@adamstore_vn',
  defaultImages: {
    og: '/imgs/og/og-marketing.jpg',
    twitter: '/imgs/og/twitter-marketing.jpg',
    logo: '/imgs/og/og-logo.jpg',
  },
};

// Localized content type
type LocalizedContent = {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
};

// Get base localized content for layout
export function getBaseLocalizedContent(locale: string): LocalizedContent {
  const isVietnamese = locale === 'vi';

  return {
    title: isVietnamese
      ? 'Adam Store - Thời Trang Nam Cao Cấp & Phong Cách'
      : "Adam Store - Premium Men's Fashion & Style",

    description: isVietnamese
      ? 'Khám phá bộ sưu tập thời trang nam cao cấp tại Adam Store. Từ áo sơ mi công sở đến trang phục casual, chúng tôi mang đến phong cách hoàn hảo cho phái mạnh hiện đại.'
      : "Discover premium men's fashion collection at Adam Store. From business shirts to casual wear, we bring perfect style for the modern gentleman.",

    keywords: isVietnamese
      ? [
          'thời trang nam',
          'áo sơ mi nam',
          'quần âu nam',
          'trang phục công sở',
          'thời trang cao cấp',
          'phong cách nam tính',
          'Adam Store Vietnam',
          'mua sắm online',
          'thời trang hiện đại',
          'trang phục nam giới',
        ]
      : [
          "men's fashion",
          "men's shirts",
          'business attire',
          'premium clothing',
          'masculine style',
          'Adam Store',
          'online shopping',
          'modern fashion',
          "gentlemen's wear",
          'quality menswear',
        ],

    ogTitle: isVietnamese
      ? 'Adam Store - Định Nghĩa Phong Cách Nam Giới'
      : "Adam Store - Defining Men's Style",

    ogDescription: isVietnamese
      ? 'Nơi hội tụ những xu hướng thời trang nam mới nhất. Chất lượng cao cấp, thiết kế tinh tế, phục vụ quý ông hiện đại.'
      : "Where the latest men's fashion trends converge. Premium quality, sophisticated design, serving the modern gentleman.",
  };
}

// Generate baseline metadata for layout
export function generateBaseMetadata(locale: string): Metadata {
  const content = getBaseLocalizedContent(locale);
  const { baseUrl, siteName, twitterHandle, defaultImages } =
    BASE_METADATA_CONFIG;

  return {
    // Essential: metadataBase for canonical URLs
    metadataBase: new URL(baseUrl),

    title: {
      default: content.title,
      template: `%s | ${siteName}`,
    },
    description: content.description,
    keywords: content.keywords,

    // Author and publisher info
    authors: [
      { name: 'Adam Store Team' },
      { name: 'Adam Store Fashion Experts' },
    ],
    creator: 'Adam Store Vietnam',
    publisher: 'Adam Store',

    // Canonical and alternates
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en-US': '/en',
        'vi-VN': '/vi',
      },
    },

    // Open Graph for social sharing
    openGraph: {
      type: 'website',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      url: `/${locale}`,
      title: content.ogTitle,
      description: content.ogDescription,
      siteName,
      images: [
        {
          url: defaultImages.og,
          width: 1200,
          height: 630,
          alt: content.ogTitle,
        },
        {
          url: defaultImages.logo,
          width: 800,
          height: 600,
          alt: `${siteName} Logo`,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: content.ogTitle,
      description: content.ogDescription,
      images: [defaultImages.twitter],
      creator: twitterHandle,
      site: twitterHandle,
    },

    // Additional metadata for marketing
    category: 'Fashion & Style',
    classification: 'E-commerce Fashion',

    // Robots and SEO
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  };
}

// Page metadata override options
export type PageMetadataOverrides = {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  noIndex?: boolean; // For admin pages
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterImage?: string;
  category?: string;
};

// Create page metadata that inherits from base and overrides specific fields
export function createPageMetadata(
  overrides: PageMetadataOverrides = {}
): Metadata {
  const { siteName } = BASE_METADATA_CONFIG;

  // Start with empty metadata object - Next.js will merge with layout
  const metadata: Metadata = {};

  // Override title (will use template from layout)
  if (overrides.title) {
    metadata.title = overrides.title;
  }

  // Override description
  if (overrides.description) {
    metadata.description = overrides.description;
  }

  // Override keywords (will merge with base keywords)
  if (overrides.keywords) {
    metadata.keywords = overrides.keywords;
  }

  // Override canonical URL
  if (overrides.canonical) {
    metadata.alternates = {
      canonical: overrides.canonical,
    };
  }

  // Admin pages - no index
  if (overrides.noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    };
  }

  // Override Open Graph
  if (overrides.ogImage || overrides.ogTitle || overrides.ogDescription) {
    metadata.openGraph = {};

    if (overrides.ogTitle) {
      metadata.openGraph.title = overrides.ogTitle;
    }

    if (overrides.ogDescription) {
      metadata.openGraph.description = overrides.ogDescription;
    }

    if (overrides.ogImage) {
      metadata.openGraph.images = [
        {
          url: overrides.ogImage,
          width: 1200,
          height: 630,
          alt: overrides.ogTitle || overrides.title || `${siteName}`,
        },
      ];
    }
  }

  // Override Twitter
  if (overrides.twitterImage || overrides.ogTitle || overrides.ogDescription) {
    metadata.twitter = {};

    if (overrides.ogTitle) {
      metadata.twitter.title = overrides.ogTitle;
    }

    if (overrides.ogDescription) {
      metadata.twitter.description = overrides.ogDescription;
    }

    if (overrides.twitterImage) {
      metadata.twitter.images = [overrides.twitterImage];
    }
  }

  // Override category
  if (overrides.category) {
    metadata.category = overrides.category;
  }

  return metadata;
}

// Predefined page metadata presets
export const pageMetadataPresets = {
  // About Us page
  aboutUs: (locale: string) =>
    createPageMetadata({
      title: locale === 'vi' ? 'Về Chúng Tôi' : 'About Us',
      description:
        locale === 'vi'
          ? 'Khám phá câu chuyện về Adam Store - thương hiệu thời trang nam lịch lãm, tinh tế với những sản phẩm chất lượng cao được thiết kế và sản xuất tại Việt Nam.'
          : "Discover the story of Adam Store - an elegant men's fashion brand with high-quality products designed and manufactured in Vietnam.",
      keywords:
        locale === 'vi'
          ? [
              'về chúng tôi',
              'câu chuyện thương hiệu',
              'Adam Store Vietnam',
              'thời trang nam Việt Nam',
            ]
          : [
              'about us',
              'brand story',
              'Adam Store',
              'Vietnamese fashion brand',
            ],
      ogImage: '/imgs/about_us.jpg',
      canonical: `/${locale}/about-us`,
    }),

  // Store Location page
  storeLocation: (locale: string, location?: string) =>
    createPageMetadata({
      title:
        locale === 'vi'
          ? `Hệ Thống Cửa Hàng ${location ? ` - ${location}` : ''}`
          : `Store Location ${location ? ` - ${location}` : ''}`,
      description:
        locale === 'vi'
          ? `Tìm hiểu địa chỉ cửa hàng Adam Store${
              location ? ` tại ${location}` : ' trên toàn quốc'
            }. Ghé thăm showroom để trải nghiệm trực tiếp các sản phẩm thời trang nam cao cấp, được tư vấn bởi đội ngũ chuyên nghiệp.`
          : `Find Adam Store locations${
              location ? ` in ${location}` : ' nationwide'
            }. Visit our showroom to experience premium men's fashion products firsthand, with consultation from our professional team.`,
      keywords:
        locale === 'vi'
          ? [
              'cửa hàng Adam Store',
              'địa chỉ cửa hàng',
              'showroom thời trang nam',
              'hệ thống cửa hàng',
              ...(location
                ? [`Adam Store ${location}`, `cửa hàng ${location}`]
                : []),
              'thời trang nam Việt Nam',
            ]
          : [
              'Adam Store location',
              'store address',
              'men fashion showroom',
              'store system',
              ...(location
                ? [`Adam Store ${location}`, `store ${location}`]
                : []),
              'Vietnamese fashion store',
            ],
      ogImage: '/imgs/map.jpg',
      canonical: `/${locale}/store-location${
        location ? `/${location.toLowerCase().replace(/\s+/g, '-')}` : ''
      }`,

      // OpenGraph for social sharing
      ogTitle:
        locale === 'vi'
          ? `Cửa Hàng Adam Store${
              location ? ` ${location}` : ''
            } - Thời Trang Nam Cao Cấp`
          : `Adam Store${
              location ? ` ${location}` : ''
            } - Premium Men's Fashion`,

      ogDescription:
        locale === 'vi'
          ? `Ghé thăm cửa hàng Adam Store${
              location ? ` tại ${location}` : ''
            }\n Trải nghiệm thời trang nam cao cấp\n Tư vấn chuyên nghiệp\n Địa chỉ và giờ mở cửa`
          : `Visit Adam Store${
              location ? ` in ${location}` : ''
            }\n Experience premium men's fashion\n Professional consultation\n Address and opening hours`,
    }),

  // Contact page
  contact: (locale: string) =>
    createPageMetadata({
      title: locale === 'vi' ? 'Liên Hệ' : 'Contact Us',
      description:
        locale === 'vi'
          ? 'Liên hệ với Adam Store để được tư vấn về sản phẩm thời trang nam. Hotline, email, địa chỉ cửa hàng và thông tin hỗ trợ khách hàng.'
          : "Contact Adam Store for men's fashion consultation. Hotline, email, store address and customer support information.",
      keywords:
        locale === 'vi'
          ? ['liên hệ', 'tư vấn', 'hỗ trợ khách hàng', 'Adam Store contact']
          : [
              'contact',
              'consultation',
              'customer support',
              'Adam Store contact',
            ],
      canonical: `/${locale}/contact`,
    }),

  // Product category
  category: (locale: string, categoryName: string, categoryId: string) =>
    createPageMetadata({
      title:
        locale === 'vi'
          ? `${categoryName} - Thời Trang Nam Adam Store`
          : `${categoryName} - Adam Store Men's Fashion`,
      description:
        locale === 'vi'
          ? `Khám phá bộ sưu tập ${categoryName} tại Adam Store. Thời trang nam cao cấp, phong cách hiện đại với chất lượng đảm bảo.`
          : `Explore ${categoryName} collection at Adam Store. Premium men's fashion, modern style with guaranteed quality.`,
      keywords:
        locale === 'vi'
          ? [
              categoryName.toLowerCase(),
              'thời trang nam',
              'Adam Store',
              'mua sắm online',
            ]
          : [
              categoryName.toLowerCase(),
              "men's fashion",
              'Adam Store',
              'online shopping',
            ],
      canonical: `/${locale}/detail?category=${categoryId}`,
      category: categoryName,
    }),

  // Best Seller Products
  bestSeller: (locale: string) =>
    createPageMetadata({
      title: locale === 'vi' ? `Sản Phẩm Bán Chạy` : `Best Sellers`,
      description:
        locale === 'vi'
          ? `Khám phá những sản phẩm bán chạy nhất tại Adam Store. Thời trang nam được yêu thích nhất, chất lượng cao và phong cách hiện đại được khách hàng tin tưởng lựa chọn.`
          : `Discover the best-selling products at Adam Store. Most popular men's fashion items with high quality and modern style trusted by customers.`,
      keywords:
        locale === 'vi'
          ? [
              'sản phẩm bán chạy',
              'best seller',
              'thời trang nam hot',
              'Adam Store',
              'mua sắm online',
              'sản phẩm hot',
              'xu hướng thời trang',
            ]
          : [
              'best sellers',
              'popular products',
              'trending fashion',
              'Adam Store',
              'online shopping',
              'hot items',
              'fashion trends',
            ],
      canonical: `/${locale}/best-sellers`,
      category: 'Best Sellers',

      // OpenGraph for social sharing
      ogTitle:
        locale === 'vi'
          ? `Sản Phẩm Bán Chạy - Adam Store | Thời Trang Nam Hot Nhất`
          : `Best Sellers - Adam Store | Hottest Men's Fashion`,

      ogDescription:
        locale === 'vi'
          ? `Top sản phẩm bán chạy tại Adam Store\n Được khách hàng yêu thích nhất\n Thời trang nam chất lượng cao\n🚀 Xu hướng hot nhất hiện tại`
          : `Top best-selling products at Adam Store\n Most loved by customers\n High-quality men's fashion\n🚀 Hottest current trends`,

      ogImage: '/imgs/best-sellers.jpg',
    }),

  // New Products
  news: (locale: string) =>
    createPageMetadata({
      title: locale === 'vi' ? `Sản Phẩm Mới Nhất` : `Newest Products`,
      description:
        locale === 'vi'
          ? `Khám phá những sản phẩm mới nhất tại Adam Store. Thời trang nam được yêu thích nhất, chất lượng cao và phong cách hiện đại được khách hàng tin tưởng lựa chọn.`
          : `Discover the newest products at Adam Store. Most popular men's fashion items with high quality and modern style trusted by customers.`,
      keywords:
        locale === 'vi'
          ? [
              'sản phẩm mới nhất',
              'newest products',
              'thời trang nam hot',
              'Adam Store',
              'mua sắm online',
              'sản phẩm hot',
              'xu hướng thời trang',
            ]
          : [
              'newest products',
              'popular products',
              'trending fashion',
              'Adam Store',
              'online shopping',
              'hot items',
              'fashion trends',
            ],
      canonical: `/${locale}/news`,
      category: 'New Products',

      // OpenGraph for social sharing
      ogTitle:
        locale === 'vi'
          ? `Sản Phẩm Bán Chạy - Adam Store | Thời Trang Nam Hot Nhất`
          : `Best Sellers - Adam Store | Hottest Men's Fashion`,

      ogDescription:
        locale === 'vi'
          ? `Top sản phẩm bán chạy tại Adam Store\n Được khách hàng yêu thích nhất\n Thời trang nam chất lượng cao\n🚀 Xu hướng hot nhất hiện tại`
          : `Top best-selling products at Adam Store\n Most loved by customers\n High-quality men's fashion\n🚀 Hottest current trends`,

      ogImage: '/imgs/best-sellers.jpg',
    }),

  // Product detail
  product: (
    locale: string,
    productName: string,
    productId: string,
    productImage?: string,
    productPrice?: string
  ) =>
    createPageMetadata({
      title: `${productName}`,
      description:
        locale === 'vi'
          ? `Mua ${productName} chính hãng tại Adam Store. Chất lượng cao, giá tốt, giao hàng nhanh chóng. Đặt hàng ngay!`
          : `Buy authentic ${productName} at Adam Store. High quality, great price, fast delivery. Order now!`,
      canonical: `/${locale}/product/${productId}`,

      // OpenGraph for social sharing
      ogTitle:
        locale === 'vi'
          ? `${productName} - Adam Store | Thời Trang Nam Cao Cấp`
          : `${productName} - Adam Store | Premium Men's Fashion`,

      ogDescription:
        locale === 'vi'
          ? `${productName} chính hãng tại Adam Store${
              productPrice ? ` - Giá: ${productPrice}` : ''
            }\n Giao hàng nhanh toàn quốc\n Chất lượng đảm bảo\n Tư vấn 24/7`
          : `Authentic ${productName} at Adam Store${
              productPrice ? ` - Price: ${productPrice}` : ''
            }\n Fast nationwide delivery\n Quality guaranteed\n 24/7 consultation`,

      // Product image for social sharing
      ogImage: productImage || '/imgs/product-default-og.jpg',

      // Twitter specific image (can be different from OG)
      twitterImage: productImage || '/imgs/product-default-twitter.jpg',

      // Product category
      category: 'Product',

      // Additional keywords for product
      keywords:
        locale === 'vi'
          ? [
              productName.toLowerCase(),
              'thời trang nam',
              'Adam Store',
              'mua sắm online',
              'chất lượng cao',
              'giao hàng nhanh',
            ]
          : [
              productName.toLowerCase(),
              "men's fashion",
              'Adam Store',
              'online shopping',
              'high quality',
              'fast delivery',
            ],
    }),

  // Admin pages - no index
  adminDashboard: (locale: string) =>
    createPageMetadata({
      title: locale === 'vi' ? 'Bảng Điều Khiển' : 'Dashboard',
      description: 'Admin dashboard for Adam Store management',
      noIndex: true,
    }),

  adminProducts: (locale: string) =>
    createPageMetadata({
      title: locale === 'vi' ? 'Quản Lý Sản Phẩm' : 'Product Management',
      description: 'Product management dashboard',
      noIndex: true,
    }),

  adminOrders: (locale: string) =>
    createPageMetadata({
      title: locale === 'vi' ? 'Quản Lý Đơn Hàng' : 'Order Management',
      description: 'Order management dashboard',
      noIndex: true,
    }),
};
