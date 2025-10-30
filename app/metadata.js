// Shared metadata configuration for SEO
export const siteConfig = {
  name: "The Golden Fork",
  title: "The Golden Fork - Premium Restaurant & Food Delivery",
  description: "Experience exquisite dining at The Golden Fork. Order your favorite dishes online with fast delivery. Premium quality food, exceptional service, and unforgettable flavors.",
  url: "https://www.thegoldenfork.me",
  ogImage: "https://www.thegoldenfork.me/og-image.jpg",
  keywords: [
    "restaurant",
    "food delivery",
    "online food order",
    "premium dining",
    "The Golden Fork",
    "best restaurant",
    "food delivery near me",
    "online ordering",
    "gourmet food",
    "fine dining"
  ],
  links: {
    twitter: "https://twitter.com/thegoldenfork",
    facebook: "https://facebook.com/thegoldenfork",
    instagram: "https://instagram.com/thegoldenfork"
  }
};

export const baseMetadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@thegoldenfork",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE", // Replace with actual verification code
    // yandex: "YOUR_YANDEX_VERIFICATION_CODE",
    // bing: "YOUR_BING_VERIFICATION_CODE",
  },
};
