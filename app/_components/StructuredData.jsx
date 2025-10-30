"use client";
import { siteConfig } from "../metadata";

// Structured Data (JSON-LD) for Rich Snippets in Google Search
export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": siteConfig.name,
    "image": siteConfig.ogImage,
    "url": siteConfig.url,
    "description": siteConfig.description,
    "servesCuisine": "Multi-Cuisine",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "telephone": "+918688605760",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "09:00",
        "closes": "23:00"
      }
    ],
    "potentialAction": {
      "@type": "OrderAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteConfig.url}/cart`,
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      }
    },
    "sameAs": [
      siteConfig.links.facebook,
      siteConfig.links.twitter,
      siteConfig.links.instagram
    ]
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteConfig.name,
    "url": siteConfig.url,
    "logo": `${siteConfig.url}/logo.png`,
    "sameAs": [
      siteConfig.links.facebook,
      siteConfig.links.twitter,
      siteConfig.links.instagram
    ]
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteConfig.name,
    "url": siteConfig.url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteConfig.url}/?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData),
        }}
      />
    </>
  );
}
