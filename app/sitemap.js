// Dynamic sitemap generation for SEO
import { siteConfig } from './metadata';

export default function sitemap() {
  const baseUrl = siteConfig.url;
  const currentDate = new Date().toISOString();

  // Define all your routes here
  const routes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: currentDate,
      changeFrequency: 'always',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: currentDate,
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/connect`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/my-orders`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/order-confirmation`,
      lastModified: currentDate,
      changeFrequency: 'always',
      priority: 0.8,
    },
  ];

  return routes;
}
