
const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
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
    ],
    dangerouslyAllowSVG: false, // Set to true only if you trust your SVG sources
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

}

export default nextConfig;
