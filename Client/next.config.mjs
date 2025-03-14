/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    images: {
        unoptimized: true,
        domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com','via.placeholder.com','bid.nyelizabeth.com','hebbkx1anhila5yf.public.blob.vercel-storage.com','i.ibb.co' ,'img1.wsimg.com' ,'auction.nyelizabeth.com', 'beta.nyelizabeth.com', 'images.liveauctioneers.com', 'p1.liveauctioneers.com','source.unsplash.com','images.unsplash.com','images.pexels.com','cdn.pixabay.com'],
    },
    assetPrefix: '',
    basePath: '',
    distDir: 'dist',
    experimental: {
        appDir: true
    }
};

export default nextConfig;
