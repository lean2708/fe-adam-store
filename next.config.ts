import withNextIntl from 'next-intl/plugin';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { NextConfig } from 'next';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});
const config: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // if you use placeholder.com images
      },
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com', // if you use placeholder.com images
      },
    ],
    dangerouslyAllowSVG: false, // Set to true only if you trust your SVG sources
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    deviceSizes: [320, 504, 665, 850, 1008, 1125],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default bundleAnalyzer(withNextIntl()(config));
