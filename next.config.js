/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Exclude test files from page discovery
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

  // Compress responses for better performance
  compress: true,

  // Image optimization for better performance and SEO
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security and SEO headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },

  webpack: (config, { isServer }) => {
    // Exclude test files from webpack compilation
    config.module.rules.push({
      test: /\.(test|spec)\.(ts|tsx|js|jsx)$/,
      use: 'ignore-loader',
    });

    // Exclude __tests__ directories from being processed
    config.module.rules.push({
      test: /__tests__\/.*\.(ts|tsx|js|jsx)$/,
      use: 'ignore-loader',
    });

    return config;
  },
}

module.exports = nextConfig

