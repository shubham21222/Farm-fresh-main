/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  images: {
    domains: ['images.unsplash.com', 'plus.unsplash.com'],
  },
  // Remove the static export configuration since we're using middleware
  // This will allow middleware to work properly
  experimental: {
    serverActions: true,
  }
};

export default nextConfig; 