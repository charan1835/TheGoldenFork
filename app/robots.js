// Dynamic robots.txt generation
import { siteConfig } from './metadata';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/dashboard/',
          '/checkout',
          '/my-orders',
          '/order-confirmation',
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
