import type { Metadata, Viewport } from 'next';
import '../globals.css';
import { Toaster } from 'sonner';
import ThemeProvider from '@/providers/theme-provider';
import AuthProvider from '@/providers/auth-provider';
import { fontVariables } from '@/config/fonts';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { QueryProvider } from '@/providers/react-query-provider';
import CartInitializer from '@/providers/CartInitializer';
import { generateBaseMetadata } from '@/lib/metadata';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateBaseMetadata(locale);
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
};

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

async function getMetaDescription(locale: string): Promise<string> {
  const isVietnamese = locale === 'vi';
  return isVietnamese
    ? 'Khám phá sản phẩm cao cấp tại Adam Store. Điểm đến tin cậy cho mua sắm chất lượng với dịch vụ xuất sắc và giao hàng nhanh.'
    : 'Discover premium products at Adam Store. Your trusted destination for quality shopping with exceptional service and fast delivery.';
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  const metaDescription = await getMetaDescription(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Explicit meta description - This ensures Chrome DevTools can see it */}
        <meta name='description' content={metaDescription} />

        {/* Additional explicit meta tags for better SEO */}
        <meta
          name='keywords'
          content={
            locale === 'vi'
              ? 'mua sắm trực tuyến, sản phẩm cao cấp, thương mại điện tử, thời trang, điện tử, đồ gia dụng, sản phẩm chất lượng, giao hàng nhanh, thời trang nam'
              : 'online shopping, premium products, e-commerce, fashion, electronics, home goods, quality products, fast delivery, menswear'
          }
        />
        <meta name='author' content='Adam Store Team' />
        <meta name='language' content={locale} />
        <meta
          name='content-language'
          content={locale === 'vi' ? 'vi-VN' : 'en-US'}
        />
        <meta name='rating' content='general' />
        <meta name='distribution' content='global' />
        <meta name='revisit-after' content='7 days' />
        <meta name='copyright' content='Adam Store' />

        {/* Preconnect and DNS prefetch */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link rel='dns-prefetch' href='https://api.adamstore.com' />

        {/* Format detection */}
        <meta
          name='format-detection'
          content='telephone=no, date=no, email=no, address=no'
        />
      </head>
      <body
        className={`${fontVariables} antialiased font-sans min-h-screen bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AuthProvider>
              <QueryProvider>
                <CartInitializer />
                {children}
              </QueryProvider>
              <Toaster
                richColors
                position='top-right'
                expand={false}
                visibleToasts={4}
              />
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
