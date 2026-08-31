/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow both local and remote images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Add PNG to supported formats
    formats: ['image/avif', 'image/webp'],
    // Configure quality settings
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Allow all quality values
    minimumCacheTTL: 60,
    // Disable optimization if you want to use the image as-is
    // unoptimized: true, // Uncomment this if you want to disable Next.js image optimization
  },
  // Disable automatic image preloading
  compiler: {
    removeConsole: false,
  },

}

module.exports = nextConfig