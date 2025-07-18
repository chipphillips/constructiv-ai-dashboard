/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for Next.js 15
  experimental: {
    // Enable React Server Components
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
    // Enable optimized package imports
    optimizePackageImports: ['lucide-react', 'recharts']
  },

  // TypeScript configuration
  typescript: {
    // Enable strict mode for better type safety
    ignoreBuildErrors: false
  },

  // ESLint configuration
  eslint: {
    // Enable linting during builds
    ignoreDuringBuilds: false,
    // Specify directories to lint
    dirs: ['pages', 'components', 'lib', 'app']
  },

  // Performance optimizations
  swcMinify: true,
  
  // Enable compression
  compress: true,

  // Power the application with React 18 features
  reactStrictMode: true,

  // Image optimization
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/webp', 'image/avif']
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },

  // Webpack configuration for bundle analysis
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Bundle analyzer
    if (process.env.ANALYZE) {
      const BundleAnalyzerPlugin = require('@next/bundle-analyzer')();
      config.plugins.push(new BundleAnalyzerPlugin());
    }

    return config;
  },

  // Output configuration
  output: 'standalone',
  
  // Enable static exports for specific routes if needed
  trailingSlash: false,
  
  // Redirect configuration
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/',
        permanent: true
      }
    ];
  },

  // Rewrite configuration for API routes
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/health'
      }
    ];
  }
};

// Export configuration with bundle analyzer if enabled
module.exports = process.env.ANALYZE === 'true' 
  ? require('@next/bundle-analyzer')({ enabled: true })(nextConfig)
  : nextConfig;