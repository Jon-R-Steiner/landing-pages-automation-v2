/** @type {import('next').NextConfig} */
const nextConfig = {
  // CRITICAL: Static export mode (no serverless functions at runtime)
  output: 'export',

  // Disable features not supported in static export
  images: {
    unoptimized: true, // next/image doesn't work with output: 'export'
  },

  // Memory optimization for large static builds (future: 500+ pages)
  experimental: {
    webpackMemoryOptimizations: true,
  },

  // SEO optimization: trailing slashes for clean URLs
  trailingSlash: true,

  // Disable source maps in production (smaller bundle)
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
