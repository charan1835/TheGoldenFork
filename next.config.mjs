/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['media.graphassets.com', 'ap-south-1.graphassets.com'],
    },
    // Enable compression for better performance
    compress: true,
    // Generate static pages during build for better SEO
    output: 'standalone',
    // Configure headers for security and SEO
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
  };
  
  export default nextConfig;
